import { Box, Text } from "ink";
import Gradient from "ink-gradient";
import type React from "react";

const ASCII_LOGO = `  _________       __    __  .__            _____  .__        __
 /   _____/ _____/  |__/  |_|  |   ____   /     \\ |__| _____/  |_
 \\_____  \\_/ __ \\   __\\   __\\  | _/ __ \\ /  \\ /  \\|  |/    \\   __\\
 /        \\  ___/|  |  |  | |  |_\\  ___//    Y    \\  |   |  \\  |
/_________/\\_____>__|  |__| |____/\\_____>____|____/__|___|__/__|`;

export const Header: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Gradient name="rainbow">
        <Text>{ASCII_LOGO}</Text>
      </Gradient>
      <Box marginTop={1}>
        <Text dimColor>
          CLI tool to install shared vibe rules into your project
        </Text>
      </Box>
    </Box>
  );
};