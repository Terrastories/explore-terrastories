// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Mock URL.createObjectURL which is used by mapbox-gl
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = () => 'mock-url';
}

// Mock Canvas getContext which is needed for mapbox-gl in jsdom
// This prevents "Worker exited unexpectedly" when mapbox-gl tries to initialize
if (typeof HTMLCanvasElement.prototype.getContext === 'undefined') {
  // @ts-ignore
  HTMLCanvasElement.prototype.getContext = (type) => {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (x: number, y: number, w: number, h: number) => ({
        data: new Array(w * h * 4).fill(0)
      }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    };
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
