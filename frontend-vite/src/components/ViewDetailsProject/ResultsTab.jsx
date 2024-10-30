// src/components/ViewDetailsProject/tabs/ResultsTab.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import TodayIcon from '@mui/icons-material/Today';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImpactIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';

const ResultsTab = ({ data }) => {
  if (!data) {
    return (
      <Typography variant="h6" color="text.secondary">
        Данные отсутствуют.
      </Typography>
    );
  }

  const {
    planned_date,
    final_date,
    planned_events_count,
    participants_count,
    publications_count,
    views_count,
    social_effect,
  } = data;

  // Функция для преобразования текста с переносами строк в JSX
  const parseText = (text) => {
    return text.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };

  // Массив с информацией для отображения
  const details = [
    {
      icon: <EventIcon color="primary" />,
      primary: 'Планируемая дата завершения',
      secondary: planned_date || '-',
    },
    {
      icon: <TodayIcon color="primary" />,
      primary: 'Фактическая дата завершения',
      secondary: final_date || '-',
    },
    {
      icon: <DescriptionIcon color="primary" />,
      primary: 'Планируемое количество мероприятий',
      secondary: planned_events_count !== undefined ? planned_events_count : '-',
    },
    {
      icon: <GroupIcon color="primary" />,
      primary: 'Количество участников',
      secondary: participants_count !== undefined ? participants_count : '-',
    },
    {
      icon: <DescriptionIcon color="primary" />,
      primary: 'Количество публикаций',
      secondary: publications_count !== undefined ? publications_count : '-',
    },
    {
      icon: <VisibilityIcon color="primary" />,
      primary: 'Просмотры',
      secondary: views_count !== undefined ? views_count : '-',
    },
  ];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Grid container spacing={3}>
        {/* Основные результаты */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>   
              <List disablePadding>
                {details.slice(0, 3).map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.primary}
                        secondary={item.secondary}
                      />
                    </ListItem>
                    {index < 2 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Дополнительные результаты */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <List disablePadding>
                {details.slice(3).map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.primary}
                        secondary={item.secondary}
                      />
                    </ListItem>
                    {index < details.length - 4 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Социальный эффект */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Социальный эффект
              </Typography>
              {social_effect && social_effect.length > 0 ? (
                social_effect.map((effect, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {parseText(effect)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Отсутствует
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

ResultsTab.propTypes = {
  data: PropTypes.shape({
    planned_date: PropTypes.string,
    final_date: PropTypes.string,
    planned_events_count: PropTypes.number,
    participants_count: PropTypes.number,
    publications_count: PropTypes.number,
    views_count: PropTypes.number,
    social_effect: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ResultsTab;
