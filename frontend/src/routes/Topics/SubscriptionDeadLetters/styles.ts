import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const Table = styled('table')`
  width: 100%;
  max-width: 100%;
`;

export const cell = ({ theme }: any) => css`
  text-align: left;
  font-weight: 400;
  vertical-align: middle;
  padding: ${theme.space[2]}};

  &:first-of-type {
    padding-left: ${theme.space[4]}};
  }
  &:last-child {
    padding-right: ${theme.space[4]}};
  }
`;

export const TD = styled('td')`
  ${cell};
  font-size: ${({ theme }: any) => theme.fontSizes.md};
  padding-top: ${({ theme }: any) => theme.space[3]}};
  padding-bottom: ${({ theme }: any) => theme.space[3]}};
  border-top-width: 1px;
`;
