// components/quiz-timer.tsx
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/Store/Store';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';

const QuizTimer = () => {
  const router = useRouter();
  const timeRemaining = useAppStore((state) => state.timeRemaining);
  const updateTimeRemaining = useAppStore((state) => state.updateTimeRemaining);
  const isFinished = useAppStore((state) => state.isFinished);
  const QuizDuration = useAppStore((state) => state.duration);

  useEffect(() => {
    if (timeRemaining === null) return;

    const timer = setInterval(() => {
      updateTimeRemaining();
    }, 1000);

    if (isFinished) {
      clearInterval(timer);
      router.push('/home'); // or however you handle quiz completion
    }

    return () => clearInterval(timer);
  }, [timeRemaining, isFinished, updateTimeRemaining, router]);

  if (timeRemaining === null) return null;

  const minutes = Math.floor(timeRemaining / (60 * 1000));
  const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

  return (
    <div className={`${timeRemaining <= Math.max(10, (QuizDuration ?? 0) * 0.2) ? 'text-red-600' : ''}  flex items-center gap-2 text-xl font-semibold`}>
      <Clock className="h-5 w-5" />
      <span>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default QuizTimer;