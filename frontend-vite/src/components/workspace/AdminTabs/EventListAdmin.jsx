// EventList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isFetching, setIsFetching] = useState(false); // Флаг для предотвращения повторных запросов

  // Функция для получения мероприятий
  const fetchEvents = async (page, limit) => {
    const jwtToken = Cookies.get('auth_token');
    if (isFetching) return; // Если запрос уже выполняется, не выполнять новый запрос
    setIsFetching(true); // Устанавливаем флаг перед началом запроса
    setLoading(true); // Устанавливаем состояние загрузки

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/events?page=${page + 1}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setEvents(response.data);
      setTotalEvents(response.totalEvents || 0);
    } catch (error) {
      console.error('Ошибка при получении списка мероприятий:', error);
    } finally {
      setIsFetching(false); // Сбрасываем флаг после завершения запроса
      setLoading(false); // Сбрасываем состояние загрузки
    }
  };

  useEffect(() => {
    fetchEvents(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {events.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название мероприятия</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата начала</TableCell>
                <TableCell>Дата окончания</TableCell>
                <TableCell>Местоположение</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id_event}>
                  <TableCell>{event.full_title}</TableCell>
                  <TableCell>{event.event_type}</TableCell>
                  <TableCell>{event.event_status}</TableCell>
                  <TableCell>{new Date(event.event_start_date).toLocaleString()}</TableCell>
                  <TableCell>{new Date(event.event_end_date).toLocaleString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">Мероприятия не найдены.</Typography>
      )}
      <TablePagination
        component="div"
        count={totalEvents}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default EventList;
