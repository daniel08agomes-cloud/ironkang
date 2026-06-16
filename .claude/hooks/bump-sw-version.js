#!/usr/bin/env node
// PostToolUse hook (Edit|Write): bump sw.js's CACHE_NAME version whenever
// index.html, manifest.json, or sw.js itself changes, so PWA clients don't
// keep serving a stale cached build. No-ops if the only uncommitted change
// to sw.js is a previous version bump (avoids double-bumping).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const raw = readStdin();
  if (!raw) return;
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return;
  }

  const filePath = input?.tool_input?.file_path;
  if (!filePath) return;

  const base = path.basename(filePath);
  const dir = path.dirname(filePath);
  const swFile = path.join(dir, 'sw.js');

  if (base === 'index.html' || base === 'manifest.json') {
    // always bump
  } else if (base === 'sw.js') {
    // Only bump if something other than the CACHE_NAME line actually
    // changed (vs the last commit) - otherwise this *is* a previous bump.
    let diffOutput = '';
    try {
      diffOutput = execFileSync(
        'git', ['diff', '--unified=0', '--', swFile],
        { cwd: dir, encoding: 'utf8' }
      );
    } catch {
      diffOutput = '';
    }
    const changedLines = diffOutput
      .split('\n')
      .filter(l => (l.startsWith('+') || l.startsWith('-')) && !l.startsWith('+++') && !l.startsWith('---'));
    const nonVersionChanges = changedLines.filter(l => !l.includes('CACHE_NAME'));
    if (changedLines.length === 0 || nonVersionChanges.length === 0) {
      return;
    }
  } else {
    return;
  }

  if (!fs.existsSync(swFile)) return;

  const content = fs.readFileSync(swFile, 'utf8');
  const match = content.match(/ironkang-v(\d+)/);
  if (!match) return;

  const next = parseInt(match[1], 10) + 1;
  const updated = content.replace(/ironkang-v\d+/g, `ironkang-v${next}`);
  fs.writeFileSync(swFile, updated);

  console.log(JSON.stringify({ systemMessage: `sw.js cache bumped to ironkang-v${next}` }));
}

main();
