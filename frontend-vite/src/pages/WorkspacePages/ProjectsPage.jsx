// src\pages\WorkspacePages\ProjectsPage.jsx

import React, { useEffect, useState } from 'react';
import { Typography, Box, Pagination, CircularProgress, Tabs, Tab} from '@mui/material';


import ProjectsList from '../../components/WorkspacePages/ProjectPage/ProjectsList';
import ProjectFilter from '../../components/WorkspacePages/ProjectPage/ComponentsProjectPage/ProjectFilter';
import CreateProjectModal from '../../components/WorkspacePages/ProjectPage/ComponentsProjectPage/CreateProjectModal'; // Импортируем модальное окно

import axios from 'axios';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false); // Состояние для открытия модального окна
  const limit = 10;
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProjects = async (page, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/projects/me?skip=${(page - 1) * limit}&limit=${limit}`, {
        withCredentials: true,
        params: { ...filters },
      });
      setProjects(response.data);
      setTotalProjects(response.total || 0);
    } catch (error) {
      console.error('Ошибка при получении списка проектов:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (tabIndex === 0) {
      fetchProjects(page, filters);
    } else {
      setLoading(false);
    }
  }, [page, filters, tabIndex]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex);
    setPage(1);
    setLoading(true);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleAddProject = () => {
    setModalOpen(true); // Открываем модальное окно
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Закрываем модальное окно
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleChangeTab} sx={{ alignItems: 'flex-start' }}>
        <Tab label="Актуальные проекты" />
        <Tab label="Архив"  disabled={true} />
        <Tab label="Совместные проекты"  disabled={true} />
      </Tabs>

      <ProjectFilter 
        onFilter={handleFilter} 
        onAddProject={handleAddProject} 
        onProjectCreated={() => fetchProjects(page, filters)} // Передаем функцию обновления
      />
      {tabIndex === 0 ? (
        <>
          {projects.length > 0 ? (
            <>
              <ProjectsList projects={projects} onProjectCreated={() => fetchProjects(page, filters)} /> 
              <Pagination
                count={Math.ceil(totalProjects / limit)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                style={{ marginTop: '16px' }}
              />
            </>
          ) : (
            <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '20vh', // Занимает всю высоту экрана
              backgroundColor: '#f5f5f5', // Светлый фон для контраста
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ mt: 1, color: '#666' }}>
              Добавьте проекты, чтобы начать работу.
            </Typography>
          </Box>
          )}
        </>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {tabIndex === 1 ? 'Архив проектов пока недоступен.' : 'Совместные проекты пока недоступны.'}
        </Typography>
      )}

    <CreateProjectModal open={modalOpen} handleClose={handleCloseModal} onProjectCreated={() => fetchProjects(page, filters)} />

    </Box>
  );
};

export default ProjectsPage;
