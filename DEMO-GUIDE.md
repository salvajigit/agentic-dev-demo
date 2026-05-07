# Live Demo Guide: Agentic Developer Day

## Pre-Demo Setup (do once)

```bash
# 1. Create a Jira project (free tier works)
#    - Go to atlassian.com → create project "DEMO" with Kanban board
#    - Generate API token: https://id.atlassian.com/manage-profile/security/api-tokens

# 2. Create GitHub repo
gh repo create agentic-dev-demo --public --source=. --push

# 3. Configure credentials
cp .env.example .env
# Fill in your Jira URL, email, API token, GitHub token

# 4. Install deps and seed Jira
npm install
node scripts/seed-jira.js

# 5. Verify: open your Jira board — you should see 4 tickets in "To Do"
```

---

## Demo Script (5-7 minutes)

### Opening (show Jira board on screen)

> "Here's my sprint board — 4 tickets assigned to me. A bug, two features, and a chore.
> Normally this is a full day of work. Let me show you what happens with an AI agent."

### Step 1: Start the agent

Open terminal in the project directory:

```bash
kiro chat
```

### Step 2: Ask the agent to pick up the bug

Type this prompt:

```
Read Jira ticket DEMO-142 and implement the fix. 
Run the tests to verify, then create a PR and move the ticket to "In Review".
```

**What the audience sees:**
1. Agent reads the Jira ticket (shows ticket details)
2. Agent searches the codebase → finds `validate.ts`
3. Agent adds empty body check to the middleware
4. Agent runs `npm test` → all tests pass
5. Agent creates a branch, commits, pushes, creates PR
6. Agent transitions DEMO-142 to "In Review"

**Talk track while agent works:**
> "Notice I didn't tell it which file to edit, or how to fix it. 
> It read the acceptance criteria, found the relevant code, and implemented a fix that passes the existing tests."

### Step 3: Ask for the next ticket

```
Now pick up DEMO-143 — the pagination feature. Implement it end-to-end.
```

**What happens:**
1. Agent reads DEMO-143 details
2. Implements `paginate.ts` utility
3. Updates `users.ts` route to use pagination
4. Adds new tests
5. Creates PR, updates Jira

### Step 4: Show the results

- Switch to GitHub → show the 2 PRs with clean diffs and descriptions
- Switch to Jira → show tickets moved to "In Review"
- Show test output → all passing

### Closing

> "In 5 minutes, the agent completed 2 tickets that would take me 3-4 hours manually.
> I didn't write a single line of code — I reviewed the output.
> My role shifted from implementer to reviewer and architect.
> 
> The key enabler is MCP — Model Context Protocol. It gives the agent standardized 
> access to Jira, GitHub, and the filesystem. No custom integrations needed."

---

## Prompts for Each Ticket (copy-paste ready)

### DEMO-142 (Bug fix)
```
Read Jira ticket DEMO-142. Understand the bug, find the relevant code, implement the fix, 
run tests to verify, create a PR on GitHub, and transition the Jira ticket to "In Review".
```

### DEMO-143 (Pagination)
```
Pick up DEMO-143 from Jira. Implement pagination for the GET /api/users endpoint.
Create the paginate utility, update the route, add tests, create a PR, and update Jira.
```

### DEMO-144 (Rate limiting)
```
Work on DEMO-144. Add rate limiting middleware to the API. Create the middleware file,
apply it to all routes, add a test, create a PR, and move the ticket to In Review.
```

### DEMO-145 (Search/filter)
```
Implement DEMO-145 — add search and filter capabilities to GET /api/users.
Follow the acceptance criteria in the ticket, add tests, create PR, update Jira.
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MCP server won't connect | Check `.env` values, ensure tokens are valid |
| Jira transition fails | Check your board's workflow — column names must match |
| GitHub PR fails | Ensure `GITHUB_TOKEN` has `repo` scope |
| Tests fail unexpectedly | Run `npm test` manually first to verify baseline |

## Reset Between Demos

```bash
node scripts/reset-demo.js
git checkout main
```
