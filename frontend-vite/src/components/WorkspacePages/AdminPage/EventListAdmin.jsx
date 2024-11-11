// src/components/EventsList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteEventModal from "./ComponentsAdminPage/DeleteEventModal";
import { fetchEvents, deleteEvent } from "../../../api/Admin_API"; 
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
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const { events, totalCount } = await fetchEvents(page, rowsPerPage, searchTitle, filterStatus);
        setEvents(events);
        setTotalCount(totalCount);
      } catch (error) {
        setError("Не удалось загрузить мероприятия. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [page, rowsPerPage, searchTitle, filterStatus]);

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(eventToDelete);
      setEvents(events.filter((event) => event.id_event !== eventToDelete));
      setModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      setError("Не удалось удалить мероприятие. Пожалуйста, попробуйте позже.");
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/workspace/events/${eventId}`);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/workspace/events/edit/${eventId}`);
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
                <TableCell>Дата начала</TableCell>
                <TableCell>Теги</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <TableRow key={event.id_event}>
                    <TableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>
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
                      <Box display="flex" alignItems="center">
                        <Tooltip title="Просмотр мероприятия">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleViewEvent(event.id_event)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Редактирование мероприятия">
                          <IconButton
                            color="secondary"
                            size="small"
                            sx={{ display: 'none' }}
                            onClick={() => handleEditEvent(event.id_event)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Удаление мероприятия">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                              setEventToDelete(event.id_event);
                              setModalOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
      <DeleteEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteEvent}
        eventName={events.find(event => event.id_event === eventToDelete)?.event_full_title}
      />
    </Box>
  );
};

export default EventsList;
