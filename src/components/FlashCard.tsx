import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';

interface FlashCardProps {
  front: string;
  back: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CardContainer = styled.div`
  width: 100%;
  max-width: 360px;
  height: 480px; // Reduced from 640px for better screen fit
  perspective: 1000px;
  cursor: pointer;
  margin: 0.5rem auto;
  position: relative;
  border-radius: 30px;

  @media (max-height: 700px) {
    height: 420px;
  }

  @media (max-width: 380px) {
    max-width: 320px;
    height: 400px;
  }
`;

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transform-style: preserve-3d;
  border-radius: 30px;
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
  font-size: 1.25rem;
  color: #2a2a2a;
  transition: all 0.3s ease;
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%);
    border-radius: 30px 30px 0 0;
    pointer-events: none;
  }

  @media (max-width: 380px) {
    font-size: 1.15rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.15),
      inset 0 1px 1px rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(255, 255, 255, 0.9);
  }
`;

const CardBack = styled(CardSide)`
  transform: rotateY(180deg);
  background: rgba(255, 255, 255, 0.9);

  @media (max-width: 380px) {
    background: rgba(255, 255, 255, 0.95);
  }
`;

const CardContent = styled.div`
  max-width: 100%;
  max-height: 100%;
  word-wrap: break-word;
  line-height: 1.4;
  user-select: none;
  overflow-y: auto;
  padding: 1rem;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const Controls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${CardContainer}:hover & {
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

export function FlashCard({ front, back, onEdit, onDelete }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Don't flip if clicking on control buttons
    if ((e.target as HTMLElement).closest('button')) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <CardContainer onClick={handleClick}>
      <Controls>
        {onEdit && (
          <ControlButton onClick={onEdit} title="Edit">
            ✏️
          </ControlButton>
        )}
        {onDelete && (
          <ControlButton onClick={onDelete} title="Delete">
            🗑️
          </ControlButton>
        )}
      </Controls>
      <AnimatePresence mode="wait">
        <CardInner
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <CardSide>
            <CardContent>{front}</CardContent>
          </CardSide>
          <CardBack>
            <CardContent>{back}</CardContent>
          </CardBack>
        </CardInner>
      </AnimatePresence>
    </CardContainer>
  );
} 