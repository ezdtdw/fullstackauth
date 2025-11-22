import React, { useContext } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return(
        <BSNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                <BSNavbar.Brand as={Link} to="/">React Auth</BSNavbar.Brand>
                <BSNavbar.Toggle aria-controls="basic-navbar-nav">
                </BSNavbar.Toggle>
                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user? (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/items">Items</Nav.Link>
                                <Nav.Link as={Link} to="/posts">Posts</Nav.Link>
                                <Nav.Link className="text-light">Halo, {user.username}</Nav.Link>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;