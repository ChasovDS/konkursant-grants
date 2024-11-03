// src/components/ViewDetailsProject/_ProjectDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Breadcrumbs,
  Tabs,
  Tab,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

// Импорт нового компонента
import ProjectInfoCard from './ProjectInfoCard';

// Импорт компонентов вкладок
import GeneralInfoTab from './GeneralInfoTab';
import ProjectInfoTab from './ProjectInfoTab';
import TeamTab from './TeamTab';
import ResultsTab from './ResultsTab';
import CalendarPlanTab from './CalendarPlanTab';
import MediaTab from './MediaTab';
import ExpensesTab from './ExpensesTab';
import SelfFinancingTab from './SelfFinancingTab';
import AdditionalFilesTab from './AdditionalFilesTab';
import ExpertReviewsTab from './ExpertReviews';
import ListExpertReviewsTab from './ListExpertReviews';


import RateReviewIcon from '@mui/icons-material/RateReview';

// Конфигурация вкладок
const tabConfig = [
  { id: 'tab_general_info', label: 'Общее', component: 'GeneralInfoTab' },
  { id: 'tab_project_info', label: 'О проекте', component: 'ProjectInfoTab' },
  { id: 'tab_team', label: 'Команда', component: 'TeamTab' },
  { id: 'tab_results', label: 'Результаты', component: 'ResultsTab' },
  { id: 'tab_calendar_plan', label: 'Календарный план', component: 'CalendarPlanTab' },
  { id: 'tab_media', label: 'Медиа', component: 'MediaTab' },
  { id: 'tab_expenses', label: 'Расходы', component: 'ExpensesTab' },
  { id: 'tab_cofinancing', label: 'Софинанс.', component: 'SelfFinancingTab' },
  { id: 'tab_additional_files', label: 'Доп. файлы', component: 'AdditionalFilesTab' },
  { id: 'tab_list_expert_reviews', label: 'Рецензии', component: 'ListExpertReviewsTab' },
  { id: 'tab_expert_reviews', label: 'Моя рецензия', component: 'ExpertReviewsTab' },
];

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
      case 'ResultsTab':
        return <ResultsTab data={tabData} />;
      case 'CalendarPlanTab':
        return <CalendarPlanTab data={tabData} />;
      case 'MediaTab':
        return <MediaTab data={tabData} />;
      case 'ExpensesTab':
        return <ExpensesTab data={tabData} />;
      case 'SelfFinancingTab':
        return <SelfFinancingTab data={tabData} />;
      case 'AdditionalFilesTab':
        return <AdditionalFilesTab data={tabData} />;
      case 'ListExpertReviewsTab':
        return <ListExpertReviewsTab data={tabData} />;
      case 'ExpertReviewsTab':
        return <ExpertReviewsTab data={tabData} />;
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
    <Box>
      {/* Хлебные крошки */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
        <MuiLink component={Link} to="/dashboard/workspace/projects">НАЗАД</MuiLink>
        <Typography color="text.primary" variant="h6">{projectData.project_name}</Typography>
      </Breadcrumbs>

      {/* Использование нового компонента ProjectInfoCard */}
      <ProjectInfoCard projectData={projectData} />

      {/* Вкладки */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Project Tabs"

        scrollButtons="auto"
        sx={{
          marginBottom: 2,
          '.MuiTab-root': {
            minWidth: 'auto', // Снимет минимальную ширину с каждой вкладки
            fontSize: '0.89rem', // Уменьшит размер шрифта вкладок
            padding: '4px 8px', // Уменьшит внутренние отступы
          },
        }}
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
