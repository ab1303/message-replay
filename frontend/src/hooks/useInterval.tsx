import { useEffect, useRef } from 'react';

type callBackFn = () => void;

export function useInterval(callback: callBackFn, delay: number) {
  const savedCallback = useRef<callBackFn>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
