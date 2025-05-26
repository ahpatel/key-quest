
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Clock, Target, Zap, BookOpen } from 'lucide-react';
import VirtualKeyboard from '@/components/VirtualKeyboard';
import TypingLesson from '@/components/TypingLesson';
import HandPositionGuide from '@/components/HandPositionGuide';
import LessonSelector from '@/components/LessonSelector';
import Typewriter from '@/components/Typewriter';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'lesson' | 'guide'>('home');
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [userStats, setUserStats] = useState({
    wpm: 0,
    accuracy: 0,
    lessonsCompleted: 0,
    totalTime: 0
  });

  const handleStartLesson = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setCurrentView('lesson');
  };

  const handleBackHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'guide') {
    return <HandPositionGuide onBack={handleBackHome} />;
  }

  if (currentView === 'lesson') {
    return (
      <TypingLesson 
        lessonId={selectedLesson} 
        onBack={handleBackHome}
        onStatsUpdate={setUserStats}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Key Quest
                </h1>
                <p className="text-sm text-gray-600">Master the Keyboard!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Trophy className="w-4 h-4 mr-1" />
                {userStats.lessonsCompleted} lessons
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Zap className="w-4 h-4 mr-1" />
                {userStats.wpm} WPM
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-4xl font-bold text-gray-800 mb-4">
            Learn to   
            <Typewriter 
              text={"\u00A0Type Like a Pro!"} 
              className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              cursorClassName="text-purple-400"
            />
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Master proper finger placement and typing technique while learning fun facts and silly quotes!
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <Card className="p-4 bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </Card>
            <Card className="p-4 bg-white/60 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.wpm}</div>
              <div className="text-sm text-gray-600">WPM</div>
            </Card>
            <Card className="p-4 bg-white/60 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Trophy className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{userStats.lessonsCompleted}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </Card>
            <Card className="p-4 bg-white/60 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{Math.round(userStats.totalTime / 60)}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setCurrentView('guide')}
              variant="outline"
              size="lg"
              className="bg-white/80 backdrop-blur-sm border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Hand Position Guide
            </Button>
            <Button 
              onClick={() => handleStartLesson(0)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Star className="w-5 h-5 mr-2" />
              Start Typing!
            </Button>
          </div>
        </div>

        {/* Lesson Selection */}
        <LessonSelector onSelectLesson={handleStartLesson} userStats={userStats} />

        {/* Virtual Keyboard Preview */}
        <Card className="mt-12 p-8 bg-white/80 backdrop-blur-sm border-purple-200">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Interactive Keyboard Guide
          </h3>
          <VirtualKeyboard highlightedKeys={[]} currentFinger="" />
        </Card>
      </div>
    </div>
  );
};

export default Index;
