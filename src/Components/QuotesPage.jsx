import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Fetch Quotes Function
  const fetchQuotes = async () => {
    if (!hasMore || isLoading) return; // Don't fetch if already loading or no more data
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please log in again.');
        navigate('/login');
        return;
      }
      const response = await axios.get(`https://assignment.stage.crafto.app/getQuotes?limit=20&offset=${offset}`, {
        headers: { Authorization: token }
      });

      if (response?.data?.data?.length === 0) setHasMore(false);

      setQuotes(prev => [...prev, ...response?.data?.data || []]);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      alert('Failed to fetch quotes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetchQuotes when the offset changes
  useEffect(() => {
    fetchQuotes();
  }, [offset]);

  // Infinite scroll logic with debounce
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        setOffset(prev => prev + 20);
      }
    }
  };

  const debounceScroll = useRef(null);
  const handleDebouncedScroll = (e) => {
    if (debounceScroll.current) clearTimeout(debounceScroll.current);
    debounceScroll.current = setTimeout(() => handleScroll(e), 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  
  return (
    <PageContainer ref={scrollRef} onScroll={handleDebouncedScroll}>
      <QuotesContainer>
        {quotes.map((quote, index) => (
          <QuoteCard key={index}>
            <QuoteImage src={quote.mediaUrl} alt="quote" />
            <QuoteOverlay>{quote.text}</QuoteOverlay>
            <QuoteMeta>
              <span>{quote.username}</span> |  <span>{formatDate(quote.createdAt)}</span>
            </QuoteMeta>
          </QuoteCard>
        ))}
      </QuotesContainer>

      {isLoading && <LoadingMessage>Loading more quotes...</LoadingMessage>}

      {!hasMore && <EndMessage>You've reached the end of the quotes.</EndMessage>}

      <FloatingButton onClick={() => navigate('/create-quote')}>+</FloatingButton>
    </PageContainer>
  );
};

export default QuotesPage;

const PageContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
  background-color: #f4f7fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const QuotesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 80px;
`;

const QuoteCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  }
`;

const QuoteImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;  /* Ensures image is not cut off */
  background-color: #e0e0e0;  /* Fallback background */
`;

const QuoteOverlay = styled.div`
  padding: 20px;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const QuoteMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
  padding: 0 20px 20px;
  border-top: 1px solid #eee;

  span {
    font-weight: 600;
    color: #0066cc;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  background-color: #0066cc;
  color: white;
  font-size: 2rem;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;

const LoadingMessage = styled.div`
  margin: 20px 0;
  font-size: 16px;
  color: #666;
`;

const EndMessage = styled.div`
  margin: 20px 0;
  font-size: 16px;
  color: #999;
`;
