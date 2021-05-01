import React from 'react';
import { Flex, ISpinnerProps, Spinner } from '@chakra-ui/core';

type DefaultSpinnerProps = Pick<ISpinnerProps, 'size' | 'color'> & {
  thickness?: string | undefined;
};

type TableDataLoadingSpinnerProps = DefaultSpinnerProps & {};

const DefaultSpinner: React.FC<DefaultSpinnerProps> = ({
  thickness = '4px',
  size = 'md',
  color = 'teal.500',
}) => <Spinner thickness={thickness} size={size} color={color} />;

DefaultSpinner.displayName = 'DefaultSpinner';

export const TableDataLoadingSpinner: React.FC<TableDataLoadingSpinnerProps> = ({
  thickness = '4px',
  size = 'lg',
  color = 'teal.500',
}) => (
  <Flex as="tr" align="center" justify="center" w="100%" h="100px">
    <Spinner
      as="td"
      thickness={thickness}
      size={size}
      color={color}
      emptyColor="gray.200"
    />
  </Flex>
);

TableDataLoadingSpinner.displayName = 'TableDataLoadingSpinner';

export default DefaultSpinner;
