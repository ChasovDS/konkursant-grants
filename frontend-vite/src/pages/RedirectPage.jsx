// src/pages/RedirectPage.jsx
import { useEffect, useCallback } from 'react';
import { exchangeTokenForUserInfo } from '../utils/auth';

const RedirectPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const processToken = useCallback(async (token) => {
        try {
            await exchangeTokenForUserInfo(token, apiUrl);
            // Перенаправляем основное окно на рабочее пространство
            if (window.opener) {
                window.opener.location.href = '/dashboard/workspace'; // Открытие в основном окне
                window.close(); // Закрытие всплывающего окна
            }
        } catch (error) {
            console.error(error.message);
            if (window.opener) {
                window.opener.location.href = '/auth'; // Перенаправление на страницу аутентификации
                window.close(); // Закрытие всплывающего окна
            }
        }
    }, [apiUrl]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const token = hashParams.get('access_token');

            // Проверка наличия токена
            if (token) {
                console.log('Токен найден:', token);
                processToken(token);
            } else {
                console.error('Токен не найден в URL.');
                if (window.opener) {
                    window.opener.location.href = '/auth'; // Перенаправление на страницу аутентификации
                    window.close(); // Закрытие всплывающего окна
                }
            }
        };

        script.onerror = () => {
            console.error("Ошибка загрузки скрипта для обработки токена");
            if (window.opener) {
                window.opener.location.href = '/auth'; // Перенаправление на страницу аутентификации
                window.close(); // Закрытие всплывающего окна
            }
        };

        return () => {
            document.head.removeChild(script); // Удаляем скрипт при размонтировании компонента
        };
    }, [processToken]);

    return <div>Обработка токена...</div>; // Сообщение о загрузке
};

export default RedirectPage;
