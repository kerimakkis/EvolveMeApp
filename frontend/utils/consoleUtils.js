// Console utilities to handle warnings and errors gracefully
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Suppress specific warnings that are not critical
const suppressedWarnings = [
  'shadow*',
  'props.pointerEvents is deprecated',
  'The message port closed before a response was received'
];

console.warn = (...args) => {
  const message = args.join(' ');
  
  // Check if this warning should be suppressed
  const shouldSuppress = suppressedWarnings.some(suppressed => 
    message.includes(suppressed)
  );
  
  if (!shouldSuppress) {
    originalConsoleWarn.apply(console, args);
  }
};

console.error = (...args) => {
  const message = args.join(' ');
  
  // Check if this error should be suppressed
  const shouldSuppress = suppressedWarnings.some(suppressed => 
    message.includes(suppressed)
  );
  
  if (!shouldSuppress) {
    originalConsoleError.apply(console, args);
  }
};

export default {
  // Method to restore original console methods if needed
  restore: () => {
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  }
}; 