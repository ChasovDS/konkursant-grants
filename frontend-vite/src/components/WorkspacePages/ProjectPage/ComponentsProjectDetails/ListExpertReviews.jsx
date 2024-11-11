// src/components/ViewDetailsProject/ListExpertReviews.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer
} from '@mui/material';
import { getProjectReviews } from '../../../../api/Project_API';

// Переводы критериев
const criteriaTranslations = {
  team_experience_competencies: 'Опыт и компетенции команды',
  project_relevance_social_significance: 'Актуальность и соц. значимость',
  solution_uniqueness_addressing_problem: 'Уникальность решения',
  project_scale: 'Масштаб проекта',
  project_perspective_potential: 'Перспективы развития',
  project_information_transparency: 'Информационная открытость',
  project_feasibility_effectiveness: 'Реализуемость и результативность',
  own_contribution_additional_resources: 'Собственный вклад',
  planned_project_expenses: 'Планируемые расходы',
  project_budget_realism: 'Реалистичность бюджета'
};

// Компонент для отображения ячейки с оценкой
const ScoreCell = ({ score }) => (
  <TableCell style={{ border: '1px solid #ccc', padding: '8px', fontSize: '10px' }}>
    {score}
  </TableCell>
);

// Компонент для отображения комментария эксперта
const ExpertComment = ({ reviewerId, feedback }) => (
  <Box sx={{ padding: 1, border: '1px solid #ccc', marginTop: 1 }}>
    <Typography variant="body2">
      <strong>Эксперт {reviewerId}:</strong> {feedback}
    </Typography>
  </Box>
);

const ListExpertReviews = ({projectId}) => {
  const [reviews, setReviews] = useState([]); // Хранение отзывов
  const [loading, setLoading] = useState(true); // Статус загрузки
  const [error, setError] = useState(null); // Хранение ошибок

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getProjectReviews(projectId);
        setReviews(data); // Устанавливаем данные в состояние
      } catch (err) {
        console.error('Ошибка при получении отзывов:', err);
        setError('Не удалось загрузить отзывы.'); // Установка ошибки
      } finally {
        setLoading(false); // Обработка завершена
      }
    };

    fetchReviews(); // Вызов функции получения данных
  }, [projectId]); // Зависимость от projectId

  if (loading) return <Typography variant="body2">Загрузка...</Typography>; // Отображение загрузки
  if (error) return <Typography variant="body2" color="error">{error}</Typography>; // Отображение ошибки

  return (
    <Box sx={{ mx: 2, my: 2}}>
      <Typography variant="h6" pb={2}>Экспертная оценка проекта:</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="expert reviews table">
          <TableHead>
            <TableRow>
              <TableCell style={{ border: '1px solid #ccc', padding: '8px', fontSize: '10px', width: '10%'  }}>Эксперт</TableCell>
              {Object.values(criteriaTranslations).map((criteria, index) => (
                <TableCell key={index} style={{ border: '1px solid #ccc', padding: '8px', fontSize: '10px' }}>{criteria}</TableCell>
              ))}
              <TableCell style={{ border: '1px solid #ccc', padding: '8px', fontSize: '10px' }}>Сумма оценок</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review, index) => {
              const scores = Object.keys(criteriaTranslations).map(criteria => review.criteria_evaluation[criteria]);
              const sum = scores.reduce((a, b) => a + b, 0);

              return (
                <TableRow key={index}>
                  <TableCell style={{ border: '1px solid #ccc', padding: '8px', fontSize: '10px' }}>{review.reviewer_full_name}</TableCell>
                  {scores.map((score, criteriaIndex) => (
                    <ScoreCell key={criteriaIndex} score={score} />
                  ))}
                  <TableCell style={{ border: '1px solid #ccc', padding: '8px', fontSize: '10px' }}>{sum}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Отображение комментариев экспертов */}
      {reviews.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Комментарии экспертов:</Typography>
          {reviews.map((review, index) => (
            <ExpertComment key={index} reviewerId={review.reviewer_full_name} feedback={review.expert_comment} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ListExpertReviews;
