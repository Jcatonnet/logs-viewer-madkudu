import '@testing-library/jest-dom';
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};