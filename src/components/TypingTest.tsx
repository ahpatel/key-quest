import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Zap, Check, X, Clock, Award, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatedText, AnimatedKeystroke } from './AnimatedText';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '../hooks/use-local-storage';

type TypingTestProps = {
  text: string;
  onComplete?: (stats: { wpm: number; accuracy: number; time: number }) => void;
  onBack?: () => void;
};

type TypingStats = {
  wpm: number;
  accuracy: number;
  time: number;
  correctChars: number;
  totalChars: number;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  required: number;
};

export function TypingTest({ text, onComplete, onBack }: TypingTestProps) {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('typing-achievements', [
    {
      id: 'fast_typer_50',
      title: 'Fast Typer',
      description: 'Reach 50 WPM',
      unlocked: false,
      progress: 0,
      required: 50,
    },
    {
      id: 'accuracy_90',
      title: 'Accuracy Master',
      description: 'Achieve 90% accuracy',
      unlocked: false,
      progress: 0,
      required: 90,
    },
    {
      id: 'lesson_complete',
      title: 'Lesson Complete',
      description: 'Complete your first lesson',
      unlocked: false,
      progress: 0,
      required: 1,
    },
  ]);

  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    time: 0,
    correctChars: 0,
    totalChars: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Calculate WPM and accuracy
  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const correctChars = typedText.split('').filter((char, i) => char === text[i]).length;
    const accuracy = (correctChars / Math.max(1, typedText.length)) * 100;
    const wpm = Math.round((typedText.length / 5) / timeElapsed) || 0;

    setStats({
      wpm,
      accuracy,
      time: (Date.now() - startTime) / 1000,
      correctChars,
      totalChars: typedText.length,
    });
  }, [startTime, typedText, text]);

  // Update stats every second
  useEffect(() => {
    if (!startTime || isComplete) return;

    const checkAchievements = (wpm: number, accuracy: number) => {
      const updatedAchievements = [...achievements];
      let newAchievements = false;

      updatedAchievements.forEach(achievement => {
        if (!achievement.unlocked) {
          let progress = 0;
          
          switch (achievement.id) {
            case 'fast_typer_50':
              progress = Math.max(achievement.progress, wpm);
              if (progress >= achievement.required) {
                achievement.unlocked = true;
                newAchievements = true;
              }
              break;
            case 'accuracy_90':
              progress = Math.max(achievement.progress, accuracy);
              if (progress >= achievement.required) {
                achievement.unlocked = true;
                newAchievements = true;
              }
              break;
            case 'lesson_complete':
              progress = 1; // Just mark as complete when lesson is done
              achievement.unlocked = true;
              newAchievements = true;
              break;
          }
          
          achievement.progress = progress;
        }
      });

      if (newAchievements) {
        setAchievements(updatedAchievements);
        toast({
          title: "Achievement Unlocked!",
          description: "You've earned a new achievement!",
          duration: 3000,
        });
      }
    };

    const updateStats = () => {
      if (!startTime) return;
      
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const correctChars = typedText.split('').filter((char, i) => char === text[i]).length;
      const accuracy = (correctChars / Math.max(1, typedText.length)) * 100;
      const wpm = Math.round((typedText.length / 5) / timeElapsed) || 0;

      setStats({
        wpm,
        accuracy,
        time: (Date.now() - startTime) / 1000,
        correctChars,
        totalChars: typedText.length,
      });

      // Check for achievements
      checkAchievements(wpm, accuracy);
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [startTime, isComplete, typedText, text, achievements, setAchievements, toast]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) setStartTime(Date.now());

    const newText = e.target.value;
    setTypedText(newText);

    // Check if lesson is complete
    if (newText.length === text.length) {
      const finalStats = {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        time: stats.time,
        correctChars: stats.correctChars,
        totalChars: stats.totalChars,
      };
      
      setIsComplete(true);
      setShowResults(true);
      onComplete?.(finalStats);
      
      // Save to local storage
      const history = JSON.parse(localStorage.getItem('typing-history') || '[]');
      history.push({
        ...finalStats,
        date: new Date().toISOString(),
        textLength: text.length,
      });
      localStorage.setItem('typing-history', JSON.stringify(history));
    }
  };

  const resetTest = () => {
    setTypedText('');
    setStartTime(null);
    setIsComplete(false);
    setShowResults(false);
    setStats({
      wpm: 0,
      accuracy: 100,
      time: 0,
      correctChars: 0,
      totalChars: 0,
    });
    if (inputRef.current) inputRef.current.focus();
  };

  // Calculate progress
  const progress = Math.min(100, (typedText.length / text.length) * 100);
  const remainingText = text.slice(typedText.length);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}% Complete
          </span>
          <span className="text-sm font-medium text-gray-500">
            {typedText.length}/{text.length} chars
          </span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={<Zap className="w-4 h-4" />} 
          label="WPM" 
          value={Math.round(stats.wpm)} 
          color="text-yellow-500"
        />
        <StatCard 
          icon={<Check className="w-4 h-4" />} 
          label="Accuracy" 
          value={`${Math.round(stats.accuracy)}%`} 
          color="text-green-500"
        />
        <StatCard 
          icon={<Clock className="w-4 h-4" />} 
          label="Time" 
          value={`${Math.round(stats.time)}s`} 
          color="text-blue-500"
        />
      </div>

      {/* Typing Area */}
      <div 
        className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-6 min-h-[200px] flex items-center"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatedText 
          text={text} 
          typedText={typedText} 
          className="text-xl leading-relaxed"
        />
      </div>

      {/* Input */}
      <div className="relative mb-8">
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleInput}
          disabled={isComplete}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={!startTime ? 'Start typing to begin...' : ''}
        />
        {typedText.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={resetTest}
          >
            <RotateCw className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h3>
                <p className="text-gray-500">Great job on completing this typing exercise.</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Words per minute</span>
                  <span className="font-medium">{Math.round(stats.wpm)} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-medium">{Math.round(stats.accuracy)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{Math.round(stats.time)} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Characters</span>
                  <span className="font-medium">{stats.correctChars}/{stats.totalChars}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowResults(false);
                    if (onBack) onBack();
                  }}
                >
                  Back to Lessons
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    resetTest();
                    setShowResults(false);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color = "text-gray-900" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-2">
        <div className={`p-1.5 rounded-md ${color.replace('text-', 'bg-')} bg-opacity-10`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-xl font-semibold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
