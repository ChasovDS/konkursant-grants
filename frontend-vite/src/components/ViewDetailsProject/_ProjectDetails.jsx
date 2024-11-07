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

import ProjectInfoCard from './ProjectInfoCard';
import GeneralInfoTab from './GeneralInfoTab';
import ProjectInfoTab from './ProjectInfoTab';
import TeamTab from './TeamTab';
import ResultsTab from './ResultsTab';
import CalendarPlanTab from './CalendarPlanTab';
import MediaTab from './MediaTab';
import ExpensesTab from './ExpensesTab';
import SelfFinancingTab from './SelfFinancingTab';
import AdditionalFilesTabs from './AdditionalFilesTabs';
import ExpertReviewsTab from './ExpertReviews';
import ListExpertReviewsTab from './ListExpertReviews';

const tabConfig = [
  { id: 'tab_general_info', label: 'Общее', component: 'GeneralInfoTab' },
  { id: 'tab_project_info', label: 'О проекте', component: 'ProjectInfoTab' },
  { id: 'tab_team', label: 'Команда', component: 'TeamTab' },
  { id: 'tab_results', label: 'Результаты', component: 'ResultsTab' },
  { id: 'tab_calendar_plan', label: 'Календарный план', component: 'CalendarPlanTab' },
  { id: 'tab_media', label: 'Медиа', component: 'MediaTab' },
  { id: 'tab_expenses', label: 'Расходы', component: 'ExpensesTab' },
  { id: 'tab_cofinancing', label: 'Софинанс.', component: 'SelfFinancingTab' },
  { id: 'tab_additional_files', label: 'Доп. файлы', component: 'AdditionalFilesTabs' }, // Изменено
  { id: 'tab_list_expert_reviews', label: 'Рецензии', component: 'ListExpertReviewsTab' },
  { id: 'tab_expert_reviews', label: 'Моя рецензия', component: 'ExpertReviewsTab' },
];

const ProjectDetails = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const jwtToken = Cookies.get('auth_token');

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

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId, jwtToken]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get('section');
    const tabIndex = tabConfig.findIndex(tab => tab.id === sectionId);
    if (tabIndex >= 0) setActiveTab(tabIndex);
    else setActiveTab(0);
  }, [location.search]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`${location.pathname}?section=${tabConfig[newValue].id}`);
  };

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
        return <ExpensesTab data={tabData}/>;
      case 'SelfFinancingTab':
        return <SelfFinancingTab data={tabData} />;
      case 'AdditionalFilesTabs': // Обновлено
        return (
          <AdditionalFilesTabs
            projectId={projectId}
            jwtToken={jwtToken}
            projectData={projectData}
            refreshData={fetchProjectDetails}
          />
        );
      case 'ListExpertReviewsTab':
        return <ListExpertReviewsTab data={tabData} projectId={projectId} jwtToken={jwtToken} />;
      case 'ExpertReviewsTab':
        return <ExpertReviewsTab data={tabData} projectId={projectId} jwtToken={jwtToken} />;
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
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
        <MuiLink component={Link} to="/dashboard/workspace/projects">НАЗАД</MuiLink>
        <Typography color="text.primary" variant="h6">{projectData.project_name}</Typography>
      </Breadcrumbs>

      <ProjectInfoCard projectData={projectData} />

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Project Tabs"
        scrollButtons="auto"
        sx={{
          marginBottom: 2,
          '.MuiTab-root': {
            minWidth: 'auto',
            fontSize: '0.89rem',
            padding: '4px 8px',
          },
        }}
      >
        {tabConfig.map((tab) => (
          <Tab key={tab.id} label={tab.label} />
        ))}
      </Tabs>

      <Paper sx={{ padding: 2 }}>
        {renderTabContent()}
      </Paper>
    </Box>
  );
};

export default ProjectDetails;
