// src/components/ViewDetailsProject/tabs/AdditionalFilesTabKG.jsx

import React, { useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Button,
  TextField,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const AdditionalFilesTab = ({ projectId, jwtToken, data, refreshData }) => {
  const [files, setFiles] = useState(data || []); // Инициализация состояния файлов
  const [newFile, setNewFile] = useState({ file_description: '', file_url: '' }); // Новые файлы
  const [editIndex, setEditIndex] = useState(null); // Индекс редактируемого файла
  const [openSnackbar, setOpenSnackbar] = useState(false); // Состояние Snackbar

  // Обработчик добавления или редактирования файла
  const handleAddOrEditFile = () => {
    if (editIndex !== null) {
      // Если редактируем файл
      const updatedFiles = files.map((file, index) =>
        index === editIndex ? { ...newFile, files_id: file.files_id } : file
      );
      setFiles(updatedFiles);
      setEditIndex(null);
    } else {
      // Добавление нового файла
      setFiles([...files, { ...newFile, files_id: Date.now().toString() }]);
    }
    setNewFile({ file_description: '', file_url: '' }); // Сброс формы
  };

  // Обработчик закрытия Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Обработчик редактирования файла
  const handleEditFile = (index) => {
    setEditIndex(index);
    setNewFile(files[index]); // Заполнение формы данными файла
  };

  // Обработчик удаления файла
  const handleDeleteFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  // Обработчик сохранения файлов
  const handleSaveFiles = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/additional-files`, {
        additional_files: files,
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setOpenSnackbar(true); // Открытие Snackbar
      refreshData(); // Обновляем данные проекта
    } catch (error) {
      console.error('Ошибка при сохранении файлов:', error);
      // Можно добавить обработку ошибки, например, уведомление пользователя
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        <p>Рекомендации: Наилучшим решением будет поместить все дополнительные файлы в одну папку на Яндекс.Диске и указать ссылку в данной вкладке.</p>
        (При внесении данных сохраняйте изменения.)
      </Typography>
      <List>
        {files.map((file, index) => (
          <div key={file.files_id}>
            <ListItem>
              <ListItemText
                primary={file.file_description}
                secondary={
                  file.file_url ? (
                    <Link href={file.file_url} target="_blank" rel="noopener">
                      {file.file_url}
                    </Link>
                  ) : (
                    'Ссылка на файл отсутствует.'
                  )
                }
              />
              <IconButton onClick={() => handleEditFile(index)} aria-label="edit">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteFile(index)} aria-label="delete">
                <Delete />
              </IconButton>
            </ListItem>
            <Divider component="li" />
          </div>
        ))}
      </List>
      <TextField
        label="Описание файла"
        value={newFile.file_description}
        onChange={(e) => setNewFile({ ...newFile, file_description: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ссылка на файл"
        value={newFile.file_url}
        onChange={(e) => setNewFile({ ...newFile, file_url: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Box display="flex" justifyContent="flex-end" marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOrEditFile}
          style={{ marginRight: '10px' }}
        >
          {editIndex !== null ? 'Сохранить изменения' : 'Добавить файл'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSaveFiles}
        >
          Сохранить 
        </Button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={1500}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            Дополнительные файлы обновлены!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AdditionalFilesTab;
