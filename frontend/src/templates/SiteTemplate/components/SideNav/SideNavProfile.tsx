import React, { useMemo } from 'react';
import { Box, Collapse, Flex, Text, useDisclosure } from '@chakra-ui/core';
import styled from '@emotion/styled';

import { SideNavMode } from './modules/constants';
import SideNavItem from './SideNavItem';

type CaretProps = {
  isOpen: boolean;
};

const Caret = styled(Box)<CaretProps>`
  transition: transform 150ms ease-in;
  transform: ${({ isOpen }) => `rotate(${isOpen ? 180 : 0}deg)`};
  border-top-width: 4px;
  border-top-style: dashed;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
`;

type Props = {
  mode?: SideNavMode;
};

const SideNavProfile: React.FC<Props> = ({ mode }) => {
  const { isOpen, onToggle } = useDisclosure();

  const textColor = useMemo(
    () => (mode === SideNavMode.DARK ? 'whiteAlpha.900' : 'gray.800'),
    [mode],
  );

  const borderColor = useMemo(
    () => (mode === SideNavMode.DARK ? 'whiteAlpha.300' : 'gray.200'),
    [mode],
  );

  return (
    <Box py="5" borderBottomWidth="1px" borderColor={borderColor}>
      <Flex size="100%" align="center" cursor="pointer" onClick={onToggle}>
        <Text flex={1} fontSize="md" color={textColor}>
          Service Bus Replay
        </Text>

        <Caret isOpen={isOpen || false} borderTopColor={textColor} />
      </Flex>

      <Collapse ml={2} mt={4} isOpen={isOpen}>
        <SideNavItem to="/profile" mode={mode}>
          Profile
        </SideNavItem>
        <SideNavItem to="/settings" mode={mode}>
          Settings
        </SideNavItem>
      </Collapse>
    </Box>
  );
};

export default SideNavProfile;
