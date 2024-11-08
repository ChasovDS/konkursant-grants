// EventsList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Snackbar, Alert } from '@mui/material';
import Cookies from 'js-cookie';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const jwtToken = Cookies.get('auth_token');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/events/expert/list', {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке мероприятий:', error);
                setError('Не удалось загрузить мероприятия. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleViewProjects = (eventId) => {
        navigate(`/dashboard/workspace/reviews/${eventId}/projects`);
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <Paper style={{ padding: '10px', margin: '10px' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>№</TableCell>
                            <TableCell>Название мероприятия</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Дата и время начала</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event, index) => (
                            <TableRow key={event.id_event}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{event.event_full_title}</TableCell>
                                <TableCell>{event.event_status}</TableCell>
                                <TableCell>{event.event_start_date}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleViewProjects(event.id_event)}
                                    >
                                        Открыть проекты
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default EventsList;