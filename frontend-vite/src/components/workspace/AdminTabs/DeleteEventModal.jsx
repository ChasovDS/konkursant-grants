// src\components\workspace\AdminTabs\DeleteEventModal.jsx

import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';

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
  textAlign: 'center',
};

// Стили для кнопок
const ConfirmButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: '#fff',
  borderRadius: 4,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const DeleteEventModal = ({ open, onClose, onConfirm, eventName }) => {
  const [inputValue, setInputValue] = useState('');
  const isMatch = inputValue === eventName;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={ModalStyle}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <WarningIcon color="error" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h6">Подтверждение удаления</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Чтобы удалить мероприятие, введите его название:
        </Typography>
        <Typography variant="body1" color="textPrimary" gutterBottom>
          <strong>{eventName}</strong>
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Введите название мероприятия"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{ marginTop: 2, borderRadius: 4 }}
          error={inputValue && !isMatch}
          helperText={inputValue && !isMatch ? 'Название мероприятия не совпадает' : ''}
        />
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button onClick={onClose} color="primary" sx={{ borderRadius: 4 }}>
            Отмена
          </Button>
          <ConfirmButton onClick={onConfirm} disabled={!isMatch}>
            Удалить мероприятие
          </ConfirmButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteEventModal;