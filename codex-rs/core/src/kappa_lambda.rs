//! Kappa-Lambda (κ–λ) Continuity Framework
//!
//! Tracks two conversational health metrics that give a quick read on how
//! reliably the agent is completing turns:
//!
//! - **λ (lambda)** – *miss rate*: the fraction of turns that ended in failure.
//!   `λ = 1 - hits / total_queries`
//!   A value of 0.0 means every turn succeeded; 1.0 means every turn failed.
//!   A session is considered **healthy** when λ is close to 0 and **degraded**
//!   when λ approaches 1.
//!
//! - **κ (kappa)** – *retention probability*: a smoothed score that captures
//!   how much accumulated failure has been observed relative to the number of
//!   queries.  Derived from the survival-analysis relationship:
//!   `κ = exp(-λ × total_queries × KAPPA_DECAY_FACTOR)`
//!   κ starts at 1.0 (fully healthy) and approaches 0.0 as misses accumulate.
//!
//! - **β_c** – *lambda warning threshold*: as specified in the Kappology K35_AI
//!   design, this is set to 2.0.  Because λ is a proportion it cannot exceed
//!   1.0 under the current formula, so the threshold acts as a safeguard for
//!   future formula variants that may compute λ differently (e.g. time-weighted
//!   hazard rates).  It is intentionally permissive and will not fire under
//!   normal operation.

use std::sync::atomic::{AtomicU64, Ordering};

use tracing::warn;

/// Scaling factor applied in the κ formula.
///
/// Chosen so that after 20 consecutive all-miss turns κ drops to ≈ e^{-1} ≈
/// 0.37, giving a measurable decay signal without over-penalising isolated
/// failures.
const KAPPA_DECAY_FACTOR: f64 = 0.05;

/// λ threshold above which a health warning is logged.
///
/// Set to 2.0 per the Kappology K35_AI specification.  Under the current
/// miss-rate formula λ ≤ 1.0, so this threshold is intentionally unreachable
/// and serves as a guard for future formula variants that may produce λ > 1.
pub const LAMBDA_WARNING_THRESHOLD: f64 = 2.0;

/// Snapshot of the current κ–λ health state.
#[derive(Clone, Debug, PartialEq)]
pub struct HealthStatus {
    /// Retention probability κ = exp(-λ × total_queries × KAPPA_DECAY_FACTOR).
    pub kappa: f64,
    /// Miss rate λ = 1 - hits / total_queries (0.0 when no queries yet).
    pub lambda: f64,
    /// Total number of completed turns (hits + misses).
    pub total_queries: u64,
    /// Number of turns that completed successfully.
    pub hits: u64,
}

/// Thread-safe κ–λ health tracker.
///
/// Tracks the number of completed turns and how many were successful ("hits").
/// After each update the new λ and κ values are recomputed and – if λ exceeds
/// [`LAMBDA_WARNING_THRESHOLD`] – a warning is logged.
#[derive(Debug, Default)]
pub struct KappaLambdaHealth {
    total_queries: AtomicU64,
    hits: AtomicU64,
}

impl KappaLambdaHealth {
    /// Create a new health tracker starting from zero.
    pub fn new() -> Self {
        Self::default()
    }

    /// Record a successful turn outcome (a "hit").
    pub fn record_hit(&self) {
        self.total_queries.fetch_add(1, Ordering::Relaxed);
        self.hits.fetch_add(1, Ordering::Relaxed);
        self.check_threshold();
    }

    /// Record a failed turn outcome (a "miss").
    pub fn record_miss(&self) {
        self.total_queries.fetch_add(1, Ordering::Relaxed);
        self.check_threshold();
    }

    /// Return a point-in-time snapshot of the current health metrics.
    pub fn status(&self) -> HealthStatus {
        let total = self.total_queries.load(Ordering::Relaxed);
        let hits = self.hits.load(Ordering::Relaxed);
        let (lambda, kappa) = compute_metrics(total, hits);
        HealthStatus {
            kappa,
            lambda,
            total_queries: total,
            hits,
        }
    }

    fn check_threshold(&self) {
        let total = self.total_queries.load(Ordering::Relaxed);
        let hits = self.hits.load(Ordering::Relaxed);
        let (lambda, kappa) = compute_metrics(total, hits);
        if lambda > LAMBDA_WARNING_THRESHOLD {
            warn!(
                "κ–λ health warning: λ={lambda:.4} has exceeded the warning threshold \
                 {LAMBDA_WARNING_THRESHOLD:.1} (κ={kappa:.4}, total={total}, hits={hits}). \
                 Review agent health and consider pausing operations.",
            );
        }
    }
}

/// Compute (λ, κ) from raw counters.
fn compute_metrics(total_queries: u64, hits: u64) -> (f64, f64) {
    if total_queries == 0 {
        return (0.0, 1.0);
    }
    let lambda = 1.0 - (hits as f64 / total_queries as f64);
    let kappa = (-lambda * total_queries as f64 * KAPPA_DECAY_FACTOR).exp();
    (lambda, kappa)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn initial_state_is_healthy() {
        let h = KappaLambdaHealth::new();
        assert_eq!(
            h.status(),
            HealthStatus {
                kappa: 1.0,
                lambda: 0.0,
                total_queries: 0,
                hits: 0,
            }
        );
    }

    #[test]
    fn all_hits_gives_zero_lambda() {
        let h = KappaLambdaHealth::new();
        h.record_hit();
        h.record_hit();
        h.record_hit();
        let s = h.status();
        assert_eq!(s.total_queries, 3);
        assert_eq!(s.hits, 3);
        assert!((s.lambda - 0.0).abs() < 1e-9);
        // κ = exp(0) = 1.0
        assert!((s.kappa - 1.0).abs() < 1e-9);
    }

    #[test]
    fn all_misses_gives_lambda_one() {
        let h = KappaLambdaHealth::new();
        h.record_miss();
        h.record_miss();
        let s = h.status();
        assert_eq!(s.total_queries, 2);
        assert_eq!(s.hits, 0);
        assert!((s.lambda - 1.0).abs() < 1e-9);
        // κ = exp(-1.0 * 2 * KAPPA_DECAY_FACTOR) = exp(-0.1)
        let expected_kappa = (-1.0_f64 * 2.0 * KAPPA_DECAY_FACTOR).exp();
        assert!((s.kappa - expected_kappa).abs() < 1e-9);
    }

    #[test]
    fn mixed_turns_compute_correctly() {
        let h = KappaLambdaHealth::new();
        // 3 hits, 1 miss → total=4, hits=3
        h.record_hit();
        h.record_hit();
        h.record_miss();
        h.record_hit();
        let s = h.status();
        assert_eq!(s.total_queries, 4);
        assert_eq!(s.hits, 3);
        // λ = 1 - 3/4 = 0.25
        assert!((s.lambda - 0.25).abs() < 1e-9);
        // κ = exp(-0.25 * 4 * KAPPA_DECAY_FACTOR) = exp(-0.05)
        let expected_kappa = (-0.25_f64 * 4.0 * KAPPA_DECAY_FACTOR).exp();
        assert!((s.kappa - expected_kappa).abs() < 1e-9);
    }
}
