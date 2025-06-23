#!/usr/bin/env bun
import { join, resolve } from 'node:path';
import updateNotifier from 'update-notifier';
import { readFileSync } from 'node:fs';

const __dirname = import.meta.dir;

// Read package.json for update notifier
const packageJson = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf-8')
);

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message: string, color: string = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

async function ensureDir(dirPath: string) {
  const dir = Bun.file(dirPath);
  if (!(await dir.exists())) {
    await Bun.$`mkdir -p ${dirPath}`.quiet();
  }
}

async function copyVibeRules() {
  // Check for updates
  const notifier = updateNotifier({ pkg: packageJson });
  notifier.notify({ defer: false });

  const targetDir = process.cwd();
  const sourceDir = resolve(__dirname);

  log('🚀 Installing vibe rules...', COLORS.bright);
  log(`Target directory: ${targetDir}`, COLORS.blue);

  try {
    // Copy CLAUDE.md
    const claudeMdSource = join(sourceDir, 'CLAUDE.md');
    const claudeMdTarget = join(targetDir, 'CLAUDE.md');

    const claudeMdFile = Bun.file(claudeMdSource);
    if (await claudeMdFile.exists()) {
      await Bun.write(claudeMdTarget, claudeMdFile);
      log('✓ Copied CLAUDE.md', COLORS.green);
    } else {
      log('⚠ CLAUDE.md not found in source', COLORS.yellow);
    }

    // Copy .claude directory
    const claudeSource = join(sourceDir, '.claude');
    const claudeTarget = join(targetDir, '.claude');

    const claudeDir = Bun.file(claudeSource);
    if (await claudeDir.exists()) {
      await ensureDir(claudeTarget);
      await Bun.$`cp -rf ${claudeSource} ${claudeTarget}`.quiet();
      log('✓ Copied .claude directory', COLORS.green);
    } else {
      log('⚠ .claude directory not found in source', COLORS.yellow);
    }

    // Copy .cursor directory
    const cursorSource = join(sourceDir, '.cursor');
    const cursorTarget = join(targetDir, '.cursor');

    const cursorDir = Bun.file(cursorSource);
    if (await cursorDir.exists()) {
      await ensureDir(cursorTarget);
      await Bun.$`cp -rf ${cursorSource} ${cursorTarget}`.quiet();
      log('✓ Copied .cursor directory', COLORS.green);
    } else {
      log('⚠ .cursor directory not found in source', COLORS.yellow);
    }

    log(
      '\n✨ Vibe rules installed successfully!',
      COLORS.bright + COLORS.green
    );
    log('\nThe following files have been copied to your project:', COLORS.blue);
    log('  - CLAUDE.md', COLORS.reset);
    log('  - .claude/commands/', COLORS.reset);
    log('  - .cursor/rules/', COLORS.reset);
    log('  - .cursor/mcp.json', COLORS.reset);
  } catch (error) {
    log(`\n❌ Error installing vibe rules: ${error}`, COLORS.red);
    process.exit(1);
  }
}

// Run the CLI
if (import.meta.main) {
  copyVibeRules();
}
