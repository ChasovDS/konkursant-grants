// src/pages/Home.jsx
//import React from 'react';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import { Container } from '@mui/material';

const Home = () => (
  <>
    <Header />
    <Container>
      <MainSection />
    </Container>
  </>
);

export default Home;

