import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CreateQuotePage = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !image) {
      alert('Please provide both text and an image.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);
      
      const mediaResponse = await axios.post('https://crafto.app/crafto/v1.0/media/assignment/upload', formData);
      const mediaUrl = mediaResponse?.data?.[0]?.url;

      const token = localStorage.getItem('token');
      await axios.post('https://assignment.stage.crafto.app/postQuote', {
        text,
        mediaUrl
      }, {
        headers: { Authorization: token }
      });

      navigate('/quotes');
    } catch (error) {
      alert('Failed to create quote');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Create a New Quote</Title>

        <Input 
          type="text" 
          placeholder="Enter your quote here..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          required 
        />

        <FileInputContainer>
          <FileLabel htmlFor="file-upload">Upload Image</FileLabel>
          <FileInput 
            id="file-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            required 
          />
        </FileInputContainer>

        {imagePreview && <ImagePreview src={imagePreview} alt="Selected" />}

        <SubmitButton 
          type="submit" 
          disabled={isLoading || !text || !image}
        >
          {isLoading ? 'Uploading...' : 'Create Quote'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateQuotePage;

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f7;  /* Soft background color for the entire page */
  padding: 20px;  /* Added padding for small screens */
`;

const Form = styled.form`
  background-color: #ffffff;  /* White background for the form */
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* Responsive Design */
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 30px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 20px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
  }

  /* Responsive Input */
  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileLabel = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
`;

const FileInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: #4a90e2;
  }

  /* Responsive File Input */
  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  margin-top: 15px;
  border-radius: 8px;

  /* Responsive Image Preview */
  @media (max-width: 768px) {
    max-height: 200px;
  }

  @media (max-width: 480px) {
    max-height: 150px;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ab7;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  /* Responsive Submit Button */
  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
