import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Box, CircularProgress, Snackbar } from '@mui/material';

import EventsList from '../../components/WorkspacePages/EventPage/EventsList';
import EventFilter from '../../components/WorkspacePages/EventPage/ComponentsEventPage/EventFilter';
import Paginate from '../../components/WorkspacePages/EventPage/ComponentsEventPage/Paginate';

import { fetchEvents } from '../../api/Event_API';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);
  const limit = 6;

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { events, total } = await fetchEvents(page, limit, filters);
      setEvents(events);
      setTotalEvents(total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

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
