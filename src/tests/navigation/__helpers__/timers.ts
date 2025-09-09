export const useFakeTimers = () => {
  jest.useFakeTimers();
  return {
    advance: (ms: number) => jest.advanceTimersByTime(ms),
    runAll: () => jest.runAllTimers(),
    useReal: () => jest.useRealTimers(),
  };
};
