import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Zap, Target, Clock, Award, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypingTest } from '@/components/TypingTest';
import { ProgressTracker } from '@/components/ProgressTracker';

// Sample lesson text - in a real app, this would come from your API
const SAMPLE_LESSON = `The quick brown fox jumps over the lazy dog. This pangram contains every letter in the English alphabet at least once. Typing is an essential skill in today's digital world, and practicing regularly will help you improve your speed and accuracy.`;

export default function TypingLessonPage() {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    time: 0,
  });

  const handleComplete = (newStats: { wpm: number; accuracy: number; time: number }) => {
    setStats(newStats);
    setShowResults(true);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Typing Practice
          </h1>
          <div className="w-24">
            {/* Empty div for layout balance */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main typing area */}
          <div className="lg:col-span-2">
            <TypingTest 
              text={SAMPLE_LESSON}
              onComplete={handleComplete}
              onBack={handleBack}
            />
          </div>

          {/* Progress and stats */}
          <div className="lg:col-span-1">
            <ProgressTracker />
            
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                    <span>Best WPM</span>
                  </div>
                  <span className="font-medium">{Math.round(stats.wpm || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-green-500 mr-2" />
                    <span>Best Accuracy</span>
                  </div>
                  <span className="font-medium">{Math.round(stats.accuracy || 0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-purple-500 mr-2" />
                    <span>Time Spent</span>
                  </div>
                  <span className="font-medium">{Math.round(stats.time || 0)}s</span>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 rounded-xl p-6 mt-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Keep your fingers on the home row keys
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>

                  Maintain good posture while typing
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Focus on accuracy first, speed will come with practice
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Take breaks to avoid strain
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
