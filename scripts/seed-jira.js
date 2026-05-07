#!/usr/bin/env node
/**
 * Seeds Jira with demo tickets for the agentic coding demo.
 * 
 * Usage: node scripts/seed-jira.js
 * Requires: JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN, JIRA_PROJECT_KEY in .env
 */
require('dotenv').config();

const { JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN, JIRA_PROJECT_KEY = 'DEMO' } = process.env;

if (!JIRA_URL || !JIRA_USERNAME || !JIRA_API_TOKEN) {
  console.error('Missing JIRA_URL, JIRA_USERNAME, or JIRA_API_TOKEN in .env');
  process.exit(1);
}

const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');
const headers = { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' };

const tickets = [
  {
    summary: 'Bug: POST /api/users returns 500 on empty payload',
    description: `## Problem\nWhen a client sends an empty JSON body \`{}\` to \`POST /api/users\`, the API returns a 500 Internal Server Error instead of a 400 validation error.\n\n## Expected Behavior\nReturn 400 with error message: \`"Request body cannot be empty"\`\n\n## Acceptance Criteria\n- POST /api/users with \`{}\` returns 400\n- POST /api/users with \`null\` body returns 400\n- Existing validation for missing name/email still works\n- Test \`returns 400 for empty body\` passes`,
    issuetype: 'Task',
    priority: 'High',
    labels: ['bug', 'api'],
    story_points: 2,
  },
  {
    summary: 'Feature: Add pagination to GET /api/users',
    description: `## User Story\nAs an API consumer, I want to paginate the users list so that I can handle large datasets efficiently.\n\n## Acceptance Criteria\n- GET /api/users accepts \`?page=1&limit=10\` query params\n- Response includes: \`{ data: [...], pagination: { page, limit, total, totalPages } }\`\n- Default: page=1, limit=10\n- Invalid page/limit returns 400\n- Implement pagination logic in \`src/utils/paginate.ts\`\n- Add tests for pagination`,
    issuetype: 'Task',
    priority: 'Medium',
    labels: ['feature', 'api'],
    story_points: 5,
  },
  {
    summary: 'Chore: Add request rate limiting middleware',
    description: `## Task\nAdd rate limiting to protect the API from abuse.\n\n## Acceptance Criteria\n- Create \`src/middleware/rateLimit.ts\`\n- Limit: 100 requests per 15 minutes per IP\n- Return 429 with \`{ error: "Too many requests" }\` when exceeded\n- Apply to all routes\n- Add test for rate limit behavior`,
    issuetype: 'Task',
    priority: 'Medium',
    labels: ['chore', 'security'],
    story_points: 3,
  },
  {
    summary: 'Feature: Add search/filter to GET /api/users',
    description: `## User Story\nAs an API consumer, I want to search users by name or filter by role.\n\n## Acceptance Criteria\n- GET /api/users?search=alice → filters by name (case-insensitive)\n- GET /api/users?role=admin → filters by role\n- Both can be combined: ?search=al&role=user\n- Returns empty array if no matches\n- Add tests for search and filter`,
    issuetype: 'Task',
    priority: 'Low',
    labels: ['feature', 'api'],
    story_points: 3,
  },
];

async function createTicket(ticket) {
  const body = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: ticket.summary,
      description: {
        type: 'doc', version: 1,
        content: [{ type: 'paragraph', content: [{ type: 'text', text: ticket.description }] }]
      },
      issuetype: { name: ticket.issuetype },
      priority: { name: ticket.priority },
      labels: ticket.labels,
    }
  };

  const res = await fetch(`${JIRA_URL}/rest/api/3/issue`, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json();

  if (!res.ok) {
    console.error(`❌ Failed: ${ticket.summary}`, data);
    return null;
  }

  console.log(`✅ Created: ${data.key} — ${ticket.summary}`);
  return data.key;
}

async function main() {
  console.log(`\n🎯 Seeding Jira project: ${JIRA_PROJECT_KEY}\n`);
  const keys = [];
  for (const ticket of tickets) {
    const key = await createTicket(ticket);
    if (key) keys.push(key);
  }
  console.log(`\n✅ Created ${keys.length} tickets: ${keys.join(', ')}`);
  console.log(`\n🔗 View board: ${JIRA_URL}/jira/software/projects/${JIRA_PROJECT_KEY}/board\n`);
}

main().catch(console.error);
