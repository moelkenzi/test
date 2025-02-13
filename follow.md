i just added this dependence @commitlint/config-conventional on my project so how i add an emojis front of it
Reasoned for 7 seconds
Commitlint itself only validates your commit messages—it doesn't automatically add emojis. However, you can enforce that every commit message starts with an emoji by updating your configuration and combining it with a Git hook (using Husky).

1. Update Your Commitlint Configuration
Create or update your commitlint.config.js file with a rule that only allows commit types that start with specific emojis:

js
Copy
Edit
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce a maximum header length of 72 characters
    'header-max-length': [2, 'always', 72],
    // Limit body and footer lines to 100 characters for readability
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
    // Ensure the subject is not empty
    'subject-empty': [2, 'never'],
    // Only allow these emojis at the start of your commit messages
    'type-enum': [
      2,
      'always',
      [
        '🎉', // initial commit
        '✨', // new feature
        '🐛', // bug fix
        '📝', // documentation
        '💄', // UI/UX changes or styling
        '♻️', // code refactoring
        '🔥', // code removal or cleanup
        '🚀', // performance improvements
        '✅', // tests
        '🔧', // configuration changes
        '🚑', // hotfix
      ],
    ],
    // Optional: enforce scope formatting if using scopes
    'scope-empty': [0, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    // Disable subject case rule to allow emojis and flexible text
    'subject-case': [0],
  },
};
With this setup, commitlint will reject any commit message that doesn’t start with one of these emojis.

2. Set Up Husky to Run Commitlint
To ensure commitlint checks run on every commit, set up a Git hook using Husky:

Install Husky (if you haven’t already):

sh
Copy
Edit
npm install husky --save-dev
Initialize Husky:

sh
Copy
Edit
npx husky install
Add a commit-msg Hook:

Create a hook that runs commitlint on your commit messages by running:

sh
Copy
Edit
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
Now, every time you make a commit, the commit message will be validated against your commitlint rules. If your commit message doesn’t start with one of the allowed emojis, the commit will be rejected.

3. Automate Emoji Insertion (Optional)
While commitlint validates your messages, it doesn’t insert emojis automatically. If you want to automate emoji insertion (for example, adding 🎉 for initial commits), you can create a prepare-commit-msg hook with a custom script. For instance:

Create a Script (e.g., scripts/commit-msg-format.js):

js
Copy
Edit
#!/usr/bin/env node

const fs = require('fs');
const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error('No commit message file provided');
  process.exit(1);
}

let commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// If the commit message already starts with one of the allowed emojis, do nothing.
const allowedEmojis = [
  '🎉', '✨', '🐛', '📝', '💄', '♻️', '🔥', '🚀', '✅', '🔧', '🚑'
];
if (allowedEmojis.some(emoji => commitMsg.startsWith(emoji))) {
  process.exit(0);
}

// Keyword-to-emoji mapping
const mappings = {
  'initial': '🎉',
  'feature': '✨',
  'feat': '✨',
  'bug': '🐛',
  'fix': '🐛',
  'docs': '📝',
  'documentation': '📝',
  'style': '💄',
  'refactor': '♻️',
  'cleanup': '🔥',
  'remove': '🔥',
  'perf': '🚀',
  'performance': '🚀',
  'test': '✅',
  'config': '🔧',
  'hotfix': '🚑',
};

// Check the first word for a keyword
const firstWord = commitMsg.split(' ')[0].toLowerCase();
if (mappings[firstWord]) {
  commitMsg = `${mappings[firstWord]} ${commitMsg}`;
}

fs.writeFileSync(commitMsgFile, commitMsg + '\n');
Configure a Prepare-Commit-Msg Hook:

Create or update .husky/prepare-commit-msg with:

sh
Copy
Edit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

node scripts/commit-msg-format.js "$1"
And make sure it’s executable:

sh
Copy
Edit
chmod +x .husky/prepare-commit-msg
Now, when you type a commit message like:

vbnet
Copy
Edit
initial: set up project structure
the prepare-commit-msg hook will automatically prepend 🎉, converting it to:

sql
Copy
Edit
🎉 initial: set up project structure
Then commitlint will validate it.