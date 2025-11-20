import { useEffect, useRef, useState } from 'react';

function useThrottle<T>(value: T, delay: number = 500) {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  const lastExcecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExcecuted.current + delay) {
      lastExcecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExcecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;