#!/usr/bin/env node
/**
 * Resets the demo: deletes feature branches and moves Jira tickets back to "To Do".
 * Usage: node scripts/reset-demo.js
 */
import 'dotenv/config';
import { execSync } from 'child_process';

const { JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN, JIRA_PROJECT_KEY = 'DEMO' } = process.env;
const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');
const headers = { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' };

async function resetJiraTickets() {
  // Search for all tickets in the project
  const jql = `project=${JIRA_PROJECT_KEY} AND status != "To Do"`;
  const res = await fetch(`${JIRA_URL}/rest/api/3/search?jql=${encodeURIComponent(jql)}`, { headers });
  const data = await res.json();

  for (const issue of data.issues || []) {
    // Get available transitions
    const tRes = await fetch(`${JIRA_URL}/rest/api/3/issue/${issue.key}/transitions`, { headers });
    const transitions = await tRes.json();
    const toDoTransition = transitions.transitions?.find(t => t.name.toLowerCase().includes('to do') || t.name.toLowerCase().includes('backlog'));

    if (toDoTransition) {
      await fetch(`${JIRA_URL}/rest/api/3/issue/${issue.key}/transitions`, {
        method: 'POST', headers,
        body: JSON.stringify({ transition: { id: toDoTransition.id } })
      });
      console.log(`↩️  ${issue.key} → To Do`);
    }
  }
}

function resetGitBranches() {
  try {
    execSync('git checkout main', { stdio: 'pipe' });
    const branches = execSync('git branch').toString().split('\n')
      .map(b => b.trim())
      .filter(b => b && !b.startsWith('*') && b !== 'main');

    for (const branch of branches) {
      execSync(`git branch -D ${branch}`, { stdio: 'pipe' });
      console.log(`🗑️  Deleted branch: ${branch}`);
      try { execSync(`git push origin --delete ${branch}`, { stdio: 'pipe' }); } catch {}
    }
  } catch (e) {
    console.log('⚠️  Git reset skipped (not a git repo or no branches)');
  }
}

async function main() {
  console.log('\n🔄 Resetting demo...\n');
  resetGitBranches();
  if (JIRA_URL && JIRA_API_TOKEN) await resetJiraTickets();
  console.log('\n✅ Demo reset complete. Ready to re-run.\n');
}

main().catch(console.error);
