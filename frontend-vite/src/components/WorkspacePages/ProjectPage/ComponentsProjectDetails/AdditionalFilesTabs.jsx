// src/components/ViewDetailsProject/tabs/AdditionalFilesTabs.jsx

import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import AdditionalFilesTab from './AdditionalFilesTab';
import AdditionalFilesTabKG from './AdditionalFilesTabKG';

const AdditionalFilesTabs = ({ projectId, jwtToken, projectData, refreshData }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Дополнительные файлы (Проект)" />
        <Tab label="Дополнительные файлы (Конкурсант)" />
      </Tabs>

      {activeTab === 0 && (
        <Box padding={3}>
          <AdditionalFilesTab data={projectData.project_data_tabs['tab_additional_files']} />
        </Box>
      )}

      {activeTab === 1 && (
        <Box padding={3}>
          <AdditionalFilesTabKG
            projectId={projectId}
            jwtToken={jwtToken}
            data={projectData.project_data_tabs['tab_additional_files_KG']}
            refreshData={refreshData}
          />
        </Box>
      )}
    </Box>
  );
};

export default AdditionalFilesTabs;
