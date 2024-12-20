import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://assignment.stage.crafto.app/login', { username, otp });
      console.log('response', response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate('/quotes');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <Input 
            type="text" 
            placeholder="OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required 
          />
          <SubmitButton type="submit">Login</SubmitButton>
        </Form>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
  padding: 0 20px;

  /* Ensure the container works well on smaller screens */
  @media (max-width: 768px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const LoginCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;

  /* Ensure the card is responsive */
  @media (max-width: 768px) {
    max-width: 350px;
    padding: 25px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;

  /* Responsive Title */
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border 0.3s ease;

  &:focus {
    border: 1px solid #0066cc;
  }

  &::placeholder {
    color: #888;
  }

  /* Responsive Input */
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #0066cc;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005bb5;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  /* Responsive Submit Button */
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;
