#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';

const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error('No commit message file provided');
  process.exit(1);
}

let commitMsg = readFileSync(commitMsgFile, 'utf8').trim();

// Allowed emojis for validation
const allowedEmojis = [
  '🎉', '✨', '🐛', '📝', '🎨', '🖌️', '🎭', '✏️', '♻️', '🔥', '🚀', '✅', '🔧', '🚑'
];

// If the commit message already starts with an allowed emoji, do nothing
if (allowedEmojis.some(emoji => commitMsg.startsWith(emoji))) {
  process.exit(0);
}

// Comprehensive keyword-to-emoji mapping
const mappings = {
  // Commit type mappings
  'initial': '🎉',
  'init': '🎉',
  'start': '🎉',
  
  // Feature mappings
  'feature': '✨',
  'feat': '✨',
  'add': '✨',
  'create': '✨',
  
  // Bug fix mappings
  'bug': '🐛',
  'fix': '🐛',
  'hotfix': '🚑',
  'repair': '🐛',
  
  // Documentation mappings
  'docs': '📝',
  'documentation': '📝',
  'readme': '📝',
  
  // Style mappings
  'style': '🎨',
  'ui': '🎨',
  'ux': '🎨',
  'design': '🎨',
  
  // Refactoring mappings
  'refactor': '♻️',
  'clean': '♻️',
  'improve': '♻️',
  
  // Removal mappings
  'remove': '🔥',
  'delete': '🔥',
  'cleanup': '🔥',
  
  // Performance mappings
  'perf': '🚀',
  'performance': '🚀',
  'optimize': '🚀',
  
  // Testing mappings
  'test': '✅',
  'tests': '✅',
  
  // Configuration mappings
  'config': '🔧',
  'configuration': '🔧',
  'setup': '🔧',
  'settings': '🔧'
};

// Function to get emoji based on first word
function getEmojiForCommitMessage(msg) {
  const firstWord = msg.split(' ')[0].toLowerCase();
  
  // Check for exact match first
  if (mappings[firstWord]) {
    return mappings[firstWord];
  }
  
  // Check for partial matches
  for (const [keyword, emoji] of Object.entries(mappings)) {
    if (firstWord.includes(keyword)) {
      return emoji;
    }
  }
  
  // Default to initial commit emoji if no match
  return '🎉';
}

// Prepend appropriate emoji
const emoji = getEmojiForCommitMessage(commitMsg);
commitMsg = `${emoji} ${commitMsg}`;

writeFileSync(commitMsgFile, commitMsg + '\n');
