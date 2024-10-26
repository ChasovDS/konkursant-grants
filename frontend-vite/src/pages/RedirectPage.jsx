import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';



const RedirectPage = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const hasProcessedToken = useRef(false);

  const exchangeTokenForUserInfo = useCallback(async (token) => {
    if (hasProcessedToken.current) {
      console.warn('Токен уже был обработан.');
      return;
    }
    hasProcessedToken.current = true;

    try {
      const response = await axios.post(`${apiUrl}/v1/auth/yandex`, { token });
      const jwtToken = response.data.token;
      console.log('JWT Токен:', jwtToken);
      
      // Передача токена в основное окно
      if (window.opener) {
        window.opener.postMessage({ type: 'yandex-auth', token: jwtToken }, window.origin);
        window.close(); // Закрываем дополнительное окно после передачи
      } else {
        // Если окно не было открыто как всплывающее, просто устанавливаем куки и перенаправляем
        Cookies.set('auth_token', jwtToken, { secure: true, sameSite: 'Strict', expires: 7 });
        navigate('/dashboard/workspace');
      }
    } catch (err) {
      console.error('Ошибка обмена токена:', err.response ? err.response.data : err.message);
      navigate('/auth');
    }
  },[navigate, apiUrl]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js";
    script.async = true;
    document.head.appendChild(script);
  
    script.onload = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const token = hashParams.get('access_token');
      if (token) {
        console.log('Токен найден:', token);
        exchangeTokenForUserInfo(token);
      } else {
        console.error('Токен не найден в URL.');
        navigate('/auth');
      }
    };
  
    script.onerror = () => {
      console.error("Ошибка загрузки скрипта для обработки токена");
      navigate('/auth');
    };
  
    return () => {
      document.head.removeChild(script);
    };
  }, [exchangeTokenForUserInfo, navigate]);
  
  return <div>Обработка токена...</div>;
};

export default RedirectPage;
