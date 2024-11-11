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
import { updateAdditionalFiles } from '../../../../api/Project_API';

const AdditionalFilesTab = ({ projectId, jwtToken, data, refreshData }) => {
  const [files, setFiles] = useState(data || []);
  const [newFile, setNewFile] = useState({ file_description: '', file_url: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAddOrEditFile = () => {
    if (editIndex !== null) {
      const updatedFiles = files.map((file, index) =>
        index === editIndex ? { ...newFile, files_id: file.files_id } : file
      );
      setFiles(updatedFiles);
      setEditIndex(null);
    } else {
      setFiles([...files, { ...newFile, files_id: Date.now().toString() }]);
    }
    setNewFile({ file_description: '', file_url: '' });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEditFile = (index) => {
    setEditIndex(index);
    setNewFile(files[index]);
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleSaveFiles = async () => {
    try {
      await updateAdditionalFiles(projectId, files);
      setOpenSnackbar(true);
      refreshData();
    } catch (error) {
      console.error('Ошибка при сохранении файлов:', error);
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