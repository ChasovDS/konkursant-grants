// UserList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  TablePagination,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { PageContainer } from '@toolpad/core/PageContainer';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page, limit) => {
    const jwtToken = Cookies.get('auth_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/profile?details=false&abbreviated=true&page=${page + 1}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUsers(response.data);
      // Предположим, что API возвращает общее количество пользователей
      setTotalUsers(response.totalUsers || 0);
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
    } finally {
      setLoading(false);
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

  const handleViewProfile = (userId) => {
    // Логика для открытия подробной информации о пользователе
    console.log(`Просмотр профиля пользователя с ID: ${userId}`);
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
                <TableCell>Полное имя</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Яндекс</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.role_name}</TableCell>
                  <TableCell>{user.external_service_accounts.yandex || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleViewProfile(user.user_id)}
                    >
                      Посмотреть профиль
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">Пользователи не найдены.</Typography>
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

export default UserList;
