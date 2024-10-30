// src/components/ViewDetailsProject/tabs/MediaTab.jsx

import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Card,
  CardContent,
} from '@mui/material';
import { Info } from '@mui/icons-material'; // Импортируем иконку информации

const MediaTab = ({ data }) => {
  // Проверяем, есть ли данные
  if (!data || data.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary">
        Данные отсутствуют.
      </Typography>
    );
  }

  return (
    <div style={{ borderRadius: '8px' }}>
      <List>
        {data.map((media, index) => (
          <div key={media.media_resource_id}>
            <Card variant="outlined" style={{ marginBottom: '16px' }}>
              <CardContent>
                <ListItem alignItems="flex-start" style={{ padding: '16px' }}>
                  <ListItemIcon>
                    <Info color="primary" /> {/* Иконка информации */}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        #{index + 1} Тип ресурса: {media.resource_type}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">
                          Публикационный месяц: {media.publication_month}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          Планируемые просмотры: {media.planned_views}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                          Ссылки на ресурсы:
                        </Typography>
                        <Typography variant="body2">
                          {media.resource_links}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                          Почему выбран такой формат медиа:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {media.reason_for_format}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </CardContent>
            </Card>
          </div>
        ))}
      </List>
    </div>
  );
};

export default MediaTab;
