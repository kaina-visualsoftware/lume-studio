import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration: number = 1500): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef<number>(0);

  useEffect(() => {
    startValue.current = count;
    startTime.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue.current + (target - startValue.current) * easeOut;
      
      setCount(Math.round(currentValue * 100) / 100);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

export function useRealTimeClock(): Date {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}