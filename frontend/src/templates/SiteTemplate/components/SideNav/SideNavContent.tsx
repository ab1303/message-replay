import React, { useMemo } from 'react';
import { Box, BoxProps, Text, Flex } from '@chakra-ui/core';

import { SideNavMode, MENU } from './modules/constants';
import SideNavItem from './SideNavItem';
import SideNavProfile from './SideNavProfile';
import SideNavMenu from './SideNavMenu';

type Props = BoxProps & {
  mode?: SideNavMode;
};

const SideNavContent: React.FC<Props> = ({ mode, ...props }) => {
  return (
    <Box as="nav" aria-label="Main navigation" fontSize="sm" px="6" {...props}>
      <SideNavProfile mode={mode} />

      <SideNavMenu mode={mode} label="Service Bus Entity">
        {MENU.map(item => (
          <SideNavMenu key={item.to} mode={mode} label={item.label}>
            {MENU.map(item => (
              <SideNavItem key={item.to} to={item.to} mode={mode}>
                {item.label}
              </SideNavItem>
            ))}
          </SideNavMenu>
        ))}
      </SideNavMenu>
    </Box>
  );
};

export default SideNavContent;
