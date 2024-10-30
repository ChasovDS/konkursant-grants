// src/components/ViewDetailsProject/tabs/AdditionalFilesTab.jsx

import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Link } from '@mui/material';

const AdditionalFilesTab = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>Нет дополнительных файлов.</Typography>;
  }

  return (
    <div>
      <List>
        {data.map((file) => (
          <div key={file.files_id}>
            <ListItem>
              <ListItemText
                primary={file.file_description}
                secondary={
                  file.file_url ? (
                    <Link href={file.file_url} target="_blank" rel="noopener">
                      Скачать файл
                    </Link>
                  ) : (
                    'Ссылка на файл отсутствует.'
                  )
                }
              />
            </ListItem>
            <Divider component="li" />
          </div>
        ))}
      </List>
    </div>
  );
};

export default AdditionalFilesTab;
