import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled('tr')`
  outline: 0;
  verticalalign: 'middle';
  fontweight: 500;
  lineheight: '1.5rem';
  position: 'relative';
  borderbottom: '1px solid rgba(224, 224, 224, 1)';
`;

const THeadTR: React.FC = ({ children }) => <Wrapper>{children}</Wrapper>;

export default THeadTR;
