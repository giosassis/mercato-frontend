import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { FaUser, FaLock } from "react-icons/fa";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  document.body.style.backgroundColor = "#f1f5fb";
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(username, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/dashboard"); 
    } catch (err) {
      console.log(err)
      setError("usuário ou senha inválidos");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow" style={{ width: "400px", padding: "20px" }}>
        <h3 className="text-center fw-bold">log in</h3>
        <p className="fw-light text-center text-muted">insira suas credenciais para logar no sistema</p>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 text-muted fw-light" controlId="username">
            <Form.Label><FaUser /> usuário </Form.Label>
            <Form.Control 
              className="mb-3 text-muted fw-light" 
              type="text" 
              placeholder="usuario_de_registro" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 text-muted fw-light" controlId="password">
            <Form.Label><FaLock /> senha </Form.Label>
            <Form.Control 
              className="mb-3 text-muted fw-light" 
              type="password" 
              placeholder="senha_de_registro" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" className="w-100" type="submit">
            entrar
          </Button>
        </Form>
        
        <div className="text-center mt-3">
          <Button variant="outline-secondary" className="me-2">sou gestor</Button>
          <Button variant="outline-secondary">sou caixa</Button>
        </div>
      </Card>
    </Container>
  );
};

export default LoginPage;
