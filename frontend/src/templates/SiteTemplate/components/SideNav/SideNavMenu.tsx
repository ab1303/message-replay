import React, { useMemo } from 'react';
import { Box, Text, Flex } from '@chakra-ui/core';
import { SideNavMode } from './modules/constants';

type Props = {
  label: string;
  mode?: SideNavMode;
  children: React.ReactNode | React.ReactNodeArray;
};

const SideNavMenu: React.FC<Props> = ({ label, mode, children }) => {
  const textColor = useMemo(
    () => (mode === SideNavMode.DARK ? 'whiteAlpha.900' : 'gray.800'),
    [mode],
  );

  return (
    <Box mt="6">
      <Flex size="100%" align="center" mb={2}>
        <Text flex={1} fontSize="md" color={textColor}>
          {label}
        </Text>
      </Flex>
      <Box ml={3}>{children}</Box>
    </Box>
  );
};

export default SideNavMenu;
