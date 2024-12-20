import React, { useState, useEffect, useContext } from 'react';
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
import { fetchProjectDetails } from '../../../../api/Project_API';
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
import { AuthContext } from '../../../ComponentsApp/AuthProvider';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const allowedRolesForExpertReviews = ['admin', 'moderator', 'event_manager', 'expert'];
  const { session } = useContext(AuthContext);
  
  // Проверяем наличие session и role_name
  const userRole = session?.user?.role_name;

  const tabConfig = [
    { id: 'tab_general_info', label: 'Общее', component: 'GeneralInfoTab' },
    { id: 'tab_project_info', label: 'О проекте', component: 'ProjectInfoTab' },
    { id: 'tab_team', label: 'Команда', component: 'TeamTab' },
    { id: 'tab_results', label: 'Результаты', component: 'ResultsTab' },
    { id: 'tab_calendar_plan', label: 'Календарный план', component: 'CalendarPlanTab' },
    { id: 'tab_media', label: 'Медиа', component: 'MediaTab' },
    { id: 'tab_expenses', label: 'Расходы', component: 'ExpensesTab' },
    { id: 'tab_cofinancing', label: 'Софинанс.', component: 'SelfFinancingTab' },
    { id: 'tab_additional_files', label: 'Доп. файлы', component: 'AdditionalFilesTabs' },
    { id: 'tab_list_expert_reviews', label: 'Рецензии', component: 'ListExpertReviewsTab' },
    ...(allowedRolesForExpertReviews.includes(userRole) ? [
      { id: 'tab_expert_reviews', label: 'Моя рецензия', component: 'ExpertReviewsTab' }
    ] : []),
  ];


  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const data = await fetchProjectDetails(projectId);
        setProjectData(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных проекта:', error);
      }
    };

    loadProjectDetails();
  }, [projectId]);

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
    if (!projectData || !projectData.project_data_tabs) return null;

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
      case 'AdditionalFilesTabs':
        return (
          <AdditionalFilesTabs
            projectId={projectId}
            projectData={projectData}
            refreshData={fetchProjectDetails}
          />
        );
      case 'ListExpertReviewsTab':
        return <ListExpertReviewsTab data={tabData} projectId={projectId} />;
      case 'ExpertReviewsTab':
        return <ExpertReviewsTab data={tabData} projectId={projectId}/>;
      default:
        return <Typography>Вкладка находится в разработке.</Typography>;
    }
  };


  const handleBackClick = () => {
    const isReviewPath = location.pathname.includes('review');
    const assignedEventId = projectData?.assigned_event_id;

    if (isReviewPath && assignedEventId) {
      navigate(`/workspace/reviews/${assignedEventId}/projects`);
    } else {
      navigate('/workspace/projects');
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
        <MuiLink component={Link} to="#" onClick={handleBackClick}>НАЗАД</MuiLink>
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
