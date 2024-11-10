// src/components/ViewDetailsProject/tabs/TeamTab.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Link as MuiLink,
  Avatar,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

// Стилизация карточки для добавления эффектов наведений
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

// Компонент для отображения одного члена команды
const TeamMemberCard = ({ member }) => {
  const {
    mentor_name,
    role,
    mentor_email,
    competencies,
    resume,
    avatar_url,
    company,
  } = member;

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <StyledCard variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            alt={mentor_name || 'Ментор'}
            src={avatar_url || ''}
            sx={{ width: 64, height: 64 }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography variant="h6" component="div">
              {mentor_name || 'Не указано'}
            </Typography>
            <Tooltip title={role || 'Роль не указана'}>
              <Typography variant="subtitle2" color="text.secondary" noWrap>
                {role || 'Роль не указана'}
              </Typography>
            </Tooltip>

            {company && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ marginTop: 0.5 }}>
                <BusinessIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {company}
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>

        <Box sx={{ marginTop: 2 }}>
          {mentor_email && (
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon fontSize="small" sx={{ marginRight: 0.5 }} />
              <MuiLink href={`mailto:${mentor_email}`} underline="hover">
                {mentor_email}
              </MuiLink>
            </Typography>
          )}

          {resume && isValidUrl(resume) ? (
            <Box sx={{ marginTop: 1 }}>
              <MuiLink href={resume} target="_blank" rel="noopener" underline="hover">
                <Stack direction="row" spacing={1} alignItems="center">
                  <DownloadIcon fontSize="small" />
                  <Typography variant="body2">Скачать резюме</Typography>
                </Stack>
              </MuiLink>
            </Box>
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ marginTop: 1 }}>
              Резюме: Не указано | Требуется загрузить
            </Typography>
          )}
        </Box>

        {/* Аккордеон для компетенций */}
        {competencies && (
          <Accordion sx={{ marginTop: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="competencies-content"
              id="competencies-header"
            >
              <Typography variant="body2" fontWeight="bold">
                Компетенции
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {competencies}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </StyledCard>
  );
};

TeamMemberCard.propTypes = {
  member: PropTypes.shape({
    mentor_name: PropTypes.string,
    role: PropTypes.string,
    mentor_email: PropTypes.string,
    competencies: PropTypes.string,
    resume: PropTypes.string,
    avatar_url: PropTypes.string,
    company: PropTypes.string,
  }).isRequired,
};

// Компонент для отображения списка членов команды
const TeamTab = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Команда отсутствует.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {data.map((member, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <TeamMemberCard member={member} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

TeamTab.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      mentor_name: PropTypes.string,
      role: PropTypes.string,
      mentor_email: PropTypes.string,
      competencies: PropTypes.string,
      resume: PropTypes.string,
      avatar_url: PropTypes.string,
      company: PropTypes.string,
    })
  ),
};

export default TeamTab;
