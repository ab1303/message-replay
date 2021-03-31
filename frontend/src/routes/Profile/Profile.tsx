import React from 'react';
import { Grid } from '@chakra-ui/core';

const Profile: React.FC = () => (
  <Grid
    templateColumns={[null, null, 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
    gap={['1rem', '1.25rem', '1.5rem']}
  ></Grid>
);

export default Profile;
