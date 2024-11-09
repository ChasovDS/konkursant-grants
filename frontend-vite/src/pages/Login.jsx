// src/pages/Login.jsx
import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { handleIncomingMessage } from '../utils/auth';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isButtonInitialized, setIsButtonInitialized] = useState(false);

    useEffect(() => {
        const scriptId = 'yandex-sdk-suggest';
        const buttonId = 'yandex-button';

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js";
            script.async = true;
            script.id = scriptId;
            document.head.appendChild(script);

            script.onload = () => {
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
                    }).then(result => result.handler())
                    .then(data => {
                        console.log('Сообщение с токеном: ', data);
                    }).catch(error => {
                        console.error('Что-то пошло не так: ', error);
                        setError('Ошибка аутентификации, попробуйте еще раз.');
                    });
                    setIsButtonInitialized(true);
                }
            };

            script.onerror = () => {
                console.error('Ошибка загрузки Yandex SDK скрипта.');
                setError('Не удалось загрузить SDK. Попробуйте позже.');
            };
        }

        window.addEventListener('message', handleIncomingMessage);

        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                document.head.removeChild(existingScript);
            }

            const buttonContainer = document.getElementById(buttonId);
            if (buttonContainer) {
                buttonContainer.innerHTML = '';
            }

            window.removeEventListener('message', handleIncomingMessage);
        };
    }, [navigate, isButtonInitialized]);

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
