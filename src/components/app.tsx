import { Box, Text, useApp } from "ink";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import updateNotifier from "update-notifier";
import { EMBEDDED_FILES } from "../embedded-files.generated";
import { Header } from "./header.js";
import { TaskItem } from "./task-item.js";

// Read package.json for update notifier
const packageJson = { name: "@settlemint/vibe-rules", version: "1.0.0" };

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

  // Helper function to ensure directory exists
  const ensureDir = useCallback((dirPath: string) => {
    try {
      mkdirSync(dirPath, { recursive: true });
    } catch (_error) {
      // Directory already exists or other error
    }
  }, []);

  // Helper to copy a single file
  const copyFile = useCallback(
    (
      taskId: string,
      _taskName: string,
      sourceKey: string,
      targetBase?: string
    ) => {
      updateTaskStatus(taskId, "running");
      try {
        const files = EMBEDDED_FILES[sourceKey] || [];
        if (files.length > 0) {
          const targetDir = process.cwd();
          if (files.length === 1 && !targetBase && files[0]) {
            // Single file case (like CLAUDE.md)
            const targetPath = join(targetDir, sourceKey);
            writeFileSync(targetPath, files[0].content, "utf-8");
          } else {
            // Directory case
            for (const file of files) {
              const targetPath = join(
                targetDir,
                targetBase || sourceKey,
                file.path
              );
              ensureDir(dirname(targetPath));
              writeFileSync(targetPath, file.content, "utf-8");
            }
          }
          updateTaskStatus(taskId, "success");
        } else {
          updateTaskStatus(taskId, "warning", "Source not found");
        }
      } catch (error) {
        updateTaskStatus(taskId, "error", String(error));
      }
    },
    [updateTaskStatus, ensureDir]
  );

  useEffect(() => {
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

    // Copy files
    copyFile("claude-md", "Copy CLAUDE.md", "CLAUDE.md");
    copyFile("claude-dir", "Copy .claude directory", ".claude", ".claude");
    copyFile("cursor-dir", "Copy .cursor directory", ".cursor", ".cursor");

    // Exit after a short delay to show the final state
    setTimeout(() => {
      exit();
    }, 1500);
  }, [updateTaskStatus, exit, copyFile]);

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