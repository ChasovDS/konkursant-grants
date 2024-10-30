// src/components/ViewDetailsProject/ProjectInfoCard.jsx

import React from 'react';
import { Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { Person, Phone, Email } from '@mui/icons-material';

const ProjectInfoCard = ({ projectData }) => {
  // Массив для хранения информации о проекте
  const infoItems = [
    {
      icon: <Person color="primary" />,
      label: `Автор: ${projectData.author_name}`,
      tooltip: 'Имя автора',
    },
    {
      icon: <Phone color="primary" />,
      label: `Телефон: ${projectData.contacts.phone || 'Не указано'}`,
      tooltip: 'Номер телефона',
    },
    {
      icon: <Email color="primary" />,
      label: `Почта: ${projectData.contacts.email || 'Не указано'}`,
      tooltip: 'Адрес электронной почты',
    },
  ];

  return (
    <Card variant="none" >
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          {infoItems.map((item, index) => (
            <Tooltip title={item.tooltip} arrow key={index}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                {item.icon}
                <Typography variant="body1">{item.label}</Typography>
              </Stack>
            </Tooltip>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectInfoCard;
