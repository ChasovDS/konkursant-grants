// RoleManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  InputLabel,
  TablePagination,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const RoleManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState({});
  const RoleEnum = {
    ADMIN: "admin",
    MODERATOR: "moderator",
    EVENT_MANAGER: "event_manager",
    EXPERT: "expert",
    USER: "user"
    };

  // Функция для получения списка пользователей с пагинацией
  const fetchUsers = async (page, limit) => {
    const jwtToken = Cookies.get('auth_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/profile?details=false&abbreviated=true&page=${page + 1}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUsers(response.data);
      setTotalUsers(response.totalUsers || 0);
      initializeSelectedRoles(response.data);
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  // Инициализация выбранных ролей
  const initializeSelectedRoles = (data) => {
    const initialRoles = {};
    data.forEach(user => {
      initialRoles[user.user_id] = user.role_name || '';
    });
    setSelectedRoles(initialRoles);
  };

// Функция для обновления роли пользователя
const updateRole = async (userId) => {
    const jwtToken = Cookies.get('auth_token');
    const newRole = selectedRoles[userId];

    // Проверка на выбор роли
    if (!newRole) {
        alert('Пожалуйста, выберите роль.');
        return;
    }

    // Логируем данные перед отправкой
    console.log(`Обновление роли для пользователя ${userId}:`, { role: newRole });

    try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/v1/user/role/${userId}`, {
            role: newRole, // Передаем роль в теле запроса
        }, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json', // Убедитесь, что заголовок установлен
            },
        });
        alert('Роль успешно обновлена!');
    } catch (error) {
        console.error('Ошибка при обновлении роли:', error.response ? error.response.data : error.message);
        alert('Ошибка при обновлении роли.');
    }
};



  useEffect(() => {
    fetchUsers(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setLoading(true);
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
      {users.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ФИО</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.external_service_accounts.email}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedRoles[user.user_id] || ''}
                        onChange={(e) => setSelectedRoles({ ...selectedRoles, [user.user_id]: e.target.value })}
                      >
                        {Object.values(RoleEnum).map((role) => (
                          <MenuItem key={role} value={role}>{role}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => updateRole(user.user_id)}
                    >
                      Сохранить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">Пользователи не найдены.</Typography>
        </Box>
      )}
      <TablePagination
        component="div"
        count={totalUsers}
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

export default RoleManager;
