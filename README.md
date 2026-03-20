<h1 align="center">CodexRoxas · Mecasimetra</h1>
<p align="center">Community fork of <a href="https://github.com/openai/codex">openai/codex</a> &mdash; <strong>not affiliated with or endorsed by OpenAI</strong></p>
<p align="center">
  <a href="https://github.com/Waste1and/codexroxas/actions/workflows/site-ci.yml"><img src="https://github.com/Waste1and/codexroxas/actions/workflows/site-ci.yml/badge.svg" alt="Site CI" /></a>
  <img src="https://img.shields.io/badge/theme-black%20neon%20%2B%20magenta-ff00aa?style=flat-square" alt="Theme: black neon + magenta" />
  <img src="https://img.shields.io/badge/framework-Kappology-00e5ff?style=flat-square" alt="Kappology framework" />
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square" alt="Apache 2.0" />
</p>

---

## Table of Contents

- [Mecasimetra Website](#mecasimetra--black-neon--magenta-design)
- [Kappology — The Knowledge Model](#kappology--the-knowledge-model)
- [Local Development](#local-development)
- [Codex CLI Quickstart](#quickstart)
- [Documentation](#docs)
- [Branch Protection Checklist](#branch-protection-checklist-for-repo-admins)

---

## Mecasimetra · Black Neon + Magenta Design

This repository includes a static **GitHub Pages website** built with the Mecasimetra visual
identity: a **black neon + magenta** aesthetic that reflects the precision and formalism of
the Kappology control-systems framework.

### Design Intent

| Token | Value | Purpose |
|---|---|---|
| Background | `#07070e` | Near-black — eliminates visual noise, lets neon colors read with maximum contrast |
| Primary accent | `#ff00aa` (magenta) | Core brand color — authority, precision |
| Secondary accent | `#00e5ff` (cyan) | Supporting accent — data, formulas, navigation |
| Typography | JetBrains Mono + Inter | Monospace for technical content, humanist sans for prose |
| Motion | CSS animations + `prefers-reduced-motion` | Glow pulses, fade-ins, scroll reveals; fully disabled for users who prefer reduced motion |

The design draws from terminal aesthetics, scientific notation, and the visual language of
control systems — reinforcing that this is engineering software, not consumer software.

---

## Kappology — The Knowledge Model

**Kappology** is a continuity-first mathematical framework for governing control systems,
founded by **Zechariah Slaughter** (Engineer & Founder, Mecasimetra Systems).

### Core Concepts

| Symbol | Name | Formula | Description |
|---|---|---|---|
| **κ** | Kappa | `κ = exp(−Λ(t))` | Continuity scalar ∈ \[0, 1\]. κ = 1 = perfect continuity; κ = 0 = complete failure. |
| **λ** | Lambda | `λ(t) ≥ 0` | Instantaneous hazard rate. The primary control variable. |
| **Λ(t)** | Hazard Accumulation | `Λ(t) = ∫₀ᵗ λ(s) ds` | Cumulative integral of λ — total accumulated risk. |
| **β_c** | Bifurcation Threshold | `β_c = 2.0` | If `λ > β_c`, the system must pause, shed load, or retrain. Cannot be bypassed. |
| **𝒞** | Continuity | `𝒞 ≡ κ → 1` | Unbroken operational integrity. Governed by keeping κ near 1. |

### Interactive Glossary

The site includes a **client-side knowledge graph** (`data/terms.json`) with animated
ancestor transitions. Clicking any term navigates its concept hierarchy — from derived
terms up to foundational concepts — with animated breadcrumb navigation and search.

#### Adding or editing glossary terms

Open `data/terms.json` and add or modify an entry following this schema:

```json
{
  "id": "my-term",
  "symbol": "Ω",
  "name": "My Term",
  "short": "One-line description",
  "definition": "Full definition text.",
  "ancestors": ["parent-term-id"],
  "children": ["child-term-id"],
  "formula": "optional formula string",
  "tags": ["tag1", "tag2"]
}
```

- `id` — unique kebab-case identifier used in URL routing (`#/term/my-term`)
- `ancestors` — IDs of parent/prerequisite concepts (shown as "↑" navigation links)
- `children` — IDs of derived concepts (shown as "→" navigation links)
- `formula` — rendered in monospace with cyan glow; use Unicode math characters

---

## Local Development

The site is **pure static HTML/CSS/JS** — no build step required.

```bash
# Clone the repository
git clone https://github.com/Waste1and/codexroxas.git
cd codexroxas

# Serve with any static file server, e.g.:
npx serve .
# or
python3 -m http.server 8080
# or open index.html directly in your browser
```

> **Note:** The knowledge graph (`data/terms.json`) is loaded via `fetch()` so you need
> a local server (not `file://`) for the glossary to work. `npx serve .` handles this.

### File structure (website)

```
index.html            — main page (hero, about, founder, knowledge, services)
assets/
  css/style.css       — all styles (design tokens, layout, animations)
  js/main.js          — navigation, scroll reveal, cursor trail
  js/glossary.js      — knowledge graph: fetch, render, search, transitions
data/
  terms.json          — Kappology term definitions and relationships
  terms.schema.json   — JSON Schema for terms.json (validated in CI)
DISCLAIMER.md         — no warranty, no safety-critical use
SECURITY.md           — vulnerability reporting
LICENSE               — Apache License 2.0
```

---

> **Disclaimer:** CodexRoxas is an independent community fork of [`openai/codex`](https://github.com/openai/codex).
> It is **not** affiliated with, sponsored by, or endorsed by OpenAI.
> The upstream project is © OpenAI and licensed under the Apache-2.0 License (see [LICENSE](LICENSE) and [NOTICE](NOTICE)).

---

## Quickstart

### Installing and running Codex CLI

Install globally with your preferred package manager:

```shell
# Install using npm
npm install -g @openai/codex
```

```shell
# Install using Homebrew
brew install --cask codex
```

Then simply run `codex` to get started.

<details>
<summary>You can also go to the <a href="https://github.com/Waste1and/codexroxas/releases/latest">latest GitHub Release</a> and download the appropriate binary for your platform.</summary>

Each GitHub Release contains many executables, but in practice, you likely want one of these:

- macOS
  - Apple Silicon/arm64: `codex-aarch64-apple-darwin.tar.gz`
  - x86_64 (older Mac hardware): `codex-x86_64-apple-darwin.tar.gz`
- Linux
  - x86_64: `codex-x86_64-unknown-linux-musl.tar.gz`
  - arm64: `codex-aarch64-unknown-linux-musl.tar.gz`

Each archive contains a single entry with the platform baked into the name (e.g., `codex-x86_64-unknown-linux-musl`), so you likely want to rename it to `codex` after extracting it.

</details>

### Using Codex with your ChatGPT plan

Run `codex` and select **Sign in with ChatGPT**. We recommend signing into your ChatGPT account to use Codex as part of your Plus, Pro, Team, Edu, or Enterprise plan. [Learn more about what's included in your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt).

You can also use Codex with an API key, but this requires [additional setup](https://developers.openai.com/codex/auth#sign-in-with-an-api-key).

## Docs

- [**Codex Documentation**](https://developers.openai.com/codex) (upstream docs)
- [**Contributing**](./docs/contributing.md)
- [**Installing & building**](./docs/install.md)
- [**Open source fund**](./docs/open-source-fund.md)

This repository is licensed under the [Apache-2.0 License](LICENSE).
Upstream project: [`openai/codex`](https://github.com/openai/codex) — © OpenAI, Apache-2.0.

## Branch protection checklist (for repo admins)

Apply these settings under **Settings → Branches → Add rule → `main`** in the GitHub UI:

- [ ] Require a pull request before merging
  - [ ] Required approvals: **2** (total PR approvals; satisfied by any combination of reviewers)
  - [ ] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners (`.github/CODEOWNERS` is configured — ensures @Waste1and reviews all changes)
- [ ] Require status checks to pass before merging (select: `validate-terms`, `prettier`, `codespell`)
- [ ] Block force-pushes (leave "Allow force pushes" unchecked)
- [ ] Block branch deletion (leave "Allow deletions" unchecked)
- [ ] _(Optional)_ Require signed commits
