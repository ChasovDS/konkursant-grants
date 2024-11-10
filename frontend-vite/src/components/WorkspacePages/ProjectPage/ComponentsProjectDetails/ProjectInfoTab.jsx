// src/components/ViewDetailsProject/tabs/ProjectInfoTab.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Компонент для отображения секции с заголовком и содержимым
const Section = ({ title, children }) => (
  <Box sx={{ marginBottom: 2 }}>
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    {children}
  </Box>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

// Компонент для отображения пунктов списка с иконкой
const BulletList = ({ items }) => (
  <List dense>
    {items.map((item, index) => (
      <ListItem key={index} disablePadding>
        <ListItemIcon sx={{ minWidth: 24 }}>
          <FiberManualRecordIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={item} />
      </ListItem>
    ))}
  </List>
);

BulletList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ProjectInfoTab = ({ data }) => {
  if (!data) {
    return (
      <Typography variant="body1" color="text.secondary">
        Данные отсутствуют.
      </Typography>
    );
  }

  const {
    brief_info,
    problem_description,
    target_groups,
    main_goal,
    successful_experience,
    development_perspective,
    tasks,
    geography,
  } = data;

  // Обеспечение, что целевые группы представлены в виде массива
  const targetGroupsArray = Array.isArray(target_groups)
    ? target_groups
    : target_groups
    ? [target_groups]
    : [];

  // Обеспечение, что география представлена в виде массива
  const geographyArray = Array.isArray(geography)
    ? geography
    : geography
    ? [geography]
    : [];

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {/* Краткая информация */}
        {brief_info && (
          <Grid item xs={12}>
            <Section title="Краткая информация:">
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {brief_info}
              </Typography>
            </Section>
          </Grid>
        )}

        {/* Описание проблемы */}
        {problem_description && (
          <Grid item xs={12}>
            <Section title="Описание проблемы:">
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {problem_description}
              </Typography>
            </Section>
          </Grid>
        )}

        {/* Целевые группы */}
        {targetGroupsArray && (
          <Grid item xs={12} sm={6}>
            <Section title="Целевые группы:">
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {targetGroupsArray}
              </Typography>
            </Section>
          </Grid>
        )}

        {/* Основная цель */}
        {main_goal && (
          <Grid item xs={12} sm={6}>
            <Section title="Основная цель:">
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {main_goal}
              </Typography>
            </Section>
          </Grid>
        )}

        {/* Успешный опыт */}
        {successful_experience && (
          <Grid item xs={12}>
            <Section title="Успешный опыт:">
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {successful_experience}
              </Typography>
            </Section>
          </Grid>
        )}

        {/* Перспективы развития */}
        {development_perspective && (
          <Grid item xs={12}>
            <Section title="Перспективы развития:">
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {development_perspective}
              </Typography>
            </Section>
          </Grid>
        )}

        {/* Задачи */}
        {tasks && tasks.length > 0 && (
          <Grid item xs={12}>
            <Section title="Задачи:">
              <BulletList items={tasks.map((task, index) => `#${index + 1} ${task}`)} />
            </Section>
          </Grid>
        )}

        {/* География */}
        {geographyArray.length > 0 && (
          <Grid item xs={12}>
            <Section title="География:">
              <List>
                {geographyArray.map((location, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <FiberManualRecordIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Регион: ${location.region}, Адрес: ${location.address}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Section>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

ProjectInfoTab.propTypes = {
  data: PropTypes.shape({
    brief_info: PropTypes.string,
    problem_description: PropTypes.string,
    target_groups: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    main_goal: PropTypes.string,
    successful_experience: PropTypes.string,
    development_perspective: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.string),
    geography: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          region: PropTypes.string,
          address: PropTypes.string,
        })
      ),
      PropTypes.shape({
        region: PropTypes.string,
        address: PropTypes.string,
      }),
    ]),
  }),
};

export default ProjectInfoTab;
