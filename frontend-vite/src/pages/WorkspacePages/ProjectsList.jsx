// ProjectsList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    Box,
    Breadcrumbs,
    Link as MuiLink,
} from '@mui/material';

import Cookies from 'js-cookie';

const ProjectsList = () => {
    const { eventId } = useParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const jwtToken = Cookies.get('auth_token');
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/events/${eventId}/projects`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setProjects(response.data);

                const userResponse = await axios.get(
                    `http://127.0.0.1:8000/api/v1/users/me?details=false&abbreviated=true`,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setUserId(userResponse.data.user_id);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Не удалось загрузить проекты. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [eventId]);

    const handleViewProject = (projectId) => {
        navigate(`/dashboard/workspace/projects/${projectId}`);
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
            <MuiLink component={Link} to="/dashboard/workspace/reviews">
                НАЗАД
            </MuiLink>
            <Typography color="text.primary" variant="h6">
                Список проектов мероприятия:
            </Typography>
            </Breadcrumbs>
        <Paper style={{ padding: '10px', margin: '10px' }}>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер</TableCell>
                            <TableCell>Название проекта</TableCell>
                            <TableCell>Автор</TableCell>
                            <TableCell>Средняя оценка</TableCell>
                            <TableCell>Моя оценка</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project, index) => {
                            const expertReview = project.reviews.find(review => review.expert_id === userId);
                            const myScore = expertReview ? expertReview.score : 'Не оценено';

                            return (
                                <TableRow key={project.project_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{project.project_name}</TableCell>
                                    <TableCell>{project.author_name}</TableCell>
                                    <TableCell>
                                        {project.reviews.length > 0
                                            ? (project.reviews.reduce((acc, review) => acc + review.score, 0) / project.reviews.length).toFixed(2)
                                            : 'Нет оценок'}
                                    </TableCell>
                                    <TableCell>{myScore}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleViewProject(project.project_id)}
                                        >
                                            Открыть проект
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Paper>
        </Box>
    );
};

export default ProjectsList;