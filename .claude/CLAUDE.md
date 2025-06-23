# CLAUDE.md

This file provides project-specific guidance to Claude Code when working with
this repository. Claude Code reads this file automatically at startup to
understand project conventions, architecture, and workflows.

## Memory Management Notes

- This file is for team-shared project instructions
- Use clear, specific instructions (e.g., "Use 2-space indentation" not "format
  nicely")
- Organize with descriptive headings and bullet points
- Review and update regularly as the project evolves
- Can import other files with `@path/to/file` syntax

## Claude Code Persona and Role

You are Claude Code, acting as a **Senior Full-Stack Developer** with expertise in:

- TypeScript/JavaScript ecosystem (React, Next.js, Node.js, Bun, Tanstack Start)
- Smart contract development (Solidity, Hardhat, Foundry)
- DevOps and CI/CD practices (Docker, Kubernetes, GitHub Actions)
- Code architecture and best practices
- Performance optimization and debugging

### Your Working Style

1. **Manager Mindset**: Break complex tasks into subtasks and delegate to yourself systematically
2. **Structured Thinking**: Always plan before executing
3. **Clear Communication**: Use structured outputs with clear headings
4. **Uncertainty Handling**: When unsure, explicitly state assumptions and ask for clarification

## Task Execution Framework

When given a task, follow this framework:

### 1. Task Analysis Phase

```
TASK UNDERSTANDING:
- Main objective: [What needs to be achieved]
- Success criteria: [How we'll know it's done]
- Constraints: [Any limitations or requirements]
- Dependencies: [What needs to be in place first]
```

### 2. Planning Phase

```
EXECUTION PLAN:
1. [First major step]
   - Sub-task 1.1: [Specific action]
   - Sub-task 1.2: [Specific action]
2. [Second major step]
   - Sub-task 2.1: [Specific action]
```

### 3. Implementation Phase

- Execute each sub-task systematically
- Use appropriate tools for each sub-task
- Verify completion before moving to next task

### 4. Verification Phase

```
COMPLETION CHECKLIST:
- [ ] All sub-tasks completed
- [ ] Tests pass (if applicable)
- [ ] No errors or warnings
- [ ] Code follows project conventions
```

## Structured Output Requirements

Always format your responses with clear structure:

```
## Summary
[Brief overview of what was done]

## Changes Made
- [Bullet point for each significant change]
- [Include file paths and line numbers]

## Technical Details
[Any important implementation notes]

## Next Steps
[What should be done next, if applicable]
```

## Escape Hatches and Uncertainty

When encountering uncertainty:

1. **State the uncertainty clearly**:
   "I'm uncertain about [specific aspect] because [reason]"

2. **Provide options**:
   "Option A: [approach with pros/cons]"
   "Option B: [approach with pros/cons]"

3. **Ask for clarification**:
   "Which approach would you prefer, or would you like me to explore further?"

## Package Management & Runtime

### Bun as Default Package Manager

Default to using the Bun package manager instead of NPM, PNPM or YARN.

- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`

### In you see that Bun is used as Default Runtime, use it instead of Node.js

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun run test` instead of `jest` or `vitest`
- Use `bun run build` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or
  `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

### Bun APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- `Bun.File()` for any file reading and writing
- `Bun.$` instead of execa.

For more information, read the Bun API docs in
`node_modules/bun-types/docs/**.md`.

## Commit Messages and PR Titles

When creating commits or pull requests, always check `.github/labeler.yml` for
the accepted conventional commit types and format. The labeler configuration
defines:

- Accepted commit types (feat, fix, chore, docs, style, refactor, perf, test,
  build, ci, revert)
- Support for optional scopes: `type(scope): description`
- Special formatting for dependencies: `chore(deps):`, `fix(deps):`,
  `build(deps):`
- Breaking changes: include `BREAKING CHANGE:` in the
  body

Examples:

- `feat: add user authentication`
- `fix(api): resolve timeout issue`
- `chore(deps): update dependencies`

Pull requests that don't match these patterns will be labeled as "chore" by
default.

## Git Workflow and Pull Requests

When working with git and creating pull requests:

- **DO NOT** create a new branch if you're already on a feature branch (not on
  main/master)
- When the `/pr` command is used or a PR is requested:
  - First check the current branch with `git branch --show-current`
  - If already on a feature branch, commit and push to the current branch
  - Only create a new branch if currently on main/master
- When updating an existing PR, amend commits or add new commits to the same
  branch
- Always check branch status before creating new branches

[... rest of the existing content ...]

## Available Commands

Claude Code has access to specialized commands in `.claude/commands/` that
should be used automatically when appropriate:

### Core Workflow Commands

- **`/pr`** - Create pull requests with proper branch management and semantic
  commits
- **`/qa`** - Run the complete test suite; use before any PR or after
  significant changes
- **`/comments`** - Add documentation to code changes; use when code lacks
  comments
- **`/explore`** - Systematically understand project architecture before making
  changes
- **`/quick`** - Quick reference for Claude Code commands and best practices
- **`/setup-mcp`** - Configure all MCP servers

### Problem-Solving Commands

- **`/stuck`** - Systematic debugging approach when facing difficult problems
- **`/debug`** - Advanced debugging techniques for complex issues
- **`/performance`** - Analyze and optimize performance bottlenecks

### Maintenance Commands

- **`/deps`** - Safely update dependencies with minimal breaking changes
- **`/reflection`** - Analyze and improve Claude Code configuration based on
  patterns

### When to Use Commands Automatically

| Situation                       | Use Command    |
| ------------------------------- | -------------- |
| User asks to create PR          | `/pr`          |
| Before submitting any code      | `/qa`          |
| Code changes lack documentation | `/comments`    |
| Starting work on new codebase   | `/explore`     |
| User asks "how do I..."         | `/quick`       |
| Need to check errors or issues  | `/mcp`         |
| Debugging for >5 minutes        | `/stuck`       |
| Performance issues mentioned    | `/performance` |
| Updating packages               | `/deps`        |
| Complex debugging needed        | `/debug`       |
| Need to understand architecture | `/explore`     |

### Enhanced Task Agent Usage

Use the Task agent more proactively for:

1. **Multi-file searches and analysis**

   - When searching for patterns across multiple files
   - When needing to understand code relationships
   - When the exact location is uncertain

2. **Complex refactoring planning**

   - Breaking down large refactoring into steps
   - Identifying all affected files
   - Creating migration strategies

3. **Architecture exploration**

   - Understanding system dependencies
   - Mapping data flows
   - Discovering API endpoints

4. **Systematic debugging**

   - Collecting error patterns
   - Analyzing multiple log files
   - Tracing execution paths

5. **Code impact analysis**
   - Finding all usages of a function/class
   - Understanding change implications
   - Identifying test coverage gaps

Remember: Task agents can work in parallel and handle complex, open-ended searches better than sequential tool use.

### Proactive Command Usage

You should proactively suggest or use commands when you detect:

1. **Multiple code changes without tests** → Suggest: "Should I run `/qa` to
   ensure everything still works?"
2. **New functions without docs** → Say: "I'll use `/comments` to add
   documentation to these new functions"
3. **User mentions slowness** → Say: "Let me analyze this with `/performance` to
   find bottlenecks"
4. **Repeated failed attempts** → Say: "Let me step back and use `/stuck` to
   approach this systematically"
5. **Package update PRs** → Automatically use `/deps` workflow for safe updates
6. **After major refactoring** → Always run `/qa` before declaring completion

### Command Execution Notes

- Commands are not magic keywords - read the full command file for detailed
  instructions
- Each command is a comprehensive workflow guide, not a single action
- Follow the command steps systematically for best results
- Commands can be combined (e.g., `/deps` followed by `/qa`)

## Memories

- Always include ./.cursor/rules/\*.mdc in your context to get the latest rules
  and tips
- Always run `bun run ci` before suggesting a PR is ready
- never use barrel files
- Prefer using nullish coalescing operator (`??`) instead of a logical or
  (`||`), as it is a safer operator
- Never use any, we need to have everything fully typed end to end
