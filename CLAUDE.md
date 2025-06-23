# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **settlemint-vibe-rules** CLI tool - a utility that installs standardized development configurations (CLAUDE.md, Claude commands, Cursor rules) into other projects. It's built with Bun, React/Ink for terminal UI, and TypeScript.

## Development Commands

- `bun install` - Install dependencies
- `bun run generate` - Generate embedded files from source (runs automatically before publish)
- `bun run lint` - Run Biome linter with auto-fix
- `bun run format` - Format code with Biome
- `bun run typecheck` - Run TypeScript type checking
- `bun run ci` - Run all checks (lint + typecheck)
- `bun run index.ts` - Test the CLI locally

## Architecture & Key Components

### File Embedding System

The core architecture revolves around embedding files at build time:

1. **Source files** are stored in `.claude/` and `.cursor/` directories, plus `REDIRECT-CLAUDE.md`
2. **Build phase**: `generate-embedded-files.ts` reads all files and embeds them into `src/embedded-files.generated.ts`
3. **Runtime**: The CLI extracts embedded files to the target project

### Component Structure

- `index.ts` - Entry point with Bun shebang
- `src/components/app.tsx` - Main logic: update checking, file copying, UI orchestration
- `src/components/header.tsx` - ASCII art header with gradient
- `src/components/task-item.tsx` - Task progress indicators
- `generate-embedded-files.ts` - Build script for file embedding

### CLAUDE.md Redirect Pattern

- Installs `REDIRECT-CLAUDE.md` as `CLAUDE.md` in target projects
- The redirect file imports `.claude/CLAUDE.md` for centralized configuration
- Allows projects to add local overrides while maintaining central rules
- Won't overwrite existing CLAUDE.md files

## Important Implementation Details

### File Copying Logic

The app checks if CLAUDE.md exists before copying to avoid overwriting user customizations. See `src/components/app.tsx:105-110` for the implementation.

### Publishing Workflow

1. `prepublishOnly` hook runs `bun run generate`
2. Only `index.ts` and `src/` are included in the published package
3. All content files are embedded, not distributed as separate files

### Testing Changes Locally

To test changes to the embedded files:

1. Make changes to files in `.claude/`, `.cursor/`, or `REDIRECT-CLAUDE.md`
2. Run `bun run generate` to rebuild embedded files
3. Run `bun run index.ts` in a test directory to see the installation

### Bun-Specific APIs Used

- `Bun.file()` for file operations in `generate-embedded-files.ts`
- Direct TypeScript execution without build step
- Shebang support for CLI execution

## Release Process

The project uses GitHub Actions for automated releases:

1. Create a new tag following semantic versioning
2. GitHub Actions builds and publishes to NPM
3. The `package.json` version is automatically updated

## Common Development Tasks

### Adding a New Command

1. Create the command file in `.claude/commands/`
2. Run `bun run generate` to embed it
3. Update the README.md to document the new command

### Updating the Central CLAUDE.md

1. Edit `.claude/CLAUDE.md` with the new instructions
2. Run `bun run generate` to embed changes
3. Test locally before publishing

### Debugging File Embedding

Check `src/embedded-files.generated.ts` to verify files are properly embedded. Each file should have a path and content property.
