import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

export interface Deck {
  id: number;
  title: string;
  description: string;
  cardCount: number;
}

interface DeckListProps {
  decks: Deck[];
  onDeckClick: (deckId: number) => void;
  onAddDeck: () => void;
  onEditDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: number) => void;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  
  @media (max-width: 380px) {
    padding: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
  
  @media (max-width: 380px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.25rem;
  }
`;

const DeckCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.25rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  height: 180px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.9);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%);
    border-radius: 20px 20px 0 0;
    pointer-events: none;
  }

  @media (max-width: 380px) {
    height: 160px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 0.95);
    }
  }
`;

const DeckTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.35rem;
  color: #1a1a1a;
  font-weight: 600;

  @media (max-width: 380px) {
    font-size: 1.25rem;
  }
`;

const DeckDescription = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 0.95rem;
  flex-grow: 1;
  line-height: 1.5;

  @media (max-width: 380px) {
    font-size: 0.9rem;
    color: #374151;
  }
`;

const DeckStats = styled.div`
  margin-top: 0.75rem;
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9rem;

  @media (max-width: 380px) {
    font-size: 0.95rem;
    margin-top: 1rem;
  }
`;

const Controls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${DeckCard}:hover & {
    opacity: 1;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 12px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const AddDeckButton = styled(motion.button)`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  }

  @media (max-width: 380px) {
    width: 100%;
    justify-content: center;
    padding: 1rem;
    font-size: 1.15rem;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
  }
`;

export function DeckList({ decks, onDeckClick, onAddDeck, onEditDeck, onDeleteDeck }: DeckListProps) {
  return (
    <Container>
      <AddDeckButton
        onClick={onAddDeck}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ✨ Create New Deck
      </AddDeckButton>

      <Grid>
        <AnimatePresence>
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              onClick={() => onDeckClick(deck.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <DeckTitle>{deck.title}</DeckTitle>
              <DeckDescription>{deck.description}</DeckDescription>
              <DeckStats>{deck.cardCount} cards</DeckStats>
              
              <Controls>
                <ControlButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditDeck(deck);
                  }}
                  title="Edit Deck"
                >
                  ✏️
                </ControlButton>
                <ControlButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDeck(deck.id);
                  }}
                  title="Delete Deck"
                >
                  🗑️
                </ControlButton>
              </Controls>
            </DeckCard>
          ))}
        </AnimatePresence>
      </Grid>
    </Container>
  );
} 