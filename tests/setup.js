// Test setup file
// Configure global test environment

// Polyfill fetch for Node.js < 18
if (typeof global.fetch === 'undefined') {
  try {
    // Try to use node-fetch if available, otherwise try native fetch (Node 18+)
    const fetch = require('node-fetch');
    global.fetch = fetch;
  } catch (e) {
    // Node 18+ has native fetch, no polyfill needed
    if (typeof fetch === 'undefined' && !global.fetch) {
      console.warn('⚠️ fetch is not available - tests that need it will fail');
    }
  }
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window.matchMedia (only if window exists - for Node.js or jsdom environments)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(), // Suppress console errors in tests
  warn: jest.fn(),
};
