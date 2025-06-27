import Config from '../../src/js/utilsjs/Config.js';

describe('Config.isMobile()', () => {
  test('isMobile should return a boolean', () => {
    const result = Config.isMobile();
    expect(typeof result).toBe('boolean');
  });

  const originalUserAgent = navigator.userAgent;
  test('isMobile should return true for mobile user agents', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      configurable: true,
    });

    expect(Config.isMobile()).toBe(true);
  });

  test('isMobile should return false for non-mobile user agents', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      configurable: true,
    });

    expect(Config.isMobile()).toBe(false);
  });

  // Restore original user agent
  Object.defineProperty(navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: true,
  });
});
