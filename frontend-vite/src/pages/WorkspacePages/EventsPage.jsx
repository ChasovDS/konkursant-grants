import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Box, CircularProgress, Snackbar } from '@mui/material';

import EventsList from '../../components/WorkspacePages/EventPage/EventsList';
import EventFilter from '../../components/WorkspacePages/EventPage/ComponentsEventPage/EventFilter';
import Paginate from '../../components/WorkspacePages/EventPage/ComponentsEventPage/Paginate';

import axios from 'axios';
import Cookies from 'js-cookie';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const limit = 6;

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const jwtToken = Cookies.get('auth_token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/events', {
        headers: { Authorization: `Bearer ${jwtToken}` },
        params: { page, limit, ...filters },
      });
      setEvents(response.data.events);
      setTotalEvents(response.data.total || 0);
    } catch (err) {
      console.error('Ошибка при получении списка мероприятий:', err);
      setError('Не удалось загрузить мероприятия. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <Box>
      <EventFilter 
        onFilter={handleFilter} 
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {events.length > 0 ? (
            <>
              <EventsList events={events} />
              <Paginate
                count={Math.ceil(totalEvents / limit)}
                page={page}
                onPageChange={handleChangePage}
              />
            </>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Мероприятия не найдены.
            </Typography>
          )}
        </>
      )}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Box>
  );
};

export default EventsPage;
