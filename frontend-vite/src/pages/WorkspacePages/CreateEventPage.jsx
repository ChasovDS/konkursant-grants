// src/pages/WorkspacePages/CreateEventPage.jsx
import React from 'react';
import EventForm from '../../components/ComponentsEvents/EventForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CreateEventPage = () => {
  // Получаем JWT-токен из куки
  const jwtToken = Cookies.get('auth_token');
  const navigate = useNavigate();

  // Функция для подготовки данных события перед отправкой на сервер
  const prepareEventData = (eventData) => ({
    event_logo: eventData.logoBASE,
    event_full_title: eventData.title,
    event_type: eventData.type,
    event_format: eventData.format,
    event_status: eventData.status,
    event_venue: eventData.location,
    event_organizer: eventData.organizer,
    event_description: eventData.description,
    event_resources: eventData.resources,
    event_allowed_participants: eventData.participantType,
    event_start_date: eventData.startDate,
    event_start_time: eventData.startTime,
    event_end_date: eventData.endDate,
    event_end_time: eventData.endTime,
    event_tags: eventData.tags,
    event_managers: eventData.managers,
    event_experts: eventData.experts,
  });

  // Функция для сохранения черновика события
  const handleSaveDraft = async (eventData) => {
    const eventDetails = prepareEventData(eventData);
    eventDetails.event_publish = 'BLACKWELL'; // Устанавливаем статус "черновик"
    console.log("Данные для черновика: ", eventDetails);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/events', eventDetails, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log('Черновик сохранен:', response.data);
      navigate('/dashboard/workspace/events'); // Переадресация на страницу событий
    } catch (error) {
      console.error('Ошибка при сохранении черновика:', error.response?.data || error.message);
    }
  };

  // Функция для публикации события
  const handlePublish = async (eventData) => {
    const eventDetails = prepareEventData(eventData);
    eventDetails.event_publish = 'READY_EVENT'; // Устанавливаем статус "опубликовано"
    console.log("Данные для публикации: ", eventDetails);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/events', eventDetails, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log('Мероприятие опубликовано:', response.data);
      navigate('/dashboard/workspace/events'); // Переадресация на страницу событий
    } catch (error) {
      console.error('Ошибка при публикации мероприятия:', error.response?.data || error.message);
    }
  };

  return (
    <EventForm 
      title="Создание мероприятия"
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
};

export default CreateEventPage;
