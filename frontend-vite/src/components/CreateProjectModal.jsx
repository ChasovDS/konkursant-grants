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
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { UploadFile, Description } from '@mui/icons-material'; // Импортируем иконку AttachFile
import { useDropzone } from 'react-dropzone';

// Стили для кастомной кнопки
const CustomButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  marginBottom: '8px',
  justifyContent: 'center',
  width: '100%',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
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
  borderRadius: 2,
};

const CreateProjectModal = ({ open, handleClose, onProjectCreated }) => {
  const [file, setFile] = useState(null);
  const [isEmptyProject, setIsEmptyProject] = useState(true);
  const [templateType, setTemplateType] = useState('ФИЗ_ЛИЦО');

  // Обработчик перетаскивания файлов
  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.doc,.docx',
    maxFiles: 1,
  });

  // Обработчик создания проекта
  const handleCreateProject = async () => {
    const jwtToken = Cookies.get('auth_token');
    const endpoint = isEmptyProject
      ? `http://127.0.0.1:8000/api/v1/projects/create-empty?project_template=${encodeURIComponent(templateType)}`
      : `http://127.0.0.1:8000/api/v1/projects/create-from-file?project_template=${encodeURIComponent(templateType)}`;

    const formData = new FormData();
    if (!isEmptyProject && file) {
      formData.append('input_file', file);
    }

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Уведомление о создании проекта
      if (typeof onProjectCreated === 'function') {
        onProjectCreated(); // Вызов функции обновления списка проектов
      }
      handleClose(); // Закрытие модального окна
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      alert('Ошибка при создании проекта: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
    }
  };

  // Функция для сброса состояния формы
  const resetForm = () => {
    setFile(null);
    setIsEmptyProject(true);
    setTemplateType('ФИЗ_ЛИЦО'); // или любое другое значение по умолчанию
  };

  // Обработчик закрытия модального окна
  const handleModalClose = () => {
    resetForm(); // Сброс состояния формы
    handleClose(); // Закрытие модального окна
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Добавление нового проекта
        </Typography>

        <ToggleButtonGroup
          value={isEmptyProject ? 'empty' : 'file'}
          exclusive
          onChange={(event, newValue) => {
            setIsEmptyProject(newValue === 'empty');
            if (newValue === 'empty') {
              setFile(null); // Сброс файла при выборе пустого проекта
            } else {
              setTemplateType(''); // Сброс типа шаблона при выборе файла
            }
          }}
          fullWidth
          style={{ marginBottom: 16 }}
        >
          <ToggleButton value="empty" aria-label="empty project">
            <Description />
            Пустой проект
          </ToggleButton>
          <ToggleButton value="file" aria-label="file project">
            <UploadFile />
            Проект из файла
          </ToggleButton>
        </ToggleButtonGroup>

        {!isEmptyProject && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="template-type-label">Тип шаблона</InputLabel>
              <Select
                labelId="template-type-label"
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                required
              >
                <MenuItem value="ФИЗ_ЛИЦО">ФИЗ_ЛИЦО</MenuItem>
                {/* Добавьте другие типы шаблонов, если необходимо */}
              </Select>
            </FormControl>
            <div
              {...getRootProps({ className: 'dropzone' })}
              style={{
                border: '2px dashed #ccc',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                transition: 'border 0.3s ease',
              }}
            >
              <input {...getInputProps()} />
              {file ? <p>{file.name}</p> : <p>Перетащите файл сюда или нажмите для выбора</p>}
              <UploadFile style={{ fontSize: 40, marginTop: 10 }} /> {/* Иконка загрузки файла */}
            </div>
          </>
        )}

        {isEmptyProject && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="template-type-label">Тип шаблона</InputLabel>
            <Select
              labelId="template-type-label"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              required
            >
              <MenuItem value="ФИЗ_ЛИЦО">ФИЗ_ЛИЦО</MenuItem>
              {/* Добавьте другие типы шаблонов, если необходимо */}
            </Select>
          </FormControl>
        )}

        <CustomButton
          variant="contained"
          color="primary"
          onClick={handleCreateProject}
          disabled={isEmptyProject ? !templateType : !file || !templateType}
          style={{ marginTop: 16 }}
        >
          Добавить проект
        </CustomButton>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;
