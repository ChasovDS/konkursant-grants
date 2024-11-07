import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Slider,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';

const criteriaTranslations = {
  team_experience_competencies: 'Опыт и компетенции команды',
  project_relevance_social_significance: 'Актуальность и социальная значимость',
  solution_uniqueness_addressing_problem: 'Уникальность и адресность решения',
  project_scale: 'Масштаб проекта',
  project_perspective_potential: 'Перспективы развития',
  project_information_transparency: 'Информационная открытость',
  project_feasibility_effectiveness: 'Реализуемость и результативность',
  own_contribution_additional_resources: 'Собственный вклад и ресурсы',
  planned_project_expenses: 'Планируемые расходы',
  project_budget_realism: 'Реалистичность бюджета',
};

const ExpertReviews = ({ projectId, jwtToken }) => {
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [reviewId, setReviewId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Для управления модальным окном
  const [errorMessage, setErrorMessage] = useState(''); // Для управления сообщением об ошибке

  // Функция для загрузки проверки
  const loadReview = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/reviews/expert/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const existingReview = response.data[0]; // Предполагаем, что API возвращает массив
      if (existingReview) {
        setReviewId(existingReview.review_id);
        setRatings(existingReview.criteria_evaluation || {}); // Убедимся, что ratings корректно устанавливаем
        setComment(existingReview.expert_comment || '');
      }
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.error('Ошибка при загрузке проверки', err);
      } else {
        console.error('Ошибка при загрузке проверки: ', err);
      }
    }
  };

  useEffect(() => {
    loadReview();
  }, [projectId]);

  const handleSliderChange = (criteria, value) => {
    setRatings((prevRatings) => ({ ...prevRatings, [criteria]: value }));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    const isValid = Object.keys(ratings).length === Object.keys(criteriaTranslations).length && comment.trim().length > 0;

    if (!isValid) {
      alert("Пожалуйста, убедитесь, что все поля заполнены и оценены.");
      return;
    }

    try {
      const endpoint = reviewId
        ? `http://127.0.0.1:8000/api/v1/reviews/${reviewId}` 
        : `http://127.0.0.1:8000/api/v1/reviews`;

      const method = reviewId ? 'put' : 'post';
      const payload = {
        criteria_evaluation: ratings,
        expert_comment: comment,
      };

      if (!reviewId) {
        payload.project_id = projectId;  
      }

      await axios({
        method: method,
        url: endpoint,
        data: payload,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        }
      });

      setOpenSnackbar(true);
    } catch (err) {
      setErrorMessage(err.response ? err.response.data.detail : 'Ошибка при отправке проверки.');
      console.error('Ошибка:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        }
      });
      setOpenSnackbar(true);
      setReviewId(null); // Сбросим ID отзыва после удаления
      setRatings({});
      setComment('');
      handleCloseDialog();
    } catch (err) {
      setErrorMessage(err.response ? err.response.data.detail : 'Ошибка при удалении отзыва.');
      console.error('Ошибка:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage('');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {Object.keys(criteriaTranslations).map((criteria) => (
          <Grid item xs={12} sm={6} md={4} key={criteria}>
            <Typography>{criteriaTranslations[criteria]}</Typography>
            <Grid container alignItems="center">
              <Grid item xs>
                <Slider
                  value={ratings[criteria] || 0}
                  onChange={(event, value) => handleSliderChange(criteria, value)}
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-thumb': { width: 16, height: 16 },
                    '& .MuiSlider-track': { height: 4 },
                    '& .MuiSlider-rail': { height: 4 },
                  }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6" padding={1}>
                  {ratings[criteria] || 0}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <TextField
        label="Комментарий"
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        margin="normal"
        value={comment}
        onChange={handleCommentChange}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 1 }}>
          {reviewId ? 'Обновить' : 'Отправить'}
        </Button>
        {reviewId && (
          <Button variant="outlined" color="error" onClick={handleOpenDialog} sx={{ marginLeft: 1 }}>
            Удалить
          </Button>
        )}
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Отзыв успешно {reviewId ? 'обновлен' : 'отправлен'}! 
        </Alert>
      </Snackbar>
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      
      {/* Модальное окно для подтверждения удаления */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить этот отзыв? Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleDelete} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpertReviews;
