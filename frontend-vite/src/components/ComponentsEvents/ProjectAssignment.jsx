import React, { useState, useEffect, useContext } from "react";
import {
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from './../../components/ComponentsApp/AuthProvider';

const ProjectAssignment = ({ eventId, onParticipantsUpdate }) => {
  const { session } = useContext(AuthContext);
  const userId = session.user.user_id;
  const [project, setProject] = useState("");
  const [userProject, setUserProject] = useState(null);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Функция для обработки ошибок
  const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error.response?.data || error.message);
    setSnackbar({ open: true, message: defaultMessage });
  };

  // Функция для получения проектов и информации о пользователе
  const fetchProjectsAndUserParticipation = async () => {
    const jwtToken = Cookies.get("auth_token");
    if (!jwtToken) {
      console.error("Токен авторизации отсутствует");
      return;
    }

    try {
      // Получение проектов пользователя
      const projectsResponse = await axios.get(
        `http://127.0.0.1:8000/api/v1/projects/me`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setAvailableProjects(projectsResponse.data);
      console.log("Доступные проекты:", projectsResponse.data);

      // Получение информации о мероприятии
      const eventResponse = await axios.get(
        `http://127.0.0.1:8000/api/v1/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );


        // Проверяем, есть ли user_id
        let user_id;

        // Если user_id нет, выполняем запрос для получения user_id
        try {
          const userResponse = await axios.get(
            `http://127.0.0.1:8000/api/v1/users/me?details=false&abbreviated=true`,
            {
              headers: { Authorization: `Bearer ${jwtToken}` }, // Передаем токен авторизации
            }
          );

          // Получаем user_id из ответа
          user_id = userResponse.data.user_id;

        } catch (error) {
          console.error("Ошибка при получении user_id:", error);
          // Здесь можно обработать ошибку, например, установить user_id в null или выполнить другую логику
          user_id = null; // или любое другое значение по умолчанию
        }



      // Проверка участия пользователя в мероприятии
      console.log("id пользователя:", userId);
      const participant = eventResponse.data.event_participants.find(
        (participant) => participant.user_id === userId
      );

      if (participant) {
        // Устанавливаем проект пользователя
        const projectDetails = projectsResponse.data.find(
          (proj) => proj.project_id === participant.projects_id
        );
        setUserProject(projectDetails || null); // Сохраняем объект проекта
      } else {
        setUserProject(null);
      }
    } catch (error) {
      handleError(error, "Ошибка при загрузке данных");
    }
  };

  useEffect(() => {
    fetchProjectsAndUserParticipation();
  }, [eventId]);

  const handleProjectSubmit = async () => {
    const jwtToken = Cookies.get("auth_token");
    if (!jwtToken || !project) {
      console.error("Токен авторизации отсутствует или проект не выбран");
      return;
    }

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/v1/events/${eventId}/project/${project}`,
        {},
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      const selectedProject = availableProjects.find(
        (proj) => proj.project_id === project
      );
      setUserProject(selectedProject); // Устанавливаем текущий проект
      setProject(""); // Сбрасываем выбранный проект
      setSnackbar({ open: true, message: "Проект успешно подан!" });
      onParticipantsUpdate(); // Обновляем список участников
    } catch (error) {
      handleError(error, "Ошибка при подаче проекта");
    }
  };

  const handleRevokeProject = async () => {
    const jwtToken = Cookies.get("auth_token");
    if (!jwtToken || !userProject) {
      console.error("Токен авторизации отсутствует или проект не выбран");
      return;
    }

    try {
      // Удаляем запись о пользователе и проекте из мероприятия
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/events/${eventId}/project/${userProject.project_id}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      setUserProject(null); // Сбрасываем проект пользователя
      setSnackbar({ open: true, message: "Проект успешно отозван!" });
      onParticipantsUpdate(); // Обновляем список участников
    } catch (error) {
      handleError(error, "Ошибка при отзыве проекта");
    }
  };

  const openRevokeDialog = () => {
    setOpenDialog(true);
  };

  const closeRevokeDialog = () => {
    setOpenDialog(false);
  };

  const closeSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
      {userProject ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={`${userProject.project_name}`} />
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={openRevokeDialog}
            sx={{ padding: "8px 16px", borderRadius: "8px" }}
          >
            Отозвать проект
          </Button>
        </Stack>
      ) : (
        <>
          <Select
            value={project || ""}
            fullWidth
            onChange={(e) => {
              console.log("Выбранный проект:", e.target.value);
              setProject(e.target.value);
            }}
            displayEmpty
            size="small"
            sx={{ borderRadius: "8px", mt: 1 }}
          >
            <MenuItem value="" disabled>
              Выберите проект
            </MenuItem>
            {availableProjects.map((proj) => (
              <MenuItem key={proj.project_id} value={proj.project_id}>
                {proj.project_name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="outlined"
            color="primary"
            disabled={!project}
            onClick={handleProjectSubmit}
            fullWidth
            sx={{ padding: "8px 16px", borderRadius: "8px" }}
          >
            Подать проект на мероприятие
          </Button>
        </>
      )}

      <Dialog open={openDialog} onClose={closeRevokeDialog}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите отозвать проект?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRevokeDialog} color="primary">
            Отмена
          </Button>
          <Button
            onClick={() => {
              handleRevokeProject();
              closeRevokeDialog();
            }}
            color="secondary"
          >
            Отозвать
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      />
    </Stack>
  );
};

export default ProjectAssignment;
