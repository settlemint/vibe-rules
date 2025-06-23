import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import type React from 'react';

interface TaskItemProps {
  name: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'error';
  message?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  name,
  status,
  message,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Text color="gray">○</Text>;
      case 'running':
        return (
          <Text color="yellow">
            <Spinner type="dots" />
          </Text>
        );
      case 'success':
        return <Text color="green">✓</Text>;
      case 'warning':
        return <Text color="yellow">⚠</Text>;
      case 'error':
        return <Text color="red">✗</Text>;
      default:
        return <Text color="gray">○</Text>;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'pending':
        return 'gray';
      case 'running':
        return 'yellow';
      case 'success':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Box marginRight={1}>{getStatusIcon()}</Box>
      <Text color={getTextColor()}>
        {name}
        {message && <Text dimColor> - {message}</Text>}
      </Text>
    </Box>
  );
};
