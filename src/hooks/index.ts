import { useState, useEffect, useRef } from 'react';

export const DURATION_PRIMARY = 1500;
export const DURATION_SECONDARY = 1200;
export const DURATION_MINOR = 1000;
export const STAGGER_DELAY = 200;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < BREAKPOINTS.mobile ? 'mobile' : w < BREAKPOINTS.tablet ? 'tablet' : 'desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return bp;
}

export function useCountUp(target: number, duration: number = DURATION_PRIMARY): number {
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