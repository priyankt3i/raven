
import { useState, useEffect } from 'react';

export const useCountdown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
    if (countDown < 0) {
        return "Overdue";
    }
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
};
