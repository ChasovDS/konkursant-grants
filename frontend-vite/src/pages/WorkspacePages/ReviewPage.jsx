import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Snackbar,
  Alert,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  Box,
  IconButton,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";

const EventStatus = {
  ALL: "Любой",
  COMPLETED: "Проведено",
  IN_PROGRESS: "Проводится",
  SCHEDULED: "Запланировано",
  CANCELED: "Отменено",
};

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState(EventStatus.ALL);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/events/expert/list`,
          {
            withCredentials: true,
            params: {
              page,
              limit: rowsPerPage,
              title: searchTitle,
              status: filterStatus === EventStatus.ALL ? undefined : filterStatus,
            },
          }
        );
        setEvents(response.data);
        const totalCountFromHeader = response.headers["x-total-count"];
        setTotalCount(parseInt(totalCountFromHeader, 10));
      } catch (error) {
        console.error("Ошибка при загрузке мероприятий:", error);
        setError("Не удалось загрузить мероприятия. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, rowsPerPage, searchTitle, filterStatus]);

  const handleViewProjects = (eventId) => {
    navigate(`/workspace/reviews/${eventId}/projects`);
  };

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };


  if (loading) return <div>Загрузка...</div>;

  return (
    <Box>
      <Box style={{ padding: "10px", my: "10px" }}>
        <TextField
          label="Поиск по названию"
          size="small"
          variant="outlined"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{ marginBottom: "10px", width: "300px" }}
          InputProps={{
            startAdornment: (
              <IconButton>
                <TitleIcon />
              </IconButton>
            ),
          }}
        />
        <TextField
          select
          label="Фильтр по статусу"
          size="small"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ marginBottom: "10px", marginLeft: "10px", width: "200px" }}
        >
          {Object.values(EventStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Paper style={{ padding: "10px", margin: "10px" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Логотип</TableCell>
                <TableCell>Название мероприятия</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата и время начала</TableCell>
                <TableCell>Теги</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <TableRow key={event.id_event}>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <img
                        src={event.event_logo}
                        alt={event.event_full_title}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    </TableCell>
                    <TableCell>{event.event_full_title}</TableCell>
                    <TableCell>
                      {EventStatus[event.event_status] || event.event_status}
                    </TableCell>
                    <TableCell>
                      {new Date(event.event_start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {event.event_tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} style={{ margin: "2px" }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewProjects(event.id_event)}
                      >
                        Открыть проекты
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Нет мероприятий для отображения.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(totalCount / rowsPerPage)}
          page={page}
          onChange={handlePaginationChange}
          variant="outlined"
          shape="rounded"
          style={{
            marginTop: "10px",
            justifyContent: "center",
            display: "flex",
          }}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default EventsList;