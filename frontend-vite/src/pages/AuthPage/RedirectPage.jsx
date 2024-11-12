import { useEffect, useCallback } from 'react';
import { exchangeTokenForUserInfo } from '../../api/Auth_API';


const RedirectPage = () => {

  const processToken = useCallback(async (token) => {
    try {
      const response = await exchangeTokenForUserInfo(token);
      console.log('Ответ сервера:', response);

      if (window.opener) {
        window.opener.location.href = '/workspace';
        window.close();
      }
    } catch (error) {
      console.error(error.message);
      if (window.opener) {
        window.opener.location.href = '/auth_bek';
        window.close();
      }
    }
  });

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
        processToken(token);
      } else {
        console.error('Токен не найден в URL.');
        if (window.opener) {
          window.opener.location.href = '/auth_url';
          window.close();
        }
      }
    };

    script.onerror = () => {
      console.error("Ошибка загрузки скрипта для обработки токена");
      if (window.opener) {
        window.opener.location.href = '/auth_token';
        window.close();
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [processToken]);

  return <div>Обработка токена...</div>;
};

export default RedirectPage;
