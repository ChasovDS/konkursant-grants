// src/EventDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Grid,
  Button,
  CardMedia,
  Card,
  CardContent,
  TextField,
  Rating,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";

import FeedbackIcon from "@mui/icons-material/Feedback";
import PersonIcon from "@mui/icons-material/Person";
import TagIcon from "@mui/icons-material/Tag";
import EventNoteIcon from "@mui/icons-material/EventNote"; // Для типа мероприятия
import DescriptionIcon from "@mui/icons-material/Description"; // Для формата мероприятия
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Для статуса мероприятия
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // Для участников
import axios from "axios";
import Cookies from "js-cookie";

import ProjectAssignment from "./ProjectAssignment"; // Импортируем новый компонент

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      const jwtToken = Cookies.get("auth_token");
      if (!jwtToken) {
        console.error("Токен авторизации отсутствует");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/events/${eventId}`,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
        setEvent(response.data);
      } catch (error) {
        console.error(
          "Ошибка при загрузке мероприятия:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Функция для обновления участников мероприятия
  const handleParticipantsUpdate = async () => {
    const jwtToken = Cookies.get("auth_token");
    if (!jwtToken) {
      console.error("Токен авторизации отсутствует");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setEvent(response.data); // Обновляем состояние с новыми данными
    } catch (error) {
      console.error(
        "Ошибка при обновлении участников мероприятия:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) {
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
    );
  }

  if (!event) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 5 }}>
        Мероприятие не найдено
      </Typography>
    );
  }

  const handleFeedbackSubmit = () => {
    console.log("Отзыв отправлен:", feedback, "Рейтинг:", rating);
    setFeedback("");
    setRating(0);
  };

  // Константы типов участников (на русском языке)
  const ParticipantType = {
    ALL: "Все желающие",
    MEMBERS: "Только отрядники",
  };

  // Константы статусов мероприятия
  const EventStatus = {
    ALL: "Любой",
    COMPLETED: "Проведено",
    IN_PROGRESS: "Проводится",
    SCHEDULED: "Запланировано",
    CANCELED: "Отменено",
  };

  // Константы типов мероприятий (на русском языке)
  const EventType = {
    ALL: "Любой",
    CONFERENCE: "Конференция",
    TRAINING: "Тренинг",
    GRANT_EVENT: "Грантовое мероприятие",
  };

  // Константы форматов мероприятия (на русском языке)
  const EventFormat = {
    ALL: "Любой",
    ONLINE: "Онлайн",
    OFFLINE: "Офлайн",
    MIXED: "Смешанный",
  };

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
        <MuiLink component={Link} to="/dashboard/workspace/events">
          НАЗАД
        </MuiLink>
        <Typography color="text.primary" variant="h6">
          {event.event_full_title}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ padding: 2, margin: "auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240" // Высота карточки
                image={event.event_logo || "/placeholder.jpg"} // URL изображения события с заменой на плейсхолдер
                alt="Event Logo" // Альтернативный текст
                sx={{
                  objectFit: "cover", // Заполнение изображения в карточке, скрывая части, выходящие за границы
                  width: "100%", // Ширина изображения равна 100% ширины карточки
                }}
              />

              <CardContent>
                <Typography variant="h6">Организатор:</Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.event_organizer || "Организатор не указан"}
                </Typography>
                <Divider sx={{ margin: "10px 0", bgcolor: "grey" }} />
                <Typography variant="h7">Место проведения:</Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.event_venue || "Не указано"}
                </Typography>
                <Divider sx={{ margin: "10px 0", bgcolor: "grey" }} />
                <Typography variant="h7">Информационные ресурсы:</Typography>

                {event.event_resources ? (
                  <Typography variant="body2" color="textSecondary">
                    {event.event_resources}
                  </Typography>
                ) : (
                  <Typography>Ресурсы не указаны</Typography>
                )}
                <Divider sx={{ margin: "10px 0", bgcolor: "grey" }} />
                <Typography variant="h7">
                  Начало и окончание мероприятия:
                </Typography>
                <Grid item xs={12} sm={12}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="body2" color="textSecondary">
                      Начало:
                      {event.event_start_date && event.event_start_time
                        ? ` ${new Date(event.event_start_date).toLocaleDateString()}  в ${event.event_start_time}`
                        : "Информация о времени не указана"}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                      Окончание:
                      {event.event_end_date && event.event_end_time
                        ? ` ${new Date(event.event_end_date).toLocaleDateString()}  в ${event.event_end_time}`
                        : "Информация о времени не указана"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={8}>
            <CardContent>
              <Typography variant="h5" align="left" sx={{ mb: 2 }}>
                {event.event_full_title || "Название мероприятия не указано"}
              </Typography>

              <Grid container spacing={2}>
                {/* Поле Формат */}
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <DescriptionIcon />
                    </div>
                    <Stack>
                      <Typography
                        variant="subtitle1"
                        style={{ lineHeight: 1.5, display: "block" }}
                      >
                        Формат:
                      </Typography>
                      <Typography variant="body1" style={{ lineHeight: 1.5 }}>
                        {EventFormat[event.event_format] || "Не указан"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Поле Статус */}
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleIcon />
                    </div>
                    <Stack>
                      <Typography
                        variant="subtitle1"
                        style={{ lineHeight: 1.5, display: "block" }}
                      >
                        Статус:
                      </Typography>
                      <Typography variant="body1" style={{ lineHeight: 1.5 }}>
                        {EventStatus[event.event_status] || "Не указан"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Поле Участие */}
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <PersonAddIcon />
                    </div>
                    <Stack>
                      <Typography
                        variant="subtitle1"
                        style={{ lineHeight: 1.5, display: "block" }}
                      >
                        Участие:
                      </Typography>
                      <Typography variant="body1" style={{ lineHeight: 1.5 }}>
                        {ParticipantType[event.event_allowed_participants] ||
                          "Не указаны"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Поле Тип */}
                <Grid item xs={12} sm={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <EventNoteIcon />
                    </div>
                    <Stack>
                      <Typography
                        variant="subtitle1"
                        style={{ lineHeight: 1.5, display: "block" }}
                      >
                        Тип:
                      </Typography>
                      <Typography variant="body1" style={{ lineHeight: 1.5 }}>
                        {EventType[event.event_type] || "Не указан"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
              {event.event_tags && event.event_tags.length > 0 ? (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {event.event_tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      icon={<TagIcon />}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ mt: 2 }}>Теги не указаны</Typography>
              )}
              <Divider sx={{ margin: "10px 0" }} />

              <Box>
                <Typography variant="h6">О мероприятии</Typography>
                <Typography
                  variant="body2"
                  paragraph
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  {event.event_description}
                </Typography>
              </Box>

              <Divider sx={{ margin: "10px 0" }} />

              <Box>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: "#555" }}>
                    Организаторы
                  </Typography>
                  {event.event_managers && event.event_managers.length > 0 ? (
                    <Stack direction="row" spacing={2}>
                      {event.event_managers.map((manager) => (
                        <Chip
                          icon={<PersonIcon />}
                          key={manager.user_id}
                          label={manager.user_full_name}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "#888" }}>
                      Организаторы не указаны
                    </Typography>
                  )}
                </Grid>

                <Divider sx={{ margin: "10px 0" }} />

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: "#555" }}>
                    Эксперты
                  </Typography>
                  {event.event_experts && event.event_experts.length > 0 ? (
                    <Stack direction="row" spacing={2}>
                      {event.event_experts.map((expert) => (
                        <Chip
                          key={expert.user_id}
                          icon={<PersonIcon />}
                          label={expert.user_full_name}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "#888" }}>
                      Эксперты не указаны
                    </Typography>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Grid>
        </Grid>

        <Box
          sx={{
            p: 3,
            my: 3,
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h6">Ваш проект на мероприятии:</Typography>
          <ProjectAssignment
            eventId={eventId}
            onParticipantsUpdate={handleParticipantsUpdate} // Передаем обработчик обновления участников
          />

          <Box
            sx={{
              p: 3,
              my: 3,
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
            >
              Участники мероприятия
            </Typography>
            {event.event_participants && event.event_participants.length > 0 ? (
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {event.event_participants.map((participant) => (
                  <Chip
                    key={participant.user_id}
                    label={participant.user_full_name}
                    icon={<PersonIcon />}
                    sx={{
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </Stack>
            ) : (
              <Typography sx={{ mt: 2, color: "#888" }}>
                Участники пока отсутствуют
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 4, p: 3, boxShadow: 1, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Оставить отзыв о мероприятии
          </Typography>
          <Stack spacing={2}>
            <Rating
              name="event-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
            />
            <TextField
              label="Ваш отзыв"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<FeedbackIcon />}
              onClick={handleFeedbackSubmit}
              disabled={!feedback}
            >
              Отправить отзыв
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetailsPage;
