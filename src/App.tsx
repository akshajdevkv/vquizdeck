import { useState, useMemo, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCardDeck } from './components/FlashCardDeck';
import { DeckList, type Deck } from './components/DeckList';
import { DeckForm } from './components/DeckForm';
import './App.css';

interface Card {
  id: number;
  front: string;
  back: string;
}

interface FullDeck extends Deck {
  cards: Card[];
}

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 100%);
  
  @media (max-width: 380px) {
    padding: 0.75rem;
    background: linear-gradient(135deg, #e5e9ff 0%, #f5faff 100%);
  }
`;

const BrandHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
`;

const BrandName = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const MainContent = styled.div`
  margin-top: 4rem;
  min-height: calc(100vh - 4rem);
  position: relative;
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

const BackButton = styled(motion.button)`
  position: fixed;
  top: 5rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 200;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  color: #4338ca;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: 380px) {
    top: 4.5rem;
    left: 0.5rem;
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

function App() {
  const [state, setState] = useState<{
    decks: FullDeck[];
    currentDeckId: number | null;
    isAddingDeck: boolean;
    editingDeck: Deck | null;
  }>({
    decks: [
      {
        id: 1,
        title: "Chemistry: Atomic & Molecular",
        description: "Atomic structure, chemical bonds, and important molecular compounds",
        cardCount: 10,
        cards: [
          { id: 1, front: "What is Bohr's model of the atom?", back: "A model showing electrons traveling in fixed circular orbits around the nucleus, with each orbit corresponding to a specific energy level. When electrons jump between orbits, they absorb or emit specific amounts of energy." },
          { id: 2, front: "Write the chemical equation for photosynthesis", back: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\nCarbon dioxide + Water + Light → Glucose + Oxygen" },
          { id: 3, front: "Balance this redox reaction:\nZn + HCl → ZnCl₂ + H₂", back: "Zn + 2HCl → ZnCl₂ + H₂\nZinc metal reacts with hydrochloric acid to form zinc chloride and hydrogen gas" },
          { id: 4, front: "Write the chemical formula for these compounds:\n1. Sulfuric acid\n2. Sodium hydroxide\n3. Calcium carbonate", back: "1. H₂SO₄\n2. NaOH\n3. CaCO₃" },
          { id: 5, front: "Common polyatomic ions and their formulas", back: "• Ammonium: NH₄⁺\n• Hydroxide: OH⁻\n• Carbonate: CO₃²⁻\n• Phosphate: PO₄³⁻\n• Sulfate: SO₄²⁻" },
          { id: 6, front: "Write the chemical equation for the reaction between HCl and NaOH", back: "HCl + NaOH → NaCl + H₂O\nHydrochloric acid + Sodium hydroxide → Sodium chloride + Water" },
          { id: 7, front: "What is the structure of benzene? Draw using ASCII", back: "    H\n     |\nH -- C     C -- H\n     ‖    ‖\nH -- C     C -- H\n     |\n    H\n\nFormula: C₆H₆" },
          { id: 8, front: "Write electron configuration for transition metals:\n1. Cu²⁺\n2. Fe³⁺", back: "1. Cu²⁺: [Ar]3d⁹\n(Loses 4s² first, then one 3d)\n\n2. Fe³⁺: [Ar]3d⁵\n(Loses 4s² first, then one 3d)" },
          { id: 9, front: "Balance this equation:\nAl + O₂ → Al₂O₃", back: "4Al + 3O₂ → 2Al₂O₃\n\nAluminum metal combines with oxygen gas to form aluminum oxide" },
          { id: 10, front: "Write the chemical formulas for these acids:\n1. Nitric acid\n2. Phosphoric acid\n3. Acetic acid", back: "1. HNO₃\n2. H₃PO₄\n3. CH₃COOH (or C₂H₄O₂)" }
        ]
      },
      {
        id: 2,
        title: "Physics: Classical Mechanics",
        description: "Core principles of motion, forces, and energy",
        cardCount: 4,
        cards: [
          { id: 1, front: "State Newton's First Law", back: "An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force. Also known as the law of inertia. Example: A book stays on a table until pushed." },
          { id: 2, front: "What is the conservation of momentum?", back: "In a closed system, the total momentum before a collision equals the total momentum after the collision. Mathematically: p₁ + p₂ = p₁' + p₂' where p = mv (mass × velocity)." },
          { id: 3, front: "Define kinetic and potential energy", back: "Kinetic Energy (KE): Energy of motion, KE = ½mv². Potential Energy (PE): Stored energy due to position or configuration. Gravitational PE = mgh, where h is height." },
          { id: 4, front: "Explain centripetal force", back: "The force that makes an object move in a circular path, always pointing toward the center of the circle. Formula: F = mv²/r, where r is the radius of the circle. Example: Earth's gravity keeping the Moon in orbit." }
        ]
      },
      {
        id: 3,
        title: "Mathematics: Calculus Basics",
        description: "Fundamental concepts of differentiation and integration",
        cardCount: 4,
        cards: [
          { id: 1, front: "What is a derivative?", back: "The rate of change of a function at a point. Geometrically, it's the slope of the tangent line at that point. Notation: f'(x) or dy/dx. Example: The derivative of x² is 2x." },
          { id: 2, front: "Explain the chain rule", back: "A method for finding the derivative of composite functions. If y = f(u) and u = g(x), then dy/dx = (dy/du)(du/dx). Example: If y = sin(x²), then y' = 2x·cos(x²)." },
          { id: 3, front: "What is a definite integral?", back: "The area between a function and the x-axis over a specific interval [a,b]. Written as ∫ₐᵇ f(x)dx. Represents the accumulation of quantities over an interval." },
          { id: 4, front: "State the Fundamental Theorem of Calculus", back: "The definite integral of a function f(x) from a to b equals F(b) - F(a), where F is any antiderivative of f. Connects differentiation and integration as inverse processes." }
        ]
      }
    ],
    currentDeckId: null,
    isAddingDeck: false,
    editingDeck: null
  });

  const { decks, currentDeckId, isAddingDeck, editingDeck } = state;

  // Memoize the current deck to prevent unnecessary re-renders
  const currentDeck = useMemo(() => 
    currentDeckId ? decks.find(d => d.id === currentDeckId) : null,
    [currentDeckId, decks]
  );

  // Memoize the card update handler
  const handleUpdateCards = useCallback((deckId: number, newCards: Card[]) => {
    setState(prevState => ({
      ...prevState,
      decks: prevState.decks.map(deck =>
        deck.id === deckId
          ? { ...deck, cards: newCards, cardCount: newCards.length }
          : deck
      )
    }));
  }, []);

  const handleAddDeck = useCallback((deckData: { title: string; description: string }) => {
    setState(prevState => {
      const newDeck: FullDeck = {
        id: Math.max(0, ...prevState.decks.map(d => d.id)) + 1,
        ...deckData,
        cardCount: 0,
        cards: []
      };
      return {
        ...prevState,
        decks: [...prevState.decks, newDeck],
        isAddingDeck: false
      };
    });
  }, []);

  const handleEditDeck = useCallback((deckData: { title: string; description: string }) => {
    setState(prevState => {
      if (!prevState.editingDeck) return prevState;
      
      return {
        ...prevState,
        decks: prevState.decks.map(deck => 
          deck.id === prevState.editingDeck!.id
            ? { ...deck, ...deckData }
            : deck
        ),
        editingDeck: null
      };
    });
  }, []);

  const handleDeleteDeck = useCallback((deckId: number) => {
    setState(prevState => ({
      ...prevState,
      decks: prevState.decks.filter(deck => deck.id !== deckId),
      currentDeckId: prevState.currentDeckId === deckId ? null : prevState.currentDeckId
    }));
  }, []);

  const handleModalClose = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isAddingDeck: false,
      editingDeck: null
    }));
  }, []);

  return (
    <AppContainer>
      <BrandHeader>
        <BrandName>QuizDeck</BrandName>
      </BrandHeader>
      <MainContent>
        <AnimatePresence mode="wait">
          {currentDeckId && currentDeck ? (
            <motion.div
              key="deck"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <BackButton
                onClick={() => setState(prev => ({ ...prev, currentDeckId: null }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ← Back to Decks
              </BackButton>
              <FlashCardDeck
                key={currentDeckId}
                initialCards={currentDeck.cards}
                onCardsUpdate={(cards) => handleUpdateCards(currentDeckId, cards)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <DeckList
                decks={decks}
                onDeckClick={(id) => setState(prev => ({ ...prev, currentDeckId: id }))}
                onAddDeck={() => setState(prev => ({ ...prev, isAddingDeck: true }))}
                onEditDeck={(deck) => setState(prev => ({ ...prev, editingDeck: deck }))}
                onDeleteDeck={handleDeleteDeck}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(isAddingDeck || editingDeck) && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleModalClose();
                }
              }}
            >
              <DeckForm
                onSubmit={editingDeck ? handleEditDeck : handleAddDeck}
                initialValues={editingDeck || undefined}
                onCancel={handleModalClose}
              />
            </Modal>
          )}
        </AnimatePresence>
      </MainContent>
    </AppContainer>
  );
}

export default App;
