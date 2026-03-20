# Security Policy

> **Note:** CodexRoxas is a community fork of [`openai/codex`](https://github.com/openai/codex)
> and is **not affiliated with or endorsed by OpenAI**.
> Security issues specific to this fork should be reported via the process below.
> Vulnerabilities in the upstream project should be reported to OpenAI directly.

Thank you for helping keep CodexRoxas secure!

## Reporting Fork-Specific Vulnerabilities

If you discover a security vulnerability **specific to this fork** (CodexRoxas / Mecasimetra),
please report it responsibly:

1. **Open a private GitHub Security Advisory** via the
   [Security tab](https://github.com/Waste1and/codexroxas/security/advisories/new)
   on this repository. This keeps the report confidential until a fix is in place.
2. Alternatively, contact the maintainer directly via
   [GitHub Issues](https://github.com/Waste1and/codexroxas/issues) — prefix your
   issue title with `[SECURITY]` for triage priority.

### What to include

- A clear description of the vulnerability and potential impact
- Steps to reproduce or a minimal proof-of-concept
- Affected versions or components (CLI, TUI, app-server, website, etc.)
- Suggested remediation if you have one

We aim to acknowledge reports within **72 hours** and to provide a resolution timeline within
**14 days** for critical issues.

## Responsible Disclosure Policy

- Please do not publicly disclose vulnerabilities before a fix is available.
- We will credit researchers in the release notes unless anonymity is requested.
- We do not run a bug bounty program at this time.

## Upstream (OpenAI Codex) Vulnerabilities

For vulnerabilities in the original [`openai/codex`](https://github.com/openai/codex) codebase
that also affect this fork, please report to **OpenAI first**:

OpenAI's security program is managed through Bugcrowd, and we ask that any validated vulnerabilities
be reported via the [Bugcrowd program](https://bugcrowd.com/engagements/openai).
Vulnerability Program Guidelines are defined on the
[Bugcrowd program page](https://bugcrowd.com/engagements/openai).

After reporting upstream, please also open a
[GitHub Security Advisory](https://github.com/Waste1and/codexroxas/security/advisories/new)
in this repository so the fork can be patched independently if needed.

## Scope

The following are **in scope** for this fork's security policy:

- Fork-specific code changes in `codex-rs/`, `codex-cli/`, `shell-tool-mcp/`
- Website files: `index.html`, `assets/`, `data/terms.json`
- Configuration handling, credential storage, and sandbox enforcement changes made in this fork

The following are **out of scope** (report upstream):

- Vulnerabilities present in the upstream `openai/codex` codebase without modification by this fork
- Third-party dependencies (report to the respective upstream maintainer)

## No Safety-Critical Use

This software is **not certified for safety-critical applications**.
See [DISCLAIMER.md](DISCLAIMER.md) for the full no-warranty statement.
