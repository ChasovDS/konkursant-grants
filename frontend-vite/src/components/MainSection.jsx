// src/components/MainSection.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainSection = () => {
  return (
    <div className="container mt-4 p-4 bg-white text-center rounded">
      <h4 className="mb-3" style={{ color: '#195783', fontFamily: 'Nunito, sans-serif' }}>
        Добро пожаловать на портал грантов
      </h4>
      <p style={{ color: '#333', fontFamily: 'Nunito, sans-serif' }}>
        Портал Санкт-Петербургского регионального отделения МООО «Российские студенческие отряды»
        для работы с грантовыми проектами в рамках грантовых мероприятий проводимых Росмолодеж. Гранты.
      </p>
    </div>
  );
};

export default MainSection;
