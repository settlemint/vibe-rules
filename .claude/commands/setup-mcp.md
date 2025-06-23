# Setup MCP Servers

This command configures all recommended MCP servers for the project.

## Steps

1. **Check existing MCP configuration**

   ```bash
   claude mcp list
   ```

2. **Configure recommended MCP servers**

   - Add each recommended server with appropriate transport type
   - Skip servers that are already configured

3. **Verify all servers are added**

   - Check that all 5 recommended servers are configured
   - Report any servers that failed to add

4. **Verify setup**
   ```bash
   claude mcp list
   ```
   - Confirm all recommended servers are now active

## Server Configurations

Add these recommended servers:

```bash
# Linear - Project management
claude mcp add --transport sse linear https://mcp.linear.app/sse -s user

# Context7 - Library documentation
claude mcp add --transport sse context7 https://mcp.context7.com/sse -s user

# DeepWiki - Advanced documentation search
claude mcp add --transport sse deepwiki https://mcp.deepwiki.com/sse -s user
```

## Usage

Run this command when:

- Setting up a new development environment
- MCP servers are missing or not properly configured
- After cloning the repository
- When recommended servers have changed
