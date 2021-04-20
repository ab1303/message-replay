import React from 'react';
import styled from '@emotion/styled';
import { Checkbox } from '@chakra-ui/core';

const areEqual = (prevProps: any, nextProps: any) =>
  prevProps.checked === nextProps.checked &&
  prevProps.indeterminate === nextProps.indeterminate;

export const HeaderCheckbox = React.memo<any>(
  styled(Checkbox)({
    fontSize: '1rem',
    margin: '-8px 0 -8px -15px',
    padding: '8px 9px',
    '& svg': {
      width: '24px',
      height: '24px',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }),
  areEqual,
);
HeaderCheckbox.displayName = 'HeaderCheckbox';

export const RowCheckbox = React.memo<any>(
  styled(Checkbox)({
    fontSize: '14px',
    margin: '-9px 0 -8px -15px',
    padding: '8px 9px 9px 9px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& svg': {
      width: 24,
      height: 24,
    },
  }),
  areEqual,
);

RowCheckbox.displayName = 'RowCheckbox';
