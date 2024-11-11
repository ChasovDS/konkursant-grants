
// src/pages/WorkspacePages/CreateEventPage.jsx
import React from 'react';
import EventForm from './ComponentsEventPage/EventForm';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { submitEvent } from '../../../api/Event_API';

const CreateEventPage = () => {
  const jwtToken = Cookies.get('auth_token');
  const navigate = useNavigate();

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

  const handleEventSubmission = async (eventData, publishStatus) => {
    const eventDetails = prepareEventData(eventData);
    eventDetails.event_publish = publishStatus;
    console.log(`Данные для ${publishStatus}: `, eventDetails);

    try {
      await submitEvent(eventDetails, jwtToken);
      navigate('/workspace/events');
    } catch (error) {
      console.error(`Ошибка при ${publishStatus === 'BLACKWELL' ? 'сохранении черновика' : 'публикации мероприятия'}:`, error.message);
    }
  };

  const handleSaveDraft = (eventData) => handleEventSubmission(eventData, 'BLACKWELL');
  const handlePublish = (eventData) => handleEventSubmission(eventData, 'READY_EVENT');

  return (
    <EventForm 
      title="Создание мероприятия"
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
};

export default CreateEventPage;