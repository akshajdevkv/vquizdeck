import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

interface CardFormProps {
  onSubmit: (card: { front: string; back: string }) => void;
  initialValues?: { front: string; back: string };
  onCancel?: () => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const Input = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #2a2a2a;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.variant === 'primary' 
    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
    : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.variant === 'primary' ? 'white' : '#2a2a2a'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.8)'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    background: ${props => props.variant === 'primary'
      ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'
      : 'rgba(255, 255, 255, 1)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

export function CardForm({ onSubmit, initialValues, onCancel }: CardFormProps) {
  const [front, setFront] = useState(initialValues?.front || '');
  const [back, setBack] = useState(initialValues?.back || '');

  useEffect(() => {
    if (initialValues) {
      setFront(initialValues.front);
      setBack(initialValues.back);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onSubmit({ front, back });
      if (!initialValues) {
        setFront('');
        setBack('');
      }
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        value={front}
        onChange={(e) => setFront(e.target.value)}
        placeholder="Front of card (question)"
        required
      />
      <Input
        value={back}
        onChange={(e) => setBack(e.target.value)}
        placeholder="Back of card (answer)"
        required
      />
      <ButtonGroup>
        {onCancel && (
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {initialValues ? 'Update Card' : 'Add Card'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
} 