# settlemint-vibe-rules

CLI tool to install shared development rules and configurations for Claude Code and Cursor into your project.

## Prerequisites

- [Bun](https://bun.sh) runtime (required)

## Installation

```bash
bun add -g @settlemint/vibe-rules
```

## Usage

Navigate to your project directory and run:

```bash
settlemint-vibe-rules
```

This will copy the following files to your project:
- `CLAUDE.md` - Project instructions for Claude Code
- `.claude/commands/` - Custom Claude Code commands
- `.cursor/rules/` - Cursor editor rules
- `.cursor/mcp.json` - MCP server configuration

## What's Included

### CLAUDE.md
Contains project-specific guidance for Claude Code including:
- Task execution framework
- Structured output requirements
- Git workflow instructions
- Available commands documentation
- MCP server configurations

### Claude Commands (.claude/commands/)
Custom commands that enhance Claude Code's capabilities:
- `/pr` - Create pull requests with proper branch management
- `/qa` - Run complete test suite
- `/comments` - Add documentation to code
- `/explore` - Understand project architecture
- `/stuck` - Systematic debugging approach
- `/performance` - Analyze and optimize performance
- `/deps` - Safely update dependencies
- And more...

### Cursor Rules (.cursor/rules/)
Development guidelines and best practices for the Cursor editor.

### MCP Configuration (.cursor/mcp.json)
Model Context Protocol server configurations for enhanced AI capabilities.

## Development

### Prerequisites
- [Bun](https://bun.sh) runtime

### Running from Source

```bash
# Clone the repository
git clone https://github.com/settlemint/vibe-rules.git
cd vibe-rules

# Install dependencies
bun install

# Run directly
bun run index.ts
```

## License

FSL-1.1-MIT

## Support

- Issues: [GitHub Issues](https://github.com/settlemint/vibe-rules/issues)
- Email: support@settlemint.com