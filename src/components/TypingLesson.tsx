
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Play, Pause, Trophy, Target, Zap, Clock } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';
import { lessonData } from '@/data/lessons';

interface TypingLessonProps {
  lessonId: number;
  onBack: () => void;
  onStatsUpdate: (stats: any) => void;
}

const TypingLesson: React.FC<TypingLessonProps> = ({ lessonId, onBack, onStatsUpdate }) => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentKey, setCurrentKey] = useState('');
  const [pressedKey, setPressedKey] = useState('');

  const lesson = lessonData[lessonId] || lessonData[0];
  const phrases = lesson.phrases;

  useEffect(() => {
    setCurrentPhrase(phrases[currentPhraseIndex]);
  }, [currentPhraseIndex, phrases]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = userInput.length / 5; // standard word = 5 characters
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const currentAccuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  }, [startTime, userInput.length, errors]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(calculateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, calculateStats]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    
    event.preventDefault();
    const key = event.key;
    
    setPressedKey(key.toLowerCase());
    setTimeout(() => setPressedKey(''), 150);
    
    if (key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1));
      return;
    }
    
    if (key.length !== 1) return; // Ignore special keys
    
    const expectedChar = currentPhrase[userInput.length];
    
    if (key === expectedChar) {
      setUserInput(prev => prev + key);
    } else {
      setErrors(prev => prev + 1);
      // Still add the character but mark it as error
      setUserInput(prev => prev + key);
    }
  }, [isActive, currentPhrase, userInput.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (userInput.length < currentPhrase.length) {
      setCurrentKey(currentPhrase[userInput.length]);
    } else {
      setCurrentKey('');
    }
  }, [userInput, currentPhrase]);

  const startLesson = () => {
    setIsActive(true);
    setStartTime(Date.now());
  };

  const pauseLesson = () => {
    setIsActive(false);
  };

  const restartLesson = () => {
    setUserInput('');
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setIsActive(false);
    setStartTime(null);
  };

  const nextPhrase = () => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
      setUserInput('');
      setErrors(0);
      setIsActive(false);
      setStartTime(null);
    } else {
      // Lesson completed
      onStatsUpdate({
        wpm,
        accuracy,
        lessonsCompleted: lessonId + 1,
        totalTime: startTime ? (Date.now() - startTime) / 1000 : 0
      });
      onBack();
    }
  };

  const isCompleted = userInput.length >= currentPhrase.length;
  const progress = (userInput.length / currentPhrase.length) * 100;

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
          {char === ' ' ? '␣' : char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{lesson.title}</h2>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
          
          <Progress value={progress} className="mb-4" />
          
          <div className="flex justify-center space-x-4">
            {!isActive ? (
              <Button onClick={startLesson} className="bg-green-500 hover:bg-green-600">
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
                <span className="font-semibold">Great job!</span>
              </div>
              <div className="mt-4">
                <Button onClick={nextPhrase} className="bg-purple-500 hover:bg-purple-600">
                  {currentPhraseIndex < phrases.length - 1 ? 'Next Phrase' : 'Complete Lesson'}
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
