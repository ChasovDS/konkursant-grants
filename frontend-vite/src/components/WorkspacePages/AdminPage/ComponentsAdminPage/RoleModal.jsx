// src/components/WorkspacePages/AdminPage/ComponentsAdminPage/RoleModal.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, FormControl, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material';
import { updateUserRole } from '../../../../api/Admin_API'; // Обновленный импорт

const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
};

const RoleModal = ({ open, onClose, user, onRoleUpdated }) => {
    const [selectedRole, setSelectedRole] = useState(user ? user.role_name : '');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleUpdateRole = async () => {
        try {
            await updateUserRole(user.user_id, selectedRole);
            setSnackbarMessage('Роль успешно обновлена!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            onRoleUpdated(); // Вызываем функцию обновления данных
            onClose();
        } catch (error) {
            setSnackbarMessage('Ошибка при обновлении роли.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={ModalStyle}>
                    <Typography variant="h6" component="h2">
                        Обновить роль для: {user ? user.full_name : ''}
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <MenuItem value="admin">Администратор</MenuItem>
                            <MenuItem value="moderator">Модератор</MenuItem>
                            <MenuItem value="event_manager">Руководитель мероприятий</MenuItem>
                            <MenuItem value="expert">Эксперт</MenuItem>
                            <MenuItem value="user">Участник мероприятий</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={onClose} // Кнопка "Отмена"
                        >
                            Отмена
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleUpdateRole} 
                            disabled={!selectedRole} // Кнопка "Обновить" недоступна, если роль не выбрана
                        >
                            Обновить роль
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default RoleModal;
