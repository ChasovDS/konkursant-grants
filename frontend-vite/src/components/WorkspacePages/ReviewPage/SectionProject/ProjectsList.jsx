import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  TextField,
  Pagination,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import TitleIcon from "@mui/icons-material/Title";
import StarRateIcon from "@mui/icons-material/StarRate";
import { AuthContext } from '../../../ComponentsApp/AuthProvider';
import { fetchProjects, fetchCurrentUser } from '../../../../api/Review_API';

const ProjectsList = () => {
  const { session } = useContext(AuthContext);
  const { eventId } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, totalCount } = await fetchProjects(
          eventId,
          page,
          rowsPerPage,
          authorSearchTerm,
          titleSearchTerm,
          ratingFilter
        );
        setProjects(data);
        setTotalCount(totalCount);

        if (session.user && session.user.user_id) {
          setUserId(session.user.user_id);
        } else {
          const userId = await fetchCurrentUser();
          setUserId(userId);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [
    eventId,
    page,
    rowsPerPage,
    authorSearchTerm,
    titleSearchTerm,
    ratingFilter,
  ]);

  const handleViewProject = (projectId) => {
    navigate(`/workspace/projects/review/${projectId}`);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
    setPage(1);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
        <MuiLink component={Link} to="/workspace/reviews">
          НАЗАД
        </MuiLink>
        <Typography color="text.primary" variant="h6">
          Список проектов мероприятия:
        </Typography>
      </Breadcrumbs>

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
        <TextField
          select
          label="Фильтр по оценке"
          size="small"
          variant="outlined"
          value={ratingFilter}
          onChange={handleRatingFilterChange}
          sx={{ minWidth: 200 }}
          SelectProps={{
            native: true,
          }}
          InputProps={{
            startAdornment: (
              <IconButton>
                <StarRateIcon />
              </IconButton>
            ),
          }}
        >
          <option value="">Все</option>
          <option value="rated">Оценено</option>
          <option value="not-rated">Не оценено</option>
        </TextField>
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
                <TableCell>Моя оценка</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project, index) => {
                  const expertReview = project.reviews.find(
                    (review) => review.expert_id === userId
                  );
                  const myScore = expertReview
                    ? expertReview.score
                    : "Не оценено";

                  if (ratingFilter === "rated" && myScore === "Не оценено")
                    return null;
                  if (ratingFilter === "not-rated" && myScore !== "Не оценено")
                    return null;

                  return (
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
                      <TableCell>{myScore}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleViewProject(project.project_id)}
                        >
                          Открыть проект
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
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
    </Box>
  );
};

export default ProjectsList;
