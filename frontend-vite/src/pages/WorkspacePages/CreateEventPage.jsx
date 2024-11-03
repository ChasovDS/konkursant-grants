// src/pages/WorkspacePages/CreateEventPage.jsx
import React from 'react';
import EventForm from '../../components/ComponentsEvents/EventForm';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreateEventPage = () => {
  const jwtToken = Cookies.get('auth_token');

  const prepareEventData = (eventData) => ({
    event_logo: "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/62335d27-96cc-4e9f-a444-af131db1bf1e/original=true,quality=90/37047996.jpeg",  // ВРЕМЕННО КАК ЗАГЛУШКА
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

  const handleSaveDraft = async (eventData) => {
    const eventDetails = prepareEventData(eventData);
    eventDetails.event_publish = 'draft';
    console.log("Значения 2 ", eventDetails)


    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(eventDetails),
      });
      if (!response.ok) throw new Error('Не удалось сохранить черновик');
      console.log('Черновик сохранен');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePublish = async (eventData, tags, description, logo) => {
    const eventDetails = prepareEventData(eventData, tags, description, logo);
    eventDetails.event_publish = 'publish';

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(eventDetails),
      });
      if (!response.ok) throw new Error('Не удалось опубликовать мероприятие');
      console.log('Мероприятие опубликовано');
    } catch (error) {
      console.error(error.message);
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
