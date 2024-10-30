// Profile.jsx
import React from 'react'; // Импортируем React
import {
  Box,
  Container,
} from '@mui/material';
import ProjectData from '../../components/workspace/ProjectData'; // Убедитесь, что путь правильный

const Project = () => {
  return (
      <Container component="main">
        <ProjectData />
      </Container>
  );
};

export default React.memo(Project); 