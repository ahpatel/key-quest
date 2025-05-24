
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Lock, CheckCircle, Clock, Target } from 'lucide-react';
import { lessonData } from '@/data/lessons';

interface LessonSelectorProps {
  onSelectLesson: (lessonId: number) => void;
  userStats: {
    lessonsCompleted: number;
    wpm: number;
    accuracy: number;
  };
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ onSelectLesson, userStats }) => {
  const isLessonUnlocked = (lessonIndex: number) => {
    return lessonIndex <= userStats.lessonsCompleted;
  };

  const getLessonStatus = (lessonIndex: number) => {
    if (lessonIndex < userStats.lessonsCompleted) return 'completed';
    if (lessonIndex === userStats.lessonsCompleted) return 'available';
    return 'locked';
  };

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Choose Your Lesson
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonData.map((lesson, index) => {
          const status = getLessonStatus(index);
          const isUnlocked = isLessonUnlocked(index);
          
          return (
            <Card 
              key={index}
              className={`p-6 transition-all duration-300 cursor-pointer ${
                isUnlocked 
                  ? 'bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-xl hover:-translate-y-2' 
                  : 'bg-gray-100/80 backdrop-blur-sm border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'available' ? 'bg-purple-500' :
                    'bg-gray-400'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : status === 'available' ? (
                      <Star className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
                    Level {index + 1}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.estimatedTime}</span>
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                {lesson.title}
              </h4>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {lesson.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{lesson.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{lesson.phrases.length} phrases</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => onSelectLesson(index)}
                disabled={!isUnlocked}
                className={`w-full ${
                  status === 'completed' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                }`}
              >
                {status === 'completed' ? 'Practice Again' :
                 status === 'available' ? 'Start Lesson' :
                 'Locked'}
              </Button>

              {lesson.funFact && isUnlocked && (
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <p className="text-xs text-purple-700">
                    💡 {lesson.funFact.substring(0, 80)}...
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSelector;
