import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Clock, Star, CheckCircle, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  required: number;
}

export function ProgressTracker() {
  // Example achievements - in a real app, these would come from your backend
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'fast_typer',
      title: 'Fast Typer',
      description: 'Reach 50 WPM in a single lesson',
      icon: <Zap className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      required: 50
    },
    {
      id: 'accuracy_master',
      title: 'Accuracy Master',
      description: 'Achieve 95% accuracy in a lesson',
      icon: <Target className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      required: 95
    },
    {
      id: 'streak_7',
      title: '7-Day Streak',
      description: 'Complete lessons for 7 days in a row',
      icon: <Clock className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      required: 7
    },
    {
      id: 'lesson_master',
      title: 'Lesson Master',
      description: 'Complete 10 lessons',
      icon: <CheckCircle className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      required: 10
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Reach 100 WPM in a single lesson',
      icon: <Zap className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      required: 100
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete a lesson with 100% accuracy',
      icon: <Star className="w-5 h-5" />,
      unlocked: false,
      progress: 0,
      required: 100
    },
  ]);

  // In a real app, you would fetch this from your backend
  const [stats, setStats] = useState({
    totalLessons: 5,
    currentStreak: 3,
    bestWPM: 45,
    bestAccuracy: 92,
    totalTime: 1234, // in seconds
  });

  // Calculate level based on XP (example calculation)
  const xp = stats.totalLessons * 100 + stats.bestWPM * 5;
  const level = Math.floor(Math.log2(xp / 100 + 1)) + 1;
  const xpForNextLevel = Math.pow(2, level) * 100;
  const xpInCurrentLevel = xp - (Math.pow(2, level - 1) * 100);
  const xpNeededForNextLevel = xpForNextLevel - xp;
  const levelProgress = (xpInCurrentLevel / (xpForNextLevel - Math.pow(2, level - 1) * 100)) * 100;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Your Progress
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Award className="w-6 h-6 text-blue-500" />}
            label="Level"
            value={level}
            description={`${xpInCurrentLevel.toLocaleString()} XP`}
          />
          <StatCard 
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            label="Best WPM"
            value={stats.bestWPM}
            description="Personal Best"
          />
          <StatCard 
            icon={<Target className="w-6 h-6 text-green-500" />}
            label="Best Accuracy"
            value={`${stats.bestAccuracy}%`}
            description="Personal Best"
          />
          <StatCard 
            icon={<Clock className="w-6 h-6 text-purple-500" />}
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            description="Keep it up!"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
          <div className="text-right text-sm text-gray-500">
            {xpNeededForNextLevel} XP to next level
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-purple-500" />
          Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}

function StatCard({ icon, label, value, description }: StatCardProps) {
  return (
    <motion.div 
      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <motion.div 
      className={`p-4 rounded-lg border ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-600'}`}>
            {achievement.title}
          </h3>
          <p className="text-sm text-gray-500">{achievement.description}</p>
          
          {!achievement.unlocked && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-xs text-right mt-1 text-gray-500">
                {achievement.progress}/{achievement.required}
              </p>
            </div>
          )}
          
          {achievement.unlocked && (
            <div className="flex items-center mt-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Achieved!</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
