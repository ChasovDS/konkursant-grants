// src/components/Header.jsx
import React from 'react';
import { Navbar, Container, Nav, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => (
  <>
    <Alert variant="warning" className="text-center mb-0">
      Внимание: Сайт находится в разработке!
    </Alert>
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: '#195783' }}>
          Конкурсант. Гранты
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/login" className="text-primary">
            Войти
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  </>
);

export default Header;
