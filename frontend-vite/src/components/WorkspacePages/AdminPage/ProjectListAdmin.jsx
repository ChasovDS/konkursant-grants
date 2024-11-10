// src/components/workspace/AdminTabs/ProjectListAdmin.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  Pagination,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import TitleIcon from "@mui/icons-material/Title";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteProjectModal from "../ProjectPage/ComponentsProjectPage/DeleteProjectModal"; // Импортируем модальное окно


const ProjectsList = () => {
  const { eventId } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const jwtToken = Cookies.get("auth_token");
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/projects-all`, // Изменённый эндпоинт
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
            params: {
              page,
              limit: rowsPerPage,
              author: authorSearchTerm.trim(),
              title: titleSearchTerm.trim(),
            },
          }
        );
        setProjects(response.data);
        const totalCountFromHeader = response.headers["x-total-count"];
        setTotalCount(
          totalCountFromHeader ? parseInt(totalCountFromHeader, 10) : 0
        );
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setError("Не удалось загрузить проекты. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [eventId, page, rowsPerPage, authorSearchTerm, titleSearchTerm]);

  const handleViewProject = (projectId) => {
    navigate(`/workspace/projects/${projectId}`);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleDeleteProject = async () => {
    const jwtToken = Cookies.get("auth_token");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/projects/${projectToDelete}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.project_id !== projectToDelete)
      );
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Ошибка при удалении проекта:", error);
      setError("Не удалось удалить проект. Пожалуйста, попробуйте позже.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, my: 2, padding: "10px" }}>
        <TextField
          label="Поиск по названию проекта"
          size="small"
          variant="outlined"
          onChange={(e) => setTitleSearchTerm(e.target.value)}
          value={titleSearchTerm}
          InputProps={{
            startAdornment: (
              <IconButton>
                <TitleIcon />
              </IconButton>
            ),
          }}
        />
        <TextField
          label="Поиск по ФИО автора"
          size="small"
          variant="outlined"
          onChange={(e) => setAuthorSearchTerm(e.target.value)}
          value={authorSearchTerm}
          InputProps={{
            startAdornment: (
              <IconButton>
                <PersonIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      <Paper style={{ padding: "10px", margin: "10px" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Название проекта</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Средняя оценка</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <TableRow key={project.project_id}>
                    <TableCell>
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{project.project_name}</TableCell>
                    <TableCell>{project.author_name}</TableCell>
                    <TableCell>
                      {project.reviews.length > 0
                        ? (
                            project.reviews.reduce(
                              (acc, review) => acc + review.score,
                              0
                            ) / project.reviews.length
                          ).toFixed(2)
                        : "Нет оценок"}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Tooltip title="Открыть проект">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() =>
                              handleViewProject(project.project_id)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Удалить проект">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => {
                              setProjectToDelete(project.project_id);
                              setDeleteModalOpen(true);
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
                  <TableCell colSpan={5} align="center">
                    Нет проектов для отображения.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={Math.ceil(totalCount / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
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

      <DeleteProjectModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        projectName={
          projects.find((project) => project.project_id === projectToDelete)
            ?.project_name || ""
        }
      />
    </Box>
  );
};

export default ProjectsList;
