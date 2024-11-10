// src/components/EventsList.jsx
import React from 'react';
import EventCard from './ComponentsEventPage/EventCard';
import { Grid } from '@mui/material';

const EventsList = ({ events }) => {
  return (
    <Grid container spacing={2}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id_event}>
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventsList;
