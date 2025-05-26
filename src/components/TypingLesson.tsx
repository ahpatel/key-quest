
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Play, Pause, Trophy, Target, Zap, Clock } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';
import { lessonData } from '@/data/lessons';

interface LessonStats {
  wpm: number;
  accuracy: number;
  lessonsCompleted: number;
  totalTime: number;
}

interface TypingLessonProps {
  lessonId: number;
  onBack: () => void;
  onStatsUpdate: (stats: LessonStats) => void;
}

const TypingLesson: React.FC<TypingLessonProps> = ({ lessonId, onBack, onStatsUpdate }) => {
  // State for the current lesson and phrases
  const lesson = lessonData[lessonId] || lessonData[0];
  const phrases = lesson.phrases;
  
  // Refs for values that don't trigger re-renders
  const isActiveRef = React.useRef<boolean>(false);
  const startTimeRef = React.useRef<number | null>(null);
  const currentPhraseIndexRef = React.useRef<number>(0);
  const userInputRef = React.useRef<string>('');
  
  // Component state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentKey, setCurrentKey] = useState(phrases[0]?.[0] || '');
  const [pressedKey, setPressedKey] = useState('');

  // Update refs when state changes
  React.useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);
  
  React.useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);
  
  React.useEffect(() => {
    currentPhraseIndexRef.current = currentPhraseIndex;
  }, [currentPhraseIndex]);
  
  React.useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  // Derived state
  const isCompleted = userInput.length >= currentPhrase.length && currentPhrase.length > 0;
  const progress = (userInput.length / currentPhrase.length) * 100;

  // Initialize or update current phrase when index changes
  React.useEffect(() => {
    const newPhrase = phrases[currentPhraseIndex];
    setCurrentPhrase(newPhrase);
    setUserInput('');
    setErrors(0);
    setIsActive(false);
    setStartTime(null);
    setCurrentKey(newPhrase?.[0] || '');
  }, [currentPhraseIndex, phrases]);
  
  // Handle starting the lesson
  const startLesson = React.useCallback(() => {
    if (!isActiveRef.current) {
      setIsActive(true);
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
    }
  }, []); // No dependencies since we use refs
  
  // Handle moving to next phrase or completing the lesson
  const nextPhrase = React.useCallback(() => {
    if (currentPhraseIndexRef.current < phrases.length - 1) {
      // Move to next phrase
      setCurrentPhraseIndex(prev => {
        const nextIndex = prev + 1;
        currentPhraseIndexRef.current = nextIndex;
        return nextIndex;
      });
    } else {
      // Lesson completed
      const stats: LessonStats = {
        wpm: wpm,
        accuracy: accuracy,
        lessonsCompleted: lessonId + 1,
        totalTime: startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0
      };
      onStatsUpdate(stats);
      onBack();
    }
  }, [phrases.length, wpm, accuracy, lessonId, onStatsUpdate, onBack]);

  const calculateStats = React.useCallback(() => {
    const currentStartTime = startTimeRef.current;
    if (!currentStartTime) return;
    
    const timeElapsed = (Date.now() - currentStartTime) / 1000 / 60; // minutes
    const currentInput = userInputRef.current;
    const wordsTyped = currentInput.trim().split(/\s+/).length;
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const currentAccuracy = Math.max(0, Math.round(((currentInput.length - errors) / (currentInput.length || 1)) * 100));
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  }, [errors]); // Only depends on errors since we use refs for other values

  useEffect(() => {
    if (isActive && userInput.length > 0) {
      calculateStats();
    }
  }, [userInput, isActive, calculateStats]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(calculateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, calculateStats]);

  // Handle keyboard input
  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    const key = event.key;
    const isLessonActive = isActiveRef.current;
    const currentInput = userInputRef.current;
    const currentPhraseText = currentPhrase; // Get current phrase from closure
    
    // Handle Enter key for starting/continuing
    if (key === 'Enter') {
      event.preventDefault();
      
      if (!isLessonActive) {
        // Start the lesson if not active
        startLesson();
        // Add the first character if it's Enter
        if (currentPhraseText[0] === '\n') {
          setUserInput('\n');
        }
      } else if (currentInput.length >= currentPhraseText.length) {
        // Move to next phrase if current is completed
        nextPhrase();
      }
      return;
    }

    // If not active and user types the first character
    if (!isLessonActive) {
      if (key === currentPhraseText[0] || 
          (key === ' ' && currentPhraseText[0] === ' ')) {
        event.preventDefault();
        startLesson();
        // Add the first character
        setUserInput(key);
      }
      return;
    }
    
    // Ignore key presses if not active or lesson completed
    if (!isLessonActive || currentInput.length >= currentPhraseText.length) {
      return;
    }
    
    // Handle backspace
    if (key === 'Backspace') {
      event.preventDefault();
      setUserInput(prev => prev.slice(0, -1));
      return;
    }
    
    // Ignore other special keys except space
    if (key.length !== 1 && key !== ' ') return;
    
    event.preventDefault();
    
    // Visual feedback for key press
    setPressedKey(key.toLowerCase());
    setTimeout(() => setPressedKey(''), 150);
    
    // Process the typed character
    const expectedChar = currentPhraseText[currentInput.length];
    const isCorrect = key === expectedChar;
    
    // Update user input
    setUserInput(prev => {
      const newInput = prev + key;
      
      // If we've reached the end of the phrase, mark as completed
      if (newInput.length >= currentPhraseText.length) {
        setTimeout(() => {
          if (newInput.length === currentPhraseText.length) {
            nextPhrase();
          }
        }, 100);
      }
      
      return newInput;
    });
    
    // Update errors if needed
    if (!isCorrect) {
      setErrors(prev => prev + 1);
    }
  }, [currentPhrase, startLesson, nextPhrase]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKeyPress(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKeyPress]);
  
  // Focus the container on mount for keyboard events
  React.useEffect(() => {
    const container = document.getElementById('typing-container');
    if (container) {
      container.focus();
    }
  }, []);

  React.useEffect(() => {
    if (userInput.length < currentPhrase.length) {
      setCurrentKey(currentPhrase[userInput.length]);
    } else {
      setCurrentKey('');
    }
  }, [userInput, currentPhrase]);

  const pauseLesson = () => {
    setIsActive(false);
  };

  const restartLesson = React.useCallback(() => {
    setUserInput('');
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setIsActive(false);
    setStartTime(null);
  }, []);

  // Remove duplicate declarations

  const renderText = () => {
    return currentPhrase.split('').map((char, index) => {
      let className = 'text-2xl ';
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += 'text-green-600 bg-green-100';
        } else {
          className += 'text-red-600 bg-red-100';
        }
      } else if (index === userInput.length) {
        className += 'text-gray-800 bg-blue-200 animate-pulse';
      } else {
        className += 'text-gray-400';
      }
      
      return (
        <span key={index} className={className + ' px-1 py-0.5 rounded'}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div 
      id="typing-container" 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 outline-none"
      tabIndex={0}
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="hover:bg-purple-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{lesson.title}</h1>
                <p className="text-sm text-gray-600">
                  Phrase {currentPhraseIndex + 1} of {phrases.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Zap className="w-4 h-4 mr-1" />
                {wpm} WPM
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Target className="w-4 h-4 mr-1" />
                {accuracy}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Lesson Info */}
        <Card className="mb-8 p-6 bg-white/80 backdrop-blur-sm border-purple-200">
          <div className="text-center mb-4">
            <p className="text-gray-600">{lesson.description}</p>
          </div>
          
          <Progress value={progress} className="mb-4" />
          
          <div className="flex justify-center space-x-4">
            {!isActive ? (
              <Button 
                onClick={startLesson} 
                className="bg-green-500 hover:bg-green-600"
                disabled={isActive}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseLesson} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={restartLesson} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        </Card>

        {/* Typing Area */}
        <Card className="mb-8 p-8 bg-white/80 backdrop-blur-sm border-purple-200">
          <div className="text-center mb-6">
            <div className="font-mono leading-relaxed bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px] flex items-center justify-center">
              {renderText()}
            </div>
          </div>
          
          {isCompleted && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Great job! Press Enter to {currentPhraseIndex < phrases.length - 1 ? 'continue' : 'finish'}</span>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={nextPhrase} 
                  className="bg-purple-500 hover:bg-purple-600"
                  autoFocus
                >
                  {currentPhraseIndex < phrases.length - 1 ? 'Next Phrase (Enter)' : 'Complete Lesson (Enter)'}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Virtual Keyboard */}
        <VirtualKeyboard 
          highlightedKeys={currentKey ? [currentKey.toLowerCase()] : []} 
          currentFinger=""
          pressedKey={pressedKey}
        />

        {/* Fun Fact */}
        {lesson.funFact && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">💡 Fun Fact!</h3>
            <p className="text-purple-700">{lesson.funFact}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TypingLesson;
