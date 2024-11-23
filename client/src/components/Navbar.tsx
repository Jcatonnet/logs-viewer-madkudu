import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const AppNavbar: React.FC = () => {
    const { isAuthenticated, login, logout } = useAuth();

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Navbar.Brand href="#">Log Viewer</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {isAuthenticated ? (
                        <Button variant="outline-light" onClick={logout}>
                            Log Out
                        </Button>
                    ) : (
                        <Button variant="outline-light" onClick={login}>
                            Log In
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
