// src/components/workspace/ProjectDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Breadcrumbs,
  Tabs,
  Tab,
  Grid,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

// Конфигурация вкладок
const tabConfig = [
  { id: 'tab_general_info', label: 'Общее', component: 'GeneralInfoTab' },
  { id: 'tab_project_info', label: 'О проекте', component: 'ProjectInfoTab' },
  { id: 'tab_team', label: 'Команда', component: 'TeamTab' },
  { id: 'tab_results', label: 'Результаты', component: 'ResultsTab' },
  { id: 'tab_calendar_plan', label: 'Календарный план', component: 'CalendarPlanTab' },
  { id: 'tab_media', label: 'Медиа', component: 'MediaTab' },
  { id: 'tab_expenses', label: 'Расходы', component: 'ExpensesTab' },
  { id: 'tab_cofinancing', label: 'Самофинансирование', component: 'SelfFinancingTab' },
  { id: 'tab_additional_files', label: 'Доп. файлы', component: 'AdditionalFilesTab' },
];

// Компонент вкладки "Общее"
const GeneralInfoTab = ({ data }) => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h6" gutterBottom>
      Общая информация
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography><strong>Масштаб проекта:</strong> {data.project_scale}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography><strong>Длительность проекта:</strong> {data.project_duration}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography><strong>Опыт автора:</strong> {data.author_experience}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography><strong>Функционал автора:</strong> {data.author_functionality}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Адрес регистрации автора:</strong> {data.author_registration_address}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <strong>Резюме:</strong>{' '}
          <MuiLink href={data.resume.resume_url} target="_blank" rel="noopener">
            Ссылка на резюме
          </MuiLink>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Видео ссылка:</strong> <MuiLink href={data.video_link} target="_blank" rel="noopener">Смотреть видео</MuiLink></Typography>
      </Grid>
    </Grid>
  </Box>
);

// Компонент вкладки "О проекте"
const ProjectInfoTab = ({ data }) => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h6" gutterBottom>
      Информация о проекте
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography><strong>Краткая информация:</strong> {data.brief_info}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Описание проблемы:</strong> {data.problem_description}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Целевая группа:</strong> {data.target_groups}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Главная цель:</strong> {data.main_goal}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Успешный опыт:</strong> {data.successful_experience}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Перспективы развития:</strong> {data.development_perspective}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>Задачи:</strong></Typography>
        <ul>
          {data.tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </Grid>
      <Grid item xs={12}>
        <Typography><strong>География:</strong></Typography>
        <ul>
          {data.geography.map((geo, index) => (
            <li key={index}>{geo.region} - {geo.address}</li>
          ))}
        </ul>
      </Grid>
    </Grid>
  </Box>
);

// Компонент вкладки "Команда"
const TeamTab = ({ data }) => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h6" gutterBottom>
      Команда проекта
    </Typography>
    <Grid container spacing={2}>
      {data.map(member => (
        <Grid item xs={12} md={6} key={member.teammate_id}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="subtitle1"><strong>{member.mentor_name}</strong> - {member.role}</Typography>
            <Typography variant="body2">Email: <MuiLink href={`mailto:${member.mentor_email}`}>{member.mentor_email}</MuiLink></Typography>
            <Typography variant="body2"><strong>Компетенции:</strong> {member.competencies}</Typography>
            <Typography variant="body2">
              <strong>Резюме:</strong>{' '}
              <MuiLink href={member.resume} target="_blank" rel="noopener">
                Ссылка на резюме
              </MuiLink>
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// Аналогично создайте компоненты для остальных вкладок:
// ResultsTab, CalendarPlanTab, MediaTab, ExpensesTab, SelfFinancingTab, AdditionalFilesTab

// Главный компонент ProjectDetails
const ProjectDetails = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const jwtToken = Cookies.get('auth_token');

  // Загрузка данных проекта при монтировании
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setProjectData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных проекта:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId, jwtToken]);

  // Установка активной вкладки на основе URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get('section');
    const tabIndex = tabConfig.findIndex(tab => tab.id === sectionId);
    if (tabIndex >= 0) setActiveTab(tabIndex);
    else setActiveTab(0); // По умолчанию первая вкладка
  }, [location.search]);

  // Обработчик смены вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`${location.pathname}?section=${tabConfig[newValue].id}`);
  };

  // Функция для рендеринга контента вкладок
  const renderTabContent = () => {
    if (!projectData) return null;

    const tabKey = tabConfig[activeTab].id;
    const tabData = projectData.project_data_tabs[tabKey];

    switch (tabConfig[activeTab].component) {
      case 'GeneralInfoTab':
        return <GeneralInfoTab data={tabData} />;
      case 'ProjectInfoTab':
        return <ProjectInfoTab data={tabData} />;
      case 'TeamTab':
        return <TeamTab data={tabData} />;
      // Добавьте остальные случаи для других вкладок
      default:
        return <Typography>Вкладка находится в разработке.</Typography>;
    }
  };

  if (!projectData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Хлебные крошки */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
        <MuiLink component={Link} to="/">Главная</MuiLink>
        <Typography color="text.primary">{projectData.project_name}</Typography>
      </Breadcrumbs>

      {/* Название проекта */}
      <Typography variant="h4" gutterBottom>
        {projectData.project_name}
      </Typography>

      {/* Вкладки */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Project Tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ marginBottom: 2 }}
      >
        {tabConfig.map((tab) => (
          <Tab key={tab.id} label={tab.label} />
        ))}
      </Tabs>

      {/* Контент вкладки */}
      <Paper sx={{ padding: 2 }}>
        {renderTabContent()}
      </Paper>
    </Box>
  );
};

export default ProjectDetails;
