import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [isButtonInitialized, setIsButtonInitialized] = useState(false);

  useEffect(() => {
    console.log('Login компонент смонтирован.');

    const scriptId = 'yandex-sdk-suggest';
    const buttonId = 'yandex-button';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js";
      script.async = true;
      script.id = scriptId;
      document.head.appendChild(script);

      script.onload = () => {
        console.log('Yandex SDK скрипт загружен успешно.');

        const buttonContainer = document.getElementById(buttonId);
        if (buttonContainer && !buttonContainer.firstChild && !isButtonInitialized) {
          window.YaAuthSuggest.init({
            client_id: '4a4dd7433ce04ea0a2be5e5b825c9ee5',
            response_type: 'token',
            redirect_uri: 'http://localhost:3000/redirect-page'
          }, 
          'http://localhost:3000', {
            view: 'button',
            parentId: buttonId,
            buttonView: 'main',
            buttonTheme: 'light',
            buttonSize: 'm',
            buttonBorderRadius: "22",
          }).then(function(result) {
            return result.handler();
          }).then(function(data) {
            console.log('Сообщение с токеном: ', data);
            Cookies.set('auth_token', data.token, { secure: true, sameSite: 'Strict', expires: 7 });
            navigate('/workspace');
          }).catch(function(error) {
            console.error('Что-то пошло не так: ', error);
            setError('Ошибка аутентификации, попробуйте еще раз.');
          });
          setIsButtonInitialized(true); // Устанавливаем флаг инициализации кнопки
        } else {
          console.log('Кнопка уже инициализирована или контейнер не найден.');
        }
      };

      script.onerror = () => {
        console.error('Ошибка загрузки Yandex SDK скрипта.');
        setError('Не удалось загрузить SDK. Попробуйте позже.');
      };
    } else {
      console.log('Yandex SDK скрипт уже загружен.');
    }

    const handleMessage = (event) => {
      if (event.origin !== window.origin) return;

      if (event.data.type === 'yandex-auth') {
        console.log('Получен токен от дополнительного окна:', event.data.token);
        Cookies.set('auth_token', event.data.token, { secure: true, sameSite: 'Strict', expires: 7 });
        navigate('/dashboard/workspace');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      console.log('Login компонент размонтирован.');
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }

      const buttonContainer = document.getElementById(buttonId);
      if (buttonContainer) {
        buttonContainer.innerHTML = ''; // Очистка контейнера кнопки
      }

      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, isButtonInitialized]); // Добавляем isButtonInitialized в зависимости


  
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 6, borderRadius: 3, marginTop: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Вход в приложение Конкурсант.Гранты
          </Typography>
          <Typography variant="body1" gutterBottom>
            Авторизуйтесь через Яндекс для продолжения
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box id="yandex-button" sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
            {loading && <CircularProgress />}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;

