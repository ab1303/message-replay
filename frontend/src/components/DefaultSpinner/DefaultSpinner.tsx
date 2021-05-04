import React from 'react';
import { ISpinnerProps, Spinner } from '@chakra-ui/core';

type DefaultSpinnerProps = Pick<ISpinnerProps, 'size' | 'color'> & {
  thickness?: string | undefined;
};

type TableDataLoadingSpinnerProps = DefaultSpinnerProps & {
  columnsCount: number;
};

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
  columnsCount,
}) => (
  <tr>
    <td colSpan={columnsCount} style={{ textAlign: 'center', height: '50px' }}>
      <Spinner
        thickness={thickness}
        size={size}
        color={color}
        emptyColor="gray.200"
      />
    </td>
  </tr>
);

TableDataLoadingSpinner.displayName = 'TableDataLoadingSpinner';

export default DefaultSpinner;
