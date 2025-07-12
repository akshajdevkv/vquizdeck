import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import type { Deck } from './DeckList';

interface DeckFormProps {
  onSubmit: (deck: { title: string; description: string }) => void;
  initialValues?: Partial<Deck>;
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

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #2a2a2a;
  font-size: 1rem;
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

const TextArea = styled.textarea`
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
  margin-top: 1rem;
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

export function DeckForm({ onSubmit, initialValues, onCancel }: DeckFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title: title.trim(), description: description.trim() });
      if (!initialValues) {
        setTitle('');
        setDescription('');
      }
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Deck Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextArea
        placeholder="Deck Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <ButtonGroup>
        {onCancel && (
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {initialValues ? 'Save Changes' : 'Create Deck'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
} 