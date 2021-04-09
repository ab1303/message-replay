import React from 'react';
import { Box, BoxProps, Spinner } from '@chakra-ui/core';

import { SideNavMode } from './modules/constants';
import SideNavItem from './SideNavItem';
import SideNavProfile from './SideNavProfile';
import SideNavMenu from './SideNavMenu';
import { useAppState } from 'src/providers/AppStateProvider';
import { Path, routeTo } from 'src/router';

type Props = BoxProps & {
  mode?: SideNavMode;
};

const SideNavContent: React.FC<Props> = ({ mode, ...props }) => {
  const appState = useAppState();
  const {
    entity: { queues, topics },
  } = appState;
  return (
    <Box as="nav" aria-label="Main navigation" fontSize="sm" px="6" {...props}>
      <SideNavProfile mode={mode} />
      {appState.isLoading ? (
        <Spinner thickness="4px" size="md" color="teal.500" />
      ) : (
        <SideNavMenu mode={mode} label="Service Bus Entity">
          {!!queues.length && (
            <SideNavMenu
              key={routeTo(Path.MESSAGE_BROKER_QUEUES)}
              mode={mode}
              label="Queues"
            >
              {queues.map(item => (
                <SideNavItem key={item} to={item} mode={mode}>
                  {item}
                </SideNavItem>
              ))}
            </SideNavMenu>
          )}
          {!!topics.length && (
            <SideNavMenu
              key={routeTo(Path.MESSAGE_BROKER_TOPICS)}
              mode={mode}
              label="Topics"
            >
              {topics.map(item => {
                const topicPath = `${Path.MESSAGE_BROKER_TOPICS}/${item}`;
                return (
                  <SideNavItem key={item} to={routeTo(topicPath)} mode={mode}>
                    {item}
                  </SideNavItem>
                );
              })}
            </SideNavMenu>
          )}
        </SideNavMenu>
      )}
    </Box>
  );
};

export default SideNavContent;
