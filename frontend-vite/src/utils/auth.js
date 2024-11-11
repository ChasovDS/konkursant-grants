import axios from 'axios';

export const exchangeTokenForUserInfo = async (token, apiUrl) => {
    try {
        const response = await axios.post(`${apiUrl}/auth/yandex`, { token }, { withCredentials: true }); // Убедитесь, что куки передаются
        return response.data; // Возвращаем данные, включая сообщение о состоянии
    } catch (err) {
        console.error('Ошибка обмена токена:', err.response ? err.response.data : err.message);
        throw new Error('Ошибка аутентификации');
    }
};

export const handleIncomingMessage = (event) => {
    if (event.origin !== window.origin) return;
};
