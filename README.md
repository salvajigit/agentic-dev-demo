# Live Agentic Developer Demo

A real end-to-end demo showing an AI agent processing Jira tickets, writing code, and creating GitHub PRs.

## Prerequisites

| Tool | Purpose | Setup |
|------|---------|-------|
| **Jira Cloud** | Sprint board with tickets | Free at atlassian.com |
| **GitHub** | Code repo + PRs | Your account |
| **Kiro CLI** | The AI agent | Already installed |
| **Node.js 20+** | Sample project runtime | `brew install node` |

## Quick Start

```bash
# 1. Clone and setup the demo project
cd ~/Desktop/agentic-dev-demo
npm install

# 2. Configure your credentials
cp .env.example .env
# Edit .env with your Jira + GitHub tokens

# 3. Seed Jira with demo tickets
node scripts/seed-jira.js

# 4. Run the agent (via Kiro CLI in this directory)
kiro chat
# Then say: "Pick up the next ticket from my sprint and implement it"
```

## What Happens During the Demo

1. Agent calls Jira MCP → reads ticket details + acceptance criteria
2. Agent calls Filesystem MCP → searches codebase for relevant files
3. Agent edits files → implements the fix/feature
4. Agent runs `npm test` → verifies the change
5. Agent calls Git → commits, pushes branch, creates PR
6. Agent calls Jira MCP → transitions ticket to "In Review", links PR

## Project Structure

```
agentic-dev-demo/
├── .mcp.json              ← MCP server configuration
├── .env.example           ← Credentials template
├── package.json           ← Node.js project
├── src/
│   ├── index.ts           ← Express API entry point
│   ├── routes/
│   │   └── users.ts       ← Users endpoint (agent works here)
│   ├── middleware/
│   │   └── validate.ts    ← Validation middleware
│   └── utils/
│       └── paginate.ts    ← Pagination helper (empty — agent fills)
├── tests/
│   └── users.test.ts      ← Test file
├── scripts/
│   ├── seed-jira.js       ← Creates demo tickets
│   └── reset-demo.js      ← Resets repo + Jira for re-run
└── DEMO-GUIDE.md          ← Presenter script
```

## Resetting for Re-Demo

```bash
node scripts/reset-demo.js   # Deletes branches, resets Jira tickets
git checkout main && git pull
```
