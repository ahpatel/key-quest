
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface HandPositionGuideProps {
  onBack: () => void;
}

const HandPositionGuide: React.FC<HandPositionGuideProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Sit Up Straight",
      description: "Position yourself comfortably at your computer",
      instructions: [
        "Sit with your back straight against the chair",
        "Feet flat on the floor",
        "Screen at eye level",
        "Arms relaxed at your sides"
      ],
      image: "🪑",
      tip: "Good posture prevents fatigue and improves typing speed!"
    },
    {
      title: "Hand Position",
      description: "Learn the proper hand placement",
      instructions: [
        "Wrists should float above the keyboard",
        "Don't rest your wrists on the desk",
        "Curve your fingers naturally",
        "Keep your hands relaxed"
      ],
      image: "👐",
      tip: "Floating wrists prevent strain and allow for better finger movement!"
    },
    {
      title: "Home Row Position",
      description: "Find your finger's home base",
      instructions: [
        "Left hand: A-S-D-F (pinky to index finger)",
        "Right hand: J-K-L-; (index to pinky finger)",
        "Feel for the bumps on F and J keys",
        "These are your anchor points"
      ],
      image: "⌨️",
      tip: "The F and J keys have small bumps to help you find home position without looking!"
    },
    {
      title: "Finger Assignments",
      description: "Each finger has specific keys to press",
      instructions: [
        "Pinky fingers: Handle the outer columns",
        "Ring fingers: Handle the next columns",
        "Middle fingers: Handle the center-ish columns",
        "Index fingers: Handle 2 columns each (including center)",
        "Thumbs: Handle the spacebar"
      ],
      image: "🖐️",
      tip: "Using the correct finger for each key builds muscle memory faster!"
    },
    {
      title: "Movement Technique",
      description: "How to move your fingers properly",
      instructions: [
        "Keep your other fingers on home row when one finger moves",
        "Move only the finger that needs to press a key",
        "Return to home row position after each keystroke",
        "Don't look at the keyboard - trust your fingers!"
      ],
      image: "✨",
      tip: "Keeping other fingers anchored helps maintain position and improves accuracy!"
    },
    {
      title: "Practice Tips",
      description: "How to improve your typing skills",
      instructions: [
        "Start slowly and focus on accuracy over speed",
        "Practice little and often (15-20 minutes per day)",
        "Use all 10 fingers from the beginning",
        "Stay relaxed - tension slows you down"
      ],
      image: "🎯",
      tip: "Speed comes naturally with practice - focus on getting it right first!"
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="hover:bg-purple-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentStepData.image}</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentStepData.title}</h1>
            <p className="text-lg text-gray-600">{currentStepData.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Instructions:</h3>
              <ul className="space-y-3">
                {currentStepData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">💡 Pro Tip</h3>
              <p className="text-purple-700">{currentStepData.tip}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button 
                onClick={onBack}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Ready to Type!
              </Button>
            ) : (
              <Button 
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HandPositionGuide;
