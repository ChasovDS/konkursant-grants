// src/components/ProjectCard.jsx

import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit, Archive, Delete } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event'; // Убедитесь, что путь правильный
import StarIcon from '@mui/icons-material/Star'; // Иконка для кнопки "Оценить проект"

const AnimatedCard = styled(Card)(({ theme }) => ({
  margin: '10px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  padding: '16px',
  width: '100%',
  backgroundColor: '#f9f9f9',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: theme.shadows[5],
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginBottom: '8px',
  justifyContent: 'flex-start',
  border: 'none', // Убираем обводку
  '&:hover': {
    backgroundColor: theme.palette.action.hover, // Можно добавить эффект при наведении
  },
}));

const ProjectCard = ({ project }) => {
  const { project_name, author_name, creation_date, project_template, reviews } = project;

  // Вычисляем количество проверок и среднее значение оценок
  const reviewCount = reviews.length;
  const averageScore =
    reviewCount > 0
      ? (reviews.reduce((acc, review) => acc + review.score, 0) / reviewCount).toFixed(2)
      : 0;

  const handleOpenProject = () => {
    alert(`Открыть проект: ${project_name}`);
  };

  const handleArchiveProject = () => {
    alert(`Архивировать проект: ${project_name}`);
  };

  const handleDeleteProject = () => {
    alert(`Удалить проект: ${project_name}`);
  };

  const handleRateProject = () => {
    alert(`Оценить проект: ${project_name}`);
  };

  return (
    <AnimatedCard variant="outlined">
      <CardContent style={{ flex: 1 }}>
        <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
          {project_name}
        </Typography>
        <Typography color="primary" style={{ fontStyle: 'italic' }}>
          Шаблон: {project_template}
        </Typography>
        <Typography color="textSecondary" style={{ marginTop: '8px' }}>
          Дата создания: {new Date(creation_date).toLocaleDateString()}
        </Typography>
        <Typography color="textSecondary" style={{ marginTop: '8px' }}>
          Автор: {author_name}
        </Typography>
        <Typography color="textSecondary" style={{ marginTop: '8px' }}>
          Количество проверок: {reviewCount} | Средняя оценка: {averageScore} | Ваша оценка: Не требуется
        </Typography>
      </CardContent>
      <Box display="flex" flexDirection="column" justifyContent="space-between" style={{ marginLeft: '16px' }}>
        <CustomButton
          color="primary"
          onClick={handleOpenProject}
          startIcon={<Edit />}
        >
          Редактировать проект
        </CustomButton>
        <CustomButton
          color="primary"
          onClick={handleArchiveProject}
          startIcon={<Archive />}
        >
          Архивировать проект
        </CustomButton>
        <CustomButton
          color="primary"
          startIcon={<EventIcon />}
        >
          Подать проект на мероприятие
        </CustomButton>
        <CustomButton
          color="primary" // Цвет кнопки для оценки
          onClick={handleRateProject}
          startIcon={<StarIcon />} // Иконка для кнопки "Оценить проект"
        >
          Оценить проект
        </CustomButton>
        <CustomButton
          color="default" // Используем "default" для кнопки
          onClick={handleDeleteProject}
          startIcon={<Delete />}
          sx={{ color: 'gray' }} // Устанавливаем серый цвет текста
        >
          Удалить проект
        </CustomButton>
      </Box>
    </AnimatedCard>
  );
};

export default ProjectCard;
