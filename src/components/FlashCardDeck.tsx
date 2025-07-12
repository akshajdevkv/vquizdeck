import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCard } from './FlashCard';
import { CardForm } from './CardForm';

interface Card {
  id: number;
  front: string;
  back: string;
}

interface FlashCardDeckProps {
  initialCards?: Card[];
  onCardsUpdate?: (cards: Card[]) => void;
}

const DeckContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: calc(100vh - 6rem);
  margin: 0 auto;
  padding: 4rem 1rem 1rem;
  position: relative;
  box-sizing: border-box;
  gap: 1rem;
`;

const HeaderContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  pointer-events: none;
  z-index: 100;
  margin-top: 1rem;

  > * {
    pointer-events: auto;
  }

  @media (max-width: 380px) {
    padding: 0 1rem;
  }
`;

const CardWrapper = styled(motion.div)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  touch-action: none;
  margin: 0.5rem 0;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  width: calc(100% - 1rem);
  max-width: 400px;

  @media (max-width: 380px) {
    gap: 0.5rem;
    padding: 0.75rem;
    margin: 0.25rem;
    width: calc(100% - 0.5rem);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.9);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
      case 'danger': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'rgba(255, 255, 255, 0.9)';
    }
  }};
  color: ${props => props.variant ? '#ffffff' : '#2a2a2a'};
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.variant ? 'transparent' : 'rgba(255, 255, 255, 0.8)'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    background: ${props => {
      switch (props.variant) {
        case 'primary': return 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)';
        case 'danger': return 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
        default: return 'rgba(255, 255, 255, 1)';
      }
    }};
  }

  @media (max-width: 380px) {
    padding: 0.65rem 1.1rem;
    font-size: 0.95rem;
    font-weight: 600;
    border-radius: 14px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    ${props => props.variant && `
      background: ${
        props.variant === 'primary' 
          ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'
          : props.variant === 'danger'
            ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
            : 'rgba(255, 255, 255, 0.95)'
      };
    `}
  }
`;

const Progress = styled.div`
  text-align: center;
  font-size: 1rem;
  color: #4b5563;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-left: auto;

  @media (max-width: 380px) {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
`;

const SWIPE_THRESHOLD = 100; // minimum distance for swipe
const SWIPE_VELOCITY_THRESHOLD = 0.3; // minimum velocity for swipe

export function FlashCardDeck({ initialCards, onCardsUpdate }: FlashCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>(initialCards || [
    { id: 1, front: "What is React?", back: "A JavaScript library for building user interfaces" },
    { id: 2, front: "What is JSX?", back: "A syntax extension for JavaScript that allows you to write HTML-like code" },
    { id: 3, front: "What is a Component?", back: "A reusable piece of UI that can manage its own state" },
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  // Memoize card operations to prevent unnecessary re-renders
  const handleCardUpdate = useCallback(() => {
    if (onCardsUpdate) {
      onCardsUpdate(cards);
    }
  }, [cards, onCardsUpdate]);

  // Update parent when cards change
  useEffect(() => {
    handleCardUpdate();
  }, [handleCardUpdate]);

  // Sync with initialCards when they change
  useEffect(() => {
    if (initialCards) {
      setCards(initialCards);
      setCurrentIndex(0);
    }
  }, [initialCards]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
  };

  const handleDragEnd = (_event: any, info: any) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(swipe) > SWIPE_THRESHOLD || Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD) {
      if (swipe > 0 && currentIndex > 0) {
        // Swiped right, go to previous
        handlePrevious();
      } else if (swipe < 0 && currentIndex < cards.length - 1) {
        // Swiped left, go to next
        handleNext();
      }
    }
    setDragDirection(null);
  };

  const handleDrag = (_event: any, info: any) => {
    const swipe = info.offset.x;
    setDragDirection(swipe > 0 ? 'right' : 'left');
  };

  const handleAddCard = (cardData: { front: string; back: string }) => {
    setCards(prevCards => {
      const newCard = {
        id: Math.max(0, ...prevCards.map(c => c.id)) + 1,
        ...cardData
      };
      return [...prevCards, newCard];
    });
    setIsAddingCard(false);
    setCurrentIndex(cards.length);
  };

  const handleEditCard = (cardData: { front: string; back: string }) => {
    if (editingCard) {
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...cardData }
            : card
        )
      );
      setEditingCard(null);
    }
  };

  const handleDeleteCard = () => {
    setCards(prevCards => {
      const newCards = prevCards.filter((_, index) => index !== currentIndex);
      setCurrentIndex(prevIndex => 
        prevIndex >= newCards.length ? Math.max(0, newCards.length - 1) : prevIndex
      );
      return newCards;
    });
  };

  return (
    <DeckContainer>
      {cards.length > 0 ? (
        <>
          <HeaderContainer>
            <Progress>
              Card {currentIndex + 1} of {cards.length}
            </Progress>
          </HeaderContainer>
          
          <CardWrapper
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0
            }}
            initial={{ 
              opacity: 0,
              x: dragDirection === 'left' ? 50 : -50,
              scale: 0.8
            }}
            exit={{ 
              opacity: 0,
              x: dragDirection === 'left' ? -50 : 50,
              scale: 0.8
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            whileDrag={{
              cursor: "grabbing",
              scale: 0.95
            }}
            style={{
              cursor: "grab"
            }}
          >
            <FlashCard
              front={cards[currentIndex].front}
              back={cards[currentIndex].back}
              onEdit={() => setEditingCard(cards[currentIndex])}
              onDelete={handleDeleteCard}
            />
          </CardWrapper>

          <Controls>
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsAddingCard(true)}
            >
              Add Card
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
            >
              Next
            </Button>
          </Controls>
        </>
      ) : (
        <Controls>
          <Button
            variant="primary"
            onClick={() => setIsAddingCard(true)}
          >
            Add Your First Card
          </Button>
        </Controls>
      )}

      <AnimatePresence>
        {(isAddingCard || editingCard) && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAddingCard(false);
                setEditingCard(null);
              }
            }}
          >
            <CardForm
              onSubmit={editingCard ? handleEditCard : handleAddCard}
              initialValues={editingCard || undefined}
              onCancel={() => {
                setIsAddingCard(false);
                setEditingCard(null);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </DeckContainer>
  );
} 