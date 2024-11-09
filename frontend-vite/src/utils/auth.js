// src/utils/auth.js
import axios from 'axios';
import Cookies from 'js-cookie';

export const exchangeTokenForUserInfo = async (token, apiUrl) => {
    try {
        const response = await axios.post(`${apiUrl}/v1/auth/yandex`, { token });
        const { token: jwtToken, role: roleToken } = response.data;

        // Устанавливаем куки
        Cookies.set('auth_token', jwtToken, { secure: true, sameSite: 'Strict', expires: 7 });
        Cookies.set('role_token', roleToken, { secure: true, sameSite: 'Strict', expires: 7 });

        return { jwtToken, roleToken };
    } catch (err) {
        console.error('Ошибка обмена токена:', err.response ? err.response.data : err.message);
        throw new Error('Ошибка аутентификации');
    }
};

export const handleIncomingMessage = (event) => {
    if (event.origin !== window.origin) return;

    if (event.data.type === 'yandex-auth') {
        Cookies.set('auth_token', event.data.token, { secure: true, sameSite: 'Strict', expires: 7 });
    }

    if (event.data.type === 'role_token') {
        Cookies.set('role_token', event.data.token, { secure: true, sameSite: 'Strict', expires: 7 });
    }
};
