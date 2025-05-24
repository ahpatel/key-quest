import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  typedText: string;
  className?: string;
}

export function AnimatedText({ text, typedText, className }: AnimatedTextProps) {
  return (
    <div className={cn('flex flex-wrap gap-x-1', className)}>
      {text.split('').map((char, index) => {
        const isTyped = index < typedText.length;
        const isCorrect = isTyped && char === typedText[index];
        const isCurrent = index === typedText.length;

        return (
          <motion.span
            key={index}
            className={cn(
              'relative inline-block',
              isTyped
                ? isCorrect
                  ? 'text-green-600'
                  : 'text-red-600 underline'
                : 'text-gray-600',
              isCurrent && 'border-l-2 border-blue-500 animate-pulse'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isCurrent ? 1.2 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
            {isCurrent && (
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.span>
        );
      })}
    </div>
  );
}

interface AnimatedKeystrokeProps {
  keyName: string;
  isActive?: boolean;
  isError?: boolean;
  onPress?: () => void;
}

export function AnimatedKeystroke({
  keyName,
  isActive = false,
  isError = false,
  onPress,
}: AnimatedKeystrokeProps) {
  return (
    <motion.button
      className={cn(
        'relative flex items-center justify-center h-12 px-3 rounded-lg font-medium text-sm',
        'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
        'border border-gray-200 dark:border-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        isActive && 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700',
        isError && 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700',
        'transition-colors duration-150'
      )}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: isActive ? [0, -5, 0] : 0,
        scale: isActive ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      onClick={onPress}
    >
      {keyName}
      {isActive && (
        <motion.span
          className="absolute inset-0 rounded-lg bg-blue-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.button>
  );
}
