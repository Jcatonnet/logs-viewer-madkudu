import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NavBar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Log Viewer
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isAuthenticated && (
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/dashboard">
                                Dashboard
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/graphs">
                                Graphs
                            </Nav.Link>
                        </Nav>
                    )}
                    <Nav className="ms-auto">
                        {isAuthenticated && (
                            <Button variant="outline-light" onClick={logout}>
                                Log Out
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
