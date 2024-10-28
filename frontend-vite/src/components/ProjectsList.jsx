// src/components/ProjectsList.jsx

import React from 'react';
import ProjectCard from './ProjectCard';
import { Grid } from '@mui/material';

const ProjectsList = ({ projects }) => {
  return (
    <Grid container>
      {projects.map((project) => (
        <Grid item xs={12} sm={12} md={12} key={project.project_id}>
          <ProjectCard project={project} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectsList;
