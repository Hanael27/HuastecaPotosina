import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

// jsdom doesn't provide TextEncoder/TextDecoder, but react-router v7 needs them.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

