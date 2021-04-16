import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAppState } from 'src/providers/AppStateProvider';
import { Path } from './modules/constants';
import { routeTo } from './modules/helpers';

const DefaultRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
  const appState = useAppState();
  const { path } = rest;

  if (appState.settings.connectionString || path === Path.Settings) {
    return <Route {...rest} component={component} />;
  }

  return <Redirect to={routeTo(Path.Settings)} />;
};

export default DefaultRoute;
