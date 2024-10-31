// src/pages/EventsPage.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Box, Pagination, CircularProgress } from '@mui/material';
import EventsList from '../../components/EventsList';
import EventFilter from '../../components/EventFilter';
import CreateEventModal from '../../components/CreateEventModal';
import axios from 'axios';
import Cookies from 'js-cookie';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [filters, setFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const limit = 10;

  const fetchEvents = async (page, filters = {}) => {
    const jwtToken = Cookies.get('auth_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/events`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        params: { page, limit, ...filters },
      });
      setEvents(response.data);
      setTotalEvents(response.total || 0);
    } catch (error) {
      console.error('Ошибка при получении списка мероприятий:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page, filters);
  }, [page, filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <EventFilter 
        onFilter={handleFilter} 
        onAddEvent={() => setModalOpen(true)} 
      />
      {events.length > 0 ? (
        <>
          <EventsList events={events} />
          <Pagination
            count={Math.ceil(totalEvents / limit)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            style={{ marginTop: '16px' }}
          />
        </>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Мероприятия не найдены.
        </Typography>
      )}
      <CreateEventModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        fetchEvents={() => fetchEvents(page, filters)} 
      />
    </Box>
  );
};

export default EventsPage;
