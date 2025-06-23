import { Box, Text, useApp } from "ink";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import updateNotifier from "update-notifier";
import { Header } from "./header.js";
import { TaskItem } from "./task-item.js";

const __dirname = import.meta.dir
  .replace("/src/components", "")
  .replace("/dist", "");
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf-8")
);

interface Task {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "warning" | "error";
  message?: string;
}

export const App: React.FC = () => {
  const { exit } = useApp();
  const [tasks, setTasks] = useState<Task[]>([
    { id: "update-check", name: "Checking for updates", status: "running" },
    { id: "claude-md", name: "Copy CLAUDE.md", status: "pending" },
    { id: "claude-dir", name: "Copy .claude directory", status: "pending" },
    { id: "cursor-dir", name: "Copy .cursor directory", status: "pending" },
  ]);

  const updateTaskStatus = useCallback(
    (taskId: string, status: Task["status"], message?: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status, message } : task
        )
      );
    },
    []
  );

  useEffect(() => {
    const runTasks = async () => {
      // Check for updates
      const notifier = updateNotifier({ pkg: packageJson });
      if (notifier.update) {
        updateTaskStatus(
          "update-check",
          "warning",
          `Update available: ${notifier.update.latest}`
        );
      } else {
        updateTaskStatus("update-check", "success", "Up to date");
      }

      const targetDir = process.cwd();
      const sourceDir = resolve(__dirname);

      // Helper function to ensure directory exists
      const ensureDir = async (dirPath: string) => {
        const dir = Bun.file(dirPath);
        if (!(await dir.exists())) {
          await Bun.$`mkdir -p ${dirPath}`.quiet();
        }
      };

      // Copy CLAUDE.md
      updateTaskStatus("claude-md", "running");
      try {
        const claudeMdSource = join(sourceDir, "CLAUDE.md");
        const claudeMdTarget = join(targetDir, "CLAUDE.md");
        const claudeMdFile = Bun.file(claudeMdSource);

        if (await claudeMdFile.exists()) {
          await Bun.write(claudeMdTarget, claudeMdFile);
          updateTaskStatus("claude-md", "success");
        } else {
          updateTaskStatus("claude-md", "warning", "Source file not found");
        }
      } catch (error) {
        updateTaskStatus("claude-md", "error", String(error));
      }

      // Copy .claude directory
      updateTaskStatus("claude-dir", "running");
      try {
        const claudeSource = join(sourceDir, ".claude");
        const claudeTarget = join(targetDir, ".claude");
        const claudeDir = Bun.file(claudeSource);

        if (await claudeDir.exists()) {
          await ensureDir(claudeTarget);
          await Bun.$`cp -rf ${claudeSource} ${claudeTarget}`.quiet();
          updateTaskStatus("claude-dir", "success");
        } else {
          updateTaskStatus(
            "claude-dir",
            "warning",
            "Source directory not found"
          );
        }
      } catch (error) {
        updateTaskStatus("claude-dir", "error", String(error));
      }

      // Copy .cursor directory
      updateTaskStatus("cursor-dir", "running");
      try {
        const cursorSource = join(sourceDir, ".cursor");
        const cursorTarget = join(targetDir, ".cursor");
        const cursorDir = Bun.file(cursorSource);

        if (await cursorDir.exists()) {
          await ensureDir(cursorTarget);
          await Bun.$`cp -rf ${cursorSource} ${cursorTarget}`.quiet();
          updateTaskStatus("cursor-dir", "success");
        } else {
          updateTaskStatus(
            "cursor-dir",
            "warning",
            "Source directory not found"
          );
        }
      } catch (error) {
        updateTaskStatus("cursor-dir", "error", String(error));
      }

      // Exit after a short delay to show the final state
      setTimeout(() => {
        exit();
      }, 1500);
    };

    runTasks();
  }, [updateTaskStatus, exit]);

  const hasErrors = tasks.some((task) => task.status === "error");
  const allComplete = tasks.every(
    (task) => task.status === "success" || task.status === "warning"
  );

  return (
    <Box flexDirection="column" padding={1}>
      <Header />

      <Box flexDirection="column" marginTop={1}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            message={task.message}
            name={task.name}
            status={task.status}
          />
        ))}
      </Box>

      {allComplete && (
        <Box flexDirection="column" marginTop={2}>
          <Box>
            <Text bold color={hasErrors ? "red" : "green"}>
              {hasErrors
                ? "✗ Installation completed with errors"
                : "✨ Vibe rules installed successfully!"}
            </Text>
          </Box>

          {!hasErrors && (
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>
                The following files have been copied to your project:
              </Text>
              <Box flexDirection="column" marginLeft={2}>
                <Text dimColor>• CLAUDE.md</Text>
                <Text dimColor>• .claude/commands/</Text>
                <Text dimColor>• .cursor/rules/</Text>
                <Text dimColor>• .cursor/mcp.json</Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
