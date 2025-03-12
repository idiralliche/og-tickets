import { useState, useCallback } from 'react';

export const useFlashOnButtonClick = (duration = 150) => {
  const [isFlashing, setIsFlashing] = useState(false);

  // Trigger the flash effect for a given duration
  const triggerFlash = useCallback(() => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, duration);
  }, [duration]);

  return [isFlashing, triggerFlash];
};
