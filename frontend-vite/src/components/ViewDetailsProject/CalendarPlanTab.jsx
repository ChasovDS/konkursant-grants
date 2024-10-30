// src/components/ViewDetailsProject/tabs/CalendarPlanTab.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import RepeatIcon from '@mui/icons-material/Repeat';
import PublishIcon from '@mui/icons-material/Publish';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';

const InfoChip = ({ label, icon, color }) => (
  <Chip
    icon={icon}
    label={label}
    size="small"
    variant="filled"
    color={color}
    sx={{ mr: 1, mb: 1 }}
  />
);

InfoChip.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.element,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
  ]),
};

const EventDetails = ({ event, eventIndex }) => {
  const theme = useTheme();
  const {
    title,
    due_date,
    description,
    additional_info,
    unique_participants,
    recurring_participants,
    publications_count,
    views_count,
  } = event;

  // Функция для парсинга описания с переносами строк
  const parseDescription = (text) => {
    if (!text) return 'Не указано';
    return text.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, borderColor: theme.palette.divider }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary.main">
          {eventIndex + 1}. {title || 'Не указано'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Крайняя дата выполнения:</strong> {due_date || 'Не указано'}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Описание мероприятия:</strong>
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
            {parseDescription(description)}
          </Typography>
        </Box>
        {additional_info && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Дополнительная информация:</strong>
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
              {parseDescription(additional_info)}
            </Typography>
          </Box>
        )}
        <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mt: 1 }}>
          <Tooltip title="Уникальные участники">
            <InfoChip
              label={`Уникальные участники: ${unique_participants}`}
              icon={<PeopleIcon fontSize="small" />}
              color="primary"
            />
          </Tooltip>
          <Tooltip title="Повторяющиеся участники">
            <InfoChip
              label={`Повторяющиеся участники: ${recurring_participants}`}
              icon={<RepeatIcon fontSize="small" />}
              color="secondary"
            />
          </Tooltip>
          <Tooltip title="Количество публикаций">
            <InfoChip
              label={`Публикации: ${publications_count}`}
              icon={<PublishIcon fontSize="small" />}
              color="info"
            />
          </Tooltip>
          <Tooltip title="Количество просмотров">
            <InfoChip
              label={`Просмотры: ${views_count}`}
              icon={<VisibilityIcon fontSize="small" />}
              color="success"
            />
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
};

EventDetails.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    due_date: PropTypes.string,
    description: PropTypes.string,
    additional_info: PropTypes.string,
    unique_participants: PropTypes.number,
    recurring_participants: PropTypes.number,
    publications_count: PropTypes.number,
    views_count: PropTypes.number,
  }).isRequired,
  eventIndex: PropTypes.number.isRequired,
};

const CalendarPlanTab = ({ data }) => {
  if (!data || !data.tasks || data.tasks.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Данные отсутствуют.
        </Typography>
      </Box>
    );
  }

  const { tasks } = data;
  const theme = useTheme();

  return (
    <Box sx={{ padding: { xs: 2, md: 3 }, backgroundColor: theme.palette.background.default }}>
      {tasks.map((task, index) => (
        <Box key={task.task_id} sx={{ mb: 3 }}>
          <Accordion
            sx={{
              boxShadow: 3,
              '&:before': { display: 'none' },
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ backgroundColor: theme.palette.action.hover }}
            >
              <Typography variant="h6" color="text.primary">
                {index + 1}. {task.task_name || 'Без названия'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {task.events && task.events.length > 0 ? (
                task.events.map((event, eventIndex) => (
                  <EventDetails key={event.event_id} event={event} eventIndex={eventIndex} />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Нет мероприятий.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </Box>
  );
};

CalendarPlanTab.propTypes = {
  data: PropTypes.shape({
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        task_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        task_name: PropTypes.string,
        events: PropTypes.arrayOf(
          PropTypes.shape({
            event_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string,
            due_date: PropTypes.string,
            description: PropTypes.string,
            additional_info: PropTypes.string,
            unique_participants: PropTypes.number,
            recurring_participants: PropTypes.number,
            publications_count: PropTypes.number,
            views_count: PropTypes.number,
          })
        ),
      })
    ),
  }).isRequired,
};

export default CalendarPlanTab;
