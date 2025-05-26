
import React from 'react';
import { cn } from '@/lib/utils';

interface VirtualKeyboardProps {
  highlightedKeys: string[];
  currentFinger: string;
  pressedKey?: string;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ 
  highlightedKeys, 
  currentFinger, 
  pressedKey 
}) => {
  const fingerColors = {
    'left-pinky': 'bg-red-200 border-red-400',
    'left-ring': 'bg-orange-200 border-orange-400',
    'left-middle': 'bg-yellow-200 border-yellow-400',
    'left-index': 'bg-green-200 border-green-400',
    'left-thumb': 'bg-blue-200 border-blue-400',
    'right-thumb': 'bg-blue-200 border-blue-400',
    'right-index': 'bg-green-200 border-green-400',
    'right-middle': 'bg-yellow-200 border-yellow-400',
    'right-ring': 'bg-orange-200 border-orange-400',
    'right-pinky': 'bg-red-200 border-red-400',
  };

  const keyToFinger: { [key: string]: string } = {
    '`': 'left-pinky', '1': 'left-pinky', 'q': 'left-pinky', 'a': 'left-pinky', 'z': 'left-pinky',
    '2': 'left-ring', 'w': 'left-ring', 's': 'left-ring', 'x': 'left-ring',
    '3': 'left-middle', 'e': 'left-middle', 'd': 'left-middle', 'c': 'left-middle',
    '4': 'left-index', '5': 'left-index', 'r': 'left-index', 't': 'left-index', 
    'f': 'left-index', 'g': 'left-index', 'v': 'left-index', 'b': 'left-index',
    ' ': 'left-thumb',
    '6': 'right-index', '7': 'right-index', 'y': 'right-index', 'u': 'right-index',
    'h': 'right-index', 'j': 'right-index', 'n': 'right-index', 'm': 'right-index',
    '8': 'right-middle', 'i': 'right-middle', 'k': 'right-middle', ',': 'right-middle',
    '9': 'right-ring', 'o': 'right-ring', 'l': 'right-ring', '.': 'right-ring',
    '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky', 'p': 'right-pinky', 
    '[': 'right-pinky', ']': 'right-pinky', '\\': 'right-pinky', ';': 'right-pinky', 
    "'": 'right-pinky', '/': 'right-pinky'
  };

  const getKeyStyle = (key: string) => {
    const finger = keyToFinger[key.toLowerCase()];
    const isHighlighted = highlightedKeys.includes(key.toLowerCase());
    const isPressed = pressedKey === key.toLowerCase();
    const isCurrentFinger = finger === currentFinger;

    // Base classes for all keys with a smooth transition
    const baseClasses = "flex items-center justify-center rounded-lg border-2 transition-all duration-300 font-medium text-sm";
    
    // Custom animation for pressed keys
    if (isPressed) {
      return cn(baseClasses, "bg-purple-500 border-purple-600 text-white transform scale-95 shadow-lg");
    }
    
    // Custom animation for highlighted keys with slower pulsing
    if (isHighlighted) {
      return cn(
        baseClasses, 
        "bg-gradient-to-r from-purple-400 to-blue-400 border-purple-500 text-white shadow-lg",
        "animate-pulse [animation-duration:1s]"
      );
    }
    
    if (isCurrentFinger && finger) {
      return cn(baseClasses, fingerColors[finger], "shadow-md");
    }
    
    if (finger) {
      return cn(baseClasses, fingerColors[finger], "opacity-60");
    }
    
    return cn(baseClasses, "bg-gray-100 border-gray-300 text-gray-700");
  };

  const keyRows = [
    [
      { key: '`', width: 'w-12' },
      { key: '1', width: 'w-12' },
      { key: '2', width: 'w-12' },
      { key: '3', width: 'w-12' },
      { key: '4', width: 'w-12' },
      { key: '5', width: 'w-12' },
      { key: '6', width: 'w-12' },
      { key: '7', width: 'w-12' },
      { key: '8', width: 'w-12' },
      { key: '9', width: 'w-12' },
      { key: '0', width: 'w-12' },
      { key: '-', width: 'w-12' },
      { key: '=', width: 'w-12' },
      { key: 'Delete', width: 'w-20' }
    ],
    [
      { key: 'Tab', width: 'w-16' },
      { key: 'Q', width: 'w-12' },
      { key: 'W', width: 'w-12' },
      { key: 'E', width: 'w-12' },
      { key: 'R', width: 'w-12' },
      { key: 'T', width: 'w-12' },
      { key: 'Y', width: 'w-12' },
      { key: 'U', width: 'w-12' },
      { key: 'I', width: 'w-12' },
      { key: 'O', width: 'w-12' },
      { key: 'P', width: 'w-12' },
      { key: '[', width: 'w-12' },
      { key: ']', width: 'w-12' },
      { key: '\\', width: 'w-16' }
    ],
    [
      { key: 'Caps', width: 'w-20' },
      { key: 'A', width: 'w-12' },
      { key: 'S', width: 'w-12' },
      { key: 'D', width: 'w-12' },
      { key: 'F', width: 'w-12' },
      { key: 'G', width: 'w-12' },
      { key: 'H', width: 'w-12' },
      { key: 'J', width: 'w-12' },
      { key: 'K', width: 'w-12' },
      { key: 'L', width: 'w-12' },
      { key: ';', width: 'w-12' },
      { key: "'", width: 'w-12' },
      { key: 'Enter', width: 'w-24' }
    ],
    [
      { key: 'Shift', width: 'w-28' },
      { key: 'Z', width: 'w-12' },
      { key: 'X', width: 'w-12' },
      { key: 'C', width: 'w-12' },
      { key: 'V', width: 'w-12' },
      { key: 'B', width: 'w-12' },
      { key: 'N', width: 'w-12' },
      { key: 'M', width: 'w-12' },
      { key: ',', width: 'w-12' },
      { key: '.', width: 'w-12' },
      { key: '/', width: 'w-12' },
      { key: 'Shift', width: 'w-28' }
    ],
    [
      { key: 'Ctrl', width: 'w-16' },
      { key: 'Opt', width: 'w-16' },
      { key: 'Cmd', width: 'w-16' },
      { key: ' ', width: 'w-80', display: 'Space' },
      { key: 'Cmd', width: 'w-16' },
      { key: 'Opt', width: 'w-16' },
      { key: 'Ctrl', width: 'w-16' }
    ]
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="space-y-2">
        {keyRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((keyInfo, keyIndex) => (
              <div
                key={keyIndex}
                className={cn(
                  getKeyStyle(keyInfo.key),
                  keyInfo.width,
                  "h-12"
                )}
              >
                {keyInfo.display || keyInfo.key}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Finger Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Finger Guide</h4>
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-200 border border-red-400"></div>
            <span>Pinky</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-200 border border-orange-400"></div>
            <span>Ring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-400"></div>
            <span>Middle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200 border border-green-400"></div>
            <span>Index</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-200 border border-blue-400"></div>
            <span>Thumb</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
