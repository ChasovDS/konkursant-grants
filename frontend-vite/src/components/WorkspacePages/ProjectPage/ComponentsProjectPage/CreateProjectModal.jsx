// src/components/CreateProjectModal.jsx

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { UploadFile, Description } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { createEmptyProject, createProjectFromFile } from '../../../../api/Project_API';

// Стили для кастомной кнопки
const CustomButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  width: '100%',
  padding: '12px 0',
  fontSize: '1rem',
  borderRadius: 4,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabled,
  },
}));

// Стили для модального окна
const style = {
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

const CreateProjectModal = ({ open, handleClose, onProjectCreated }) => {
  const [file, setFile] = useState(null);
  const [isEmptyProject, setIsEmptyProject] = useState(false);
  const [templateType, setTemplateType] = useState('ФИЗ_ЛИЦО');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Обработчик перетаскивания файлов
  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.doc,.docx',
    maxFiles: 1,
  });

  // Обработчик создания проекта
  const handleCreateProject = async () => {
    setLoading(true);
    setError('');
    try {
      if (isEmptyProject) {
        await createEmptyProject(templateType);
      } else if (file) {
        await createProjectFromFile(file, templateType);
      }
      onProjectCreated(); // Обновление списка проектов
      handleClose(); // Закрытие модального окна
    } catch (error) {
      setError(error.response?.data?.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Функция для сброса состояния формы
  const resetForm = () => {
    setFile(null);
    setIsEmptyProject(false);
    setTemplateType('ФИЗ_ЛИЦО');
  };

  // Обработчик закрытия модального окна
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom align="center">
          Добавление нового проекта
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <ToggleButtonGroup
          value={isEmptyProject ? 'empty' : 'file'}
          exclusive
          onChange={(event, newValue) => {
            setIsEmptyProject(newValue === 'empty');
            if (newValue === 'empty') setFile(null);
          }}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value="empty" aria-label="empty project" disabled>
            <Description />
            Пустой проект
          </ToggleButton>
          <ToggleButton value="file" aria-label="file project">
            <UploadFile />
            Проект из файла
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl fullWidth margin="normal">
          <InputLabel id="template-type-label">Тип шаблона</InputLabel>
          <Select
            labelId="template-type-label"
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
          >
            <MenuItem value="ФИЗ_ЛИЦО">ФИЗ_ЛИЦО</MenuItem>
            {/* Дополнительные шаблоны */}
          </Select>
        </FormControl>

        {!isEmptyProject && (
          <div
            {...getRootProps()}
            style={{
              border: isDragActive ? '2px solid #1976d2' : '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '4px',
              backgroundColor: isDragActive ? '#e3f2fd' : '#f9f9f9',
              transition: 'border 0.3s ease',
            }}
          >
            <input {...getInputProps()} />
            {file ? <p>{file.name}</p> : <p>Перетащите файл сюда или нажмите для выбора</p>}
            <UploadFile style={{ fontSize: 40, marginTop: 10 }} />
          </div>
        )}

        <CustomButton
          variant="contained"
          onClick={handleCreateProject}
          disabled={loading || (isEmptyProject ? !templateType : !file || !templateType)}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Добавить проект'}
        </CustomButton>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;