import React, { useState } from "react";
import {
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Container,
  Grid,
  Box,
  FormControl,
  Chip,
  FormHelperText,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import "react-quill/dist/quill.snow.css";
import UserSelect from "./UserSelect";
import { Autocomplete } from "@mui/material";

const EventForm = ({ title, onSaveDraft, onPublish }) => {
  const [tags, setTags] = useState([]);
  const [logo, setLogo] = useState(null);
  const [logoBASE, setLogoBASE] = useState(null);
  const [experts, setExperts] = useState([]);
  const [managers, setManagers] = useState([]);

  const [eventData, setEventData] = useState({
    organizer: "",
    participantType: "",
    resources: "",
    title: "",
    type: "",
    description: "",
    format: "",
    status: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const prepareEventData = () => ({
    ...eventData,
    tags,
    managers,
    experts,
    logoBASE,
  });

  const [errors, setErrors] = useState({});
  const tagsOptions = ["РосмолодёжьГранты", "Помощь", "РСО", "ГРАНТ_ME"];

  // Константы типов участников (на русском языке)
  const ParticipantType = {
    ALL: "Все желающие",
    MEMBERS: "Только отрядники",
  };

  // Константы статусов мероприятия
  const EventStatus = {
    COMPLETED: "Проведено",
    IN_PROGRESS: "Проводится",
    SCHEDULED: "Запланировано",
    CANCELED: "Отменено",
  };

  // Константы типов мероприятий (на русском языке)
  const EventType = {
    CONFERENCE: "Конференция",
    TRAINING: "Тренинг",
    GRANT_EVENT: "Грантовое мероприятие",
  };

  // Константы форматов мероприятия (на русском языке)
  const EventFormat = {
    ONLINE: "Онлайн",
    OFFLINE: "Офлайн",
    MIXED: "Смешанный",
  };

  // Опции статусов для селектора
  const ParticipantOptions = Object.entries(ParticipantType).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );

  // Опции статусов для селектора
  const statusOptions = Object.entries(EventStatus).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  // Опции типов мероприятий
  const eventTypeOptions = Object.entries(EventType).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  // Опции форматов мероприятий
  const eventFormatOptions = Object.entries(EventFormat).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );

  // Обработчик изменения тегов
  const handleTagChange = (event, newValue) => {
    setTags(newValue);
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" || file.type === "image/png") &&
      file.size <= 5 * 1024 * 1024
    ) {
      setLogo(file);
      const compressedImage = await compressImage(file);
      setLogoBASE(compressedImage);
    } else {
      alert("Файл должен быть формата .jpg или .png и размером не более 5 МБ");
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            if (blob.size <= 500 * 1024) {
              resolve(dataUrl);
            } else {
              reject(new Error("Изображение слишком большое после сжатия"));
            }
          });
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!eventData.organizer)
      newErrors.organizer = "Организация организатор обязательна";
    if (!eventData.title) newErrors.title = "Название мероприятия обязательно";
    if (!eventData.location)
      newErrors.location = "Место проведения обязательно";
    if (!logoBASE) newErrors.logo = "Логотип обязателен";
    if (!eventData.participantType)
      newErrors.participantType = "Тип участников обязателен";
    if (!eventData.type) newErrors.type = "Тип мероприятия обязателен";
    if (!eventData.description)
      newErrors.description = "Описание мероприятия обязательно";
    if (!eventData.resources)
      newErrors.resources = "Информационные ресурсы обязательны";
    if (!eventData.format) newErrors.format = "Формат мероприятия обязателен";
    if (!eventData.status) newErrors.status = "Статус мероприятия обязателен";
    if (!eventData.startDate) newErrors.startDate = "Дата начала обязательна";
    if (!eventData.startTime) newErrors.startTime = "Время начала обязательно";
    if (!eventData.endDate) newErrors.endDate = "Дата окончания обязательна";
    if (!eventData.endTime) newErrors.endTime = "Время окончания обязательно";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action) => {
    if (validateForm()) {
      const data = prepareEventData();
      if (action === "BLACKWELL") {
        onSaveDraft(data);
      } else if (action === "READY_EVENT") {
        onPublish(data);
      }
    }
  };

  return (
    <Container>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="/workspace/events" underline="hover">
          Мероприятия
        </Link>
        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Детали мероприятия
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 150,
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              {logo ? (
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Логотип мероприятия"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              ) : (
                <>
                  <ImageIcon fontSize="large" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Нет изображения
                  </Typography>
                </>
              )}
            </Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Загрузить изображение
              <input type="file" hidden onChange={handleLogoUpload} />
            </Button>
            {errors.logo && (
              <Typography color="error">{errors.logo}</Typography>
            )}
            <TextField
              fullWidth
              label="Организация организатор"
              variant="outlined"
              margin="normal"
              name="organizer"
              value={eventData.organizer}
              onChange={handleInputChange}
              error={!!errors.organizer}
              helperText={errors.organizer}
              InputProps={{ startAdornment: <Person /> }}
              sx={{ mt: 5.6 }}
            />
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.participantType}
            >
              <InputLabel id="participant-select-label">
                Кто может принимать участие
              </InputLabel>
              <Select
                labelId="participant-select-label"
                name="participantType"
                value={eventData.participantType}
                onChange={handleInputChange}
                label="Кто может принимать участие"
              >
                {ParticipantOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.participantType && (
                <Typography color="error">{errors.participantType}</Typography>
              )}
            </FormControl>
            <TextField
              fullWidth
              label="Информационные ресурсы"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              name="resources"
              value={eventData.resources}
              error={!!errors.resources}
              helperText={errors.resources}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={8} sx={{ my: 3 }}>
            <TextField
              fullWidth
              label="Название мероприятия"
              variant="outlined"
              margin="normal"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              inputProps={{ maxLength: 100 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal" error={!!errors.type}>
                  <InputLabel id="type-select-label">
                    Тип мероприятия
                  </InputLabel>
                  <Select
                    labelId="type-select-label"
                    name="type"
                    value={eventData.type}
                    onChange={handleInputChange}
                    label="Тип мероприятия"
                  >
                    {eventTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && (
                    <Typography color="error">{errors.type}</Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal" error={!!errors.format}>
                  <InputLabel id="format-select-label">Формат</InputLabel>
                  <Select
                    labelId="format-select-label"
                    name="format"
                    value={eventData.format}
                    onChange={handleInputChange}
                    label="Формат"
                  >
                    {eventFormatOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.format && (
                    <Typography color="error">{errors.format}</Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal" error={!!errors.status}>
                  <InputLabel id="status-select-label">
                    Статус мероприятия
                  </InputLabel>
                  <Select
                    labelId="status-select-label"
                    name="status"
                    value={eventData.status}
                    onChange={handleInputChange}
                    label="Статус мероприятия"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <Typography color="error">{errors.status}</Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Место проведения"
              variant="outlined"
              margin="normal"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              error={!!errors.location}
              helperText={errors.location}
              inputProps={{ maxLength: 150 }}
            />
            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Дата начала"
                  type="date"
                  name="startDate"
                  value={eventData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Время начала"
                  type="time"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Дата окончания"
                  type="date"
                  name="endDate"
                  value={eventData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Время окончания"
                  type="time"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endTime}
                  helperText={errors.endTime}
                />
              </Grid>
            </Grid>

            <UserSelect
              role="event_manager"
              selectedUsers={managers}
              setSelectedUsers={setManagers}
            />
            <UserSelect
              role="expert"
              selectedUsers={experts}
              setSelectedUsers={setExperts}
            />

            <Autocomplete
              multiple
              id="tags-outlined"
              options={tagsOptions}
              value={tags}
              onChange={handleTagChange}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  {...params}
                  label="Теги"
                  placeholder="Выберите теги"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Описание мероприятия
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              rows={6}
              name="description"
              inputProps={{ maxLength: 550 }}
              value={eventData.description}
              error={!!errors.description}
              helperText={
                errors.description || `${eventData.description.length}/550`
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleSubmit("BLACKWELL")}
                      disabled
                    >
                      Сохранить как черновик
                    </Button>
                    <FormHelperText style={{ marginTop: "8px" }}>
                    В данный момент функция сохранения черновика  мероприятия недоступна
                    </FormHelperText>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => handleSubmit("READY_EVENT")}
                  >
                    Опубликовать мероприятие
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EventForm;
