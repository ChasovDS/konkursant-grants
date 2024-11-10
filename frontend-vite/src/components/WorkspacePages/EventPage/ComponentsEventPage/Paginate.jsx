import React from 'react';
import { Box, Pagination } from '@mui/material';

const Paginate = ({ count, page, onPageChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <Pagination
        count={count}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
      />
    </Box>
  );
};

export default Paginate;
