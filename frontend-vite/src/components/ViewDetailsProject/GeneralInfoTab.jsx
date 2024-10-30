// src/components/ViewDetailsProject/tabs/GeneralInfoTab.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Link as MuiLink,
  Button,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

// Компонент для отображения заголовка и значения
const InfoItem = ({ label, children }) => (
  <Box>
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {children || (
        <Typography variant="body2" color="text.disabled">
          Не указано
        </Typography>
      )}
    </Typography>
  </Box>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const GeneralInfoTab = ({ data }) => {
  if (!data) {
    return (
      <Typography variant="body1" color="text.secondary">
        Данные отсутствуют.
      </Typography>
    );
  }

  const {
    project_scale,
    project_duration,
    author_experience,
    author_functionality,
    author_registration_address,
    resume,
    video_link,
  } = data;

  // Проверка валидности URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {/* Масштаб проекта */}
        <Grid item xs={12} sm={6}>
          <InfoItem label="Масштаб проекта">
            {project_scale}
          </InfoItem>
        </Grid>

        {/* Продолжительность проекта */}
        <Grid item xs={12} sm={6}>
          <InfoItem label="Продолжительность проекта">
            {project_duration}
          </InfoItem>
        </Grid>

        {/* Опыт автора */}
        <Grid item xs={12}>
          <InfoItem label="Опыт автора">
            {author_experience}
          </InfoItem>
        </Grid>

        {/* Функциональные обязанности автора */}
        <Grid item xs={12}>
          <InfoItem label="Функциональные обязанности автора">
            {author_functionality}
          </InfoItem>
        </Grid>

        {/* Адрес регистрации автора */}
        <Grid item xs={12}>
          <InfoItem label="Адрес регистрации автора">
            {author_registration_address}
          </InfoItem>
        </Grid>

        {/* Резюме */}
        <Grid item xs={12} sm={6}>
          <InfoItem label="Резюме">
            {resume && resume.resume_url ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                component={MuiLink}
                href={resume.resume_url}
                target="_blank"
                rel="noopener"
                aria-label="Скачать резюме"
              >
                Скачать резюме
              </Button>
            ) : (
              <Typography variant="body2" color="text.disabled">
                Не указано | Требуется загрузить
              </Typography>
            )}
          </InfoItem>
        </Grid>

        {/* Видео-ссылка */}
        <Grid item xs={12} sm={6}>
        <InfoItem label="Видео-презентация">
            {video_link && isValidUrl(video_link) ? (
            <Button
                variant="outlined"
                color="secondary"
                startIcon={<VideoLibraryIcon />}
                component={MuiLink}
                href={video_link}
                target="_blank"
                rel="noopener"
                aria-label="Посмотреть видео-презентацию"
            >
                Посмотреть видео
            </Button>
            ) : (
            <Typography variant="body2" color="text.disabled">
                Не указано | Требуется загрузить
            </Typography>
            )}
        </InfoItem>
        </Grid>
      </Grid>
    </Box>
  );
};

GeneralInfoTab.propTypes = {
  data: PropTypes.shape({
    project_scale: PropTypes.string,
    project_duration: PropTypes.string,
    author_experience: PropTypes.string,
    author_functionality: PropTypes.string,
    author_registration_address: PropTypes.string,
    resume: PropTypes.shape({
      resume_url: PropTypes.string,
    }),
    video_link: PropTypes.string,
  }),
};

export default GeneralInfoTab;
