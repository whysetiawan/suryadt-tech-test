import { cn, parseAmount, parseDate, debounce, throttle, parseAmountManual } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2')).toBe('class1');
    });
  });

  describe('parseAmount', () => {
    it('should format amount correctly', () => {
      expect(parseAmount(1000)).toBe('Rp1.000');
      expect(parseAmount(1000000)).toBe('Rp1.000.000');
    });
  });

  describe('parseDate', () => {
    it('should format date correctly', () => {
      expect(parseDate('2023-01-01')).toBe('1 Januari 2023');
      expect(parseDate('2023-12-31')).toBe('31 Desember 2023');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', async () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(500);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    it('should throttle function calls', () => {
      // arrange:
      // create a mock function and throttle it
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);

      // act:
      // call the throttled function twice
      throttledFn();
      throttledFn();

      // assert:
      // the mock function should be called once
      expect(mockFn).toHaveBeenCalledTimes(1);

      // act:
      // advance the timers by 500ms and call the throttled function
      jest.advanceTimersByTime(500);
      throttledFn();

      // assert:
      // the mock function should still be called once
      expect(mockFn).toHaveBeenCalledTimes(1);

      // act:
      // advance the timers by 500ms and call the throttled function again
      jest.advanceTimersByTime(500);
      throttledFn();

      // assert:
      // the mock function should be called twice
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
  describe('parseAmountManual', () => {
    it('should format amount correctly', () => {
      expect(parseAmountManual(1000)).toBe('Rp1.000');
      expect(parseAmountManual(1000000)).toBe('Rp1.000.000');
      expect(parseAmountManual(1000000000)).toBe('Rp1.000.000.000');
    });
  });
});
