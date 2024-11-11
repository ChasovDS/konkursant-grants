// src/components/WorkspacePages/EventPage/ComponentsEventPage/ProjectAssignment.jsx
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
import { AuthContext } from "../../../ComponentsApp/AuthProvider";
import {
  fetchUserProjects,
  fetchEventData,
  fetchUserDetails,
  updateEventProject,
  deleteEventProject,
} from "../../../../api/Event_API";

const ProjectAssignment = ({ eventId, onParticipantsUpdate }) => {
  const { session } = useContext(AuthContext);
  const userId = session.user.user_id;
  const [project, setProject] = useState("");
  const [userProject, setUserProject] = useState(null);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error.response?.data || error.message);
    setSnackbar({ open: true, message: defaultMessage });
  };

  const fetchProjectsAndUserParticipation = async () => {
    try {
      const projectsData = await fetchUserProjects();
      setAvailableProjects(projectsData);
      const eventData = await fetchEventData(eventId);

      let user_id;
      try {
        const userData = await fetchUserDetails();
        user_id = userData.user_id;
      } catch (error) {
        console.error("Ошибка при получении user_id:", error);
        user_id = null;
      }

      const participant = eventData.event_participants.find(
        (participant) => participant.user_id === userId
      );

      if (participant) {
        const projectDetails = projectsData.find(
          (proj) => proj.project_id === participant.projects_id
        );
        setUserProject(projectDetails || null);
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
    try {
      await updateEventProject(eventId, project);

      const selectedProject = availableProjects.find(
        (proj) => proj.project_id === project
      );
      setUserProject(selectedProject);
      setProject("");
      setSnackbar({ open: true, message: "Проект успешно подан!" });
      onParticipantsUpdate();
    } catch (error) {
      handleError(error, "Ошибка при подаче проекта");
    }
  };

  const handleRevokeProject = async () => {
    if (!userProject) {
      console.error("Нет выбранного проекта для отзыва");
      return;
    }

    try {
      await deleteEventProject(eventId, userProject.project_id);
      setUserProject(null);
      setSnackbar({ open: true, message: "Проект успешно отозван!" });
      onParticipantsUpdate();
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
