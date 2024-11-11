// src/components/workspace/AdminTabs/UserListAdmin.jsx
import React, { useEffect, useState } from "react";
import {
  Pagination,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../../api/Admin_API"; 
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SecurityIcon from "@mui/icons-material/Security";
import RoleModal from "./ComponentsAdminPage/RoleModal";

const roleTranslations = {
  admin: "Администратор",
  moderator: "Модератор",
  event_manager: "Руководитель мероприятий",
  expert: "Эксперт",
  user: "Участник мероприятий",
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fullNameFilter, setFullNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { users, totalCount } = await fetchUsers(page, rowsPerPage, fullNameFilter, emailFilter, roleFilter);
      setUsers(users);
      setTotalUsers(totalCount);
    } catch (error) {
      console.error("Ошибка при получении списка пользователей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, fullNameFilter, emailFilter, roleFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewProfile = (userId) => {
    navigate(`/workspace/profile/${userId}`);
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setOpenRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
    setSelectedUser(null);
  };

  return (
    <Box>
      <TextField
        label="Поиск по ФИО"
        variant="outlined"
        value={fullNameFilter}
        size="small"
        onChange={(e) => setFullNameFilter(e.target.value)}
        style={{ margin: "10px" }}
      />
      <TextField
        label="Поиск по Email (Yandex)"
        variant="outlined"
        value={emailFilter}
        size="small"
        onChange={(e) => setEmailFilter(e.target.value)}
        style={{ margin: "10px" }}
      />
      <FormControl variant="outlined" style={{ margin: "10px", minWidth: 250 }}>
        <InputLabel>Роль</InputLabel>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          label="Роль"
          size="small"
          startAdornment={
            <InputAdornment position="start">
              <IconButton>
                <WorkspacePremiumIcon />
              </IconButton>
            </InputAdornment>
          }
        >
          <MenuItem value="">
            <em>Все</em>
          </MenuItem>
          {Object.keys(roleTranslations).map((role) => (
            <MenuItem key={role} value={role}>
              {roleTranslations[role]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper style={{ padding: "10px", margin: "10px" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {users.length === 0 ? (
              <p>Пользователи не найдены.</p>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>№</TableCell>
                      <TableCell>Полное имя</TableCell>
                      <TableCell>Email (Yandex)</TableCell>
                      <TableCell>Роль</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          {page * rowsPerPage + (index + 1)}
                        </TableCell>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>
                          {user.external_service_accounts.yandex}
                        </TableCell>
                        <TableCell>
                          {roleTranslations[user.role_name] || user.role_name}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Просмотр профиля">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewProfile(user.user_id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Назначить роль">
                            <IconButton
                              color="secondary"
                              onClick={() => handleOpenRoleModal(user)}
                            >
                              <SecurityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Pagination
              count={Math.ceil(totalUsers / rowsPerPage)}
              page={page + 1}
              onChange={handleChangePage}
              variant="outlined"
              shape="rounded"
              style={{
                marginTop: "10px",
                justifyContent: "center",
                display: "flex",
              }}
            />
          </>
        )}
      </Paper>

      <RoleModal
        open={openRoleModal}
        onClose={handleCloseRoleModal}
        user={selectedUser}
        onRoleUpdated={loadUsers}
      />
    </Box>
  );
};

export default UserTable;
