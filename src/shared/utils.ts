import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// format amount to Indonesian currency
export const parseAmount = (amount: number) => {
  // remove Rp. and ,00
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s/g, '');
};

export const parseAmountManual = (amount: number) => {
  const str = amount.toString();

  if (str.length < 3) {
    return `Rp${str}`;
  }

  let result = '';

  for (let i = str.length - 1; i >= 0; i--) {
    if ((str.length - i) % 3 === 0) {
      result = `.${str[i]}${result}`;
    } else {
      result = `${str[i]}${result}`;
    }
  }

  return `Rp${result}`;
};

export const parseDate = (date: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        resolve(fn(...args));
      }, delay);
    });
  };
};

export const throttle = (func: Function, time: number) => {
  let lastRun: number | null = null;
  return (...args: any) => {
    if (!lastRun || Date.now() - lastRun >= time) {
      func(...args);
      lastRun = Date.now();
    }
  };
};

export const getSignalBars = (rssi: number): number => {
  if (rssi >= -40) return 4; // Excellent
  if (rssi >= -70) return 3; // Good
  if (rssi >= -90) return 2; // Weak
  return 1; // Very Poor
};
