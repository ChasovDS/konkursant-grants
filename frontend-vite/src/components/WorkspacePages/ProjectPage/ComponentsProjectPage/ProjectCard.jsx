import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit, Archive, Delete } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import DeleteProjectModal from './DeleteProjectModal';

const AnimatedCard = styled(Card)(({ theme }) => ({
  margin: '10px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'row',
  padding: '20px',
  width: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.005)',
    boxShadow: theme.shadows[6],
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  margin: '6px 0',
  justifyContent: 'flex-start',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ProjectCard = ({ project, onProjectCreated }) => {
  const navigate = useNavigate();
  const { project_name, project_id, author_name, creation_date, project_template, reviews } = project;
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const reviewCount = reviews ? reviews.length : 0;
  const averageScore =
    reviewCount > 0
      ? (reviews.reduce((acc, review) => acc + review.score, 0) / reviewCount).toFixed(2)
      : 0;

  const handleViewProject = () => {
    navigate(`/workspace/projects/${project_id}`);
  };

  const handleViewEvents = () => {
    navigate(`/workspace/events`);
  };

  const handleOpenProject = () => {
    alert(`Открыть проект: ${project_name}`);
  };

  const handleArchiveProject = () => {
    alert(`Архивировать проект: ${project_name}`);
  };

  const handleRateProject = () => {
    alert(`Оценить проект: ${project_name}`);
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    const jwtToken = Cookies.get('auth_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/projects/${project_id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setDeleteModalOpen(false);
      if (typeof onProjectCreated === 'function') {
        onProjectCreated();
      }
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
      alert(`Ошибка при удалении проекта "${project_name}": ${error.response?.data?.message || 'Неизвестная ошибка'}`);
    }
  };

  return (
    <AnimatedCard variant="outlined">
      <CardContent style={{ flex: 1 }} onClick={handleViewProject}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" style={{ fontWeight: 'bold', flex: 1 }}>
            {project_name}
          </Typography>
          <Chip label="Активный" color="primary" size="small" variant="outlined" />
        </Box>
        <Typography color="primary" style={{ fontStyle: 'italic' }}>
          Шаблон: {project_template}
        </Typography>
        <Typography color="textSecondary" style={{ marginTop: '8px' }}>
          Дата создания: {new Date(creation_date).toLocaleDateString()}
        </Typography>
        <Typography color="textSecondary" style={{ marginTop: '8px' }}>
          Автор: {author_name}
        </Typography>
        <Box display="flex" alignItems="center" style={{ marginTop: '8px' }}>
          <Typography color="textSecondary">
            Количество проверок: {reviewCount} | Средняя оценка: {averageScore} | Ваша оценка: Не требуется
          </Typography>
        </Box>
      </CardContent>
      <Box display="flex" flexDirection="column" justifyContent="space-between" style={{ marginLeft: '16px' }}>
        <CustomButton
          color="primary"
          onClick={handleOpenProject}
          startIcon={<Edit />}
          disabled
        >
          Редактировать проект
        </CustomButton>
        <CustomButton
          color="primary"
          onClick={handleArchiveProject}
          startIcon={<Archive />}
          disabled
        >
          Архивировать проект
        </CustomButton>
        <CustomButton
          color="primary"
          startIcon={<EventIcon />}
          onClick={handleViewEvents}
          
        >
          Подать проект на мероприятие
        </CustomButton>
        <CustomButton
          color="error"
          onClick={handleOpenDeleteModal}
          startIcon={<Delete />}
        >
          Удалить проект
        </CustomButton>
      </Box>
      <DeleteProjectModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        projectName={project_name}
      />
    </AnimatedCard>
  );
};

export default ProjectCard;
