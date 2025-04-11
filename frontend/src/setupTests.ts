import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Mock TextEncoder and TextDecoder
class MockTextEncoder implements TextEncoder {
    readonly encoding = 'utf-8';
    encode(input: string): Uint8Array {
        return new Uint8Array(Buffer.from(input));
    }
    encodeInto(input: string, target: Uint8Array): { read: number; written: number } {
        const encoded = this.encode(input);
        const written = Math.min(encoded.length, target.length);
        target.set(encoded.subarray(0, written));
        return { read: encoded.length, written };
    }
}

class MockTextDecoder implements TextDecoder {
    readonly encoding = 'utf-8';
    readonly fatal = false;
    readonly ignoreBOM = false;
    decode(input?: AllowSharedBufferSource): string {
        return Buffer.from(input as ArrayBuffer).toString();
    }
}

global.TextEncoder = MockTextEncoder;
global.TextDecoder = MockTextDecoder;

// Mock window.matchMedia
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

afterEach(() => {
    cleanup();
}); 