import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCw, Award, Zap, Check, X, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AnimatedText, AnimatedKeystroke } from './AnimatedText';
import Confetti from 'react-confetti';
import { useWindowSize } from 'usehooks-ts';

interface TypingLessonProps {
  text: string;
  onComplete?: (stats: { wpm: number; accuracy: number; time: number }) => void;
  onBack?: () => void;
}

export function EnhancedTypingLesson({ text, onComplete, onBack }: TypingLessonProps) {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    time: 0,
    correctChars: 0,
    totalChars: 0,
  });
  
  const { width, height } = useWindowSize();
  const inputRef = useRef<HTMLInputElement>(null);

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
    
    calculateStats();
    const interval = setInterval(calculateStats, 1000);
    return () => clearInterval(interval);
  }, [startTime, isComplete, calculateStats]);

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
      setIsComplete(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      onComplete?.({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        time: stats.time,
      });
    }
  };

  const resetLesson = () => {
    setTypedText('');
    setStartTime(null);
    setIsComplete(false);
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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Typing Lesson</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Zap className="w-5 h-5" />
                  <span>{stats.wpm} WPM</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="w-5 h-5" />
                  <span>{Math.round(stats.accuracy)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{Math.round(stats.time)}s</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
            </div>
            
            <div 
              className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-6 text-xl leading-relaxed h-48 overflow-y-auto"
              onClick={() => inputRef.current?.focus()}
            >
              <AnimatedText text={text} typedText={typedText} />
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="relative w-full max-w-2xl">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedText}
                  onChange={handleInput}
                  disabled={isComplete}
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={!startTime ? 'Start typing to begin...' : ''}
                />
                {typedText.length > 0 && !isComplete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={resetLesson}
                  >
                    <RotateCw className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <StatCard 
                icon={<Zap className="w-6 h-6" />} 
                label="Words Per Minute" 
                value={stats.wpm}
              />
              <StatCard 
                icon={<Check className="w-6 h-6" />} 
                label="Accuracy" 
                value={`${Math.round(stats.accuracy)}%`}
              />
              <StatCard 
                icon={<Clock className="w-6 h-6" />} 
                label="Time" 
                value={`${Math.round(stats.time)}s`}
              />
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 px-6 py-4 border-t flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back to Lessons
            </Button>
            {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="flex items-center space-x-2"
              >
                <span className="text-green-600 font-medium">
                  Lesson Complete!
                </span>
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Button variant="default" onClick={resetLesson}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Floating achievements */}
      <AnimatePresence>
        {stats.wpm > 30 && !isComplete && (
          <motion.div
            className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border-l-4 border-yellow-500 z-50 max-w-xs"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
          >
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold">Great Speed!</h4>
                <p className="text-sm text-gray-600">You're typing at {stats.wpm} WPM. Keep it up!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <motion.div 
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}
