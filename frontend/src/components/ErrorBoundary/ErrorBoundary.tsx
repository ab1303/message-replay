import { Alert, AlertIcon } from '@chakra-ui/core';
import React, { Component, ErrorInfo } from 'react';
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<{}, State> {
  public constructor(props: {}) {
    super(props);
  }

  state = {
    hasError: false,
  };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true,
    });

    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Alert status="error">
          <AlertIcon />
          There was an error processing your request
        </Alert>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
