<h1 align="center">CodexRoxas</h1>
<p align="center">Community fork of <a href="https://github.com/openai/codex">openai/codex</a> &mdash; <strong>not affiliated with or endorsed by OpenAI</strong></p>

<p align="center"><code>npm i -g @openai/codex</code><br />or <code>brew install --cask codex</code></p>
<p align="center"><strong>Codex CLI</strong> is a lightweight coding agent that runs locally on your computer.
<p align="center">
  <img src="https://github.com/Waste1and/codexroxas/blob/main/.github/codex-cli-splash.png" alt="Codex CLI splash" width="80%" />
</p>
</br>
If you want Codex in your code editor (VS Code, Cursor, Windsurf), <a href="https://developers.openai.com/codex/ide">install in your IDE.</a>
</br>If you want the desktop app experience, run <code>codex app</code> or visit <a href="https://chatgpt.com/codex?app-landing-page=true">the Codex App page</a>.
</br>If you are looking for the <em>cloud-based agent</em> from OpenAI, <strong>Codex Web</strong>, go to <a href="https://chatgpt.com/codex">chatgpt.com/codex</a>.</p>

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
  - [ ] Require review from Code Owners (requires `.github/CODEOWNERS` — ensures @Waste1and reviews all changes)
- [ ] Require status checks to pass before merging (select relevant CI checks)
- [ ] Block force-pushes (leave "Allow force pushes" unchecked)
- [ ] Block branch deletion (leave "Allow deletions" unchecked)
- [ ] _(Optional)_ Require signed commits
