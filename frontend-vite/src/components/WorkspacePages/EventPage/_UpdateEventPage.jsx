// src\pages\WorkspacePages\UpdateEventPage.jsx
import React from 'react';
import EventForm from './ComponentsEventPage/EventForm';

const UpdateEventPage = () => {
  const handleSaveDraft = () => {
    // Логика обновления черновика
    console.log('Черновик обновлен');
  };

  const handlePublish = () => {
    // Логика обновления мероприятия
    console.log('Мероприятие обновлено');
  };

  return (
    <EventForm 
      title="Обновление мероприятия"
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
};

export default UpdateEventPage;