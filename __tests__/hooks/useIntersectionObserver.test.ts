import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from '@/app/_hooks/useIntersectionObserver';
import React from 'react';

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

let intersectionCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;

const mockIntersectionObserver = jest.fn().mockImplementation((callback) => {
  intersectionCallback = callback;
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: jest.fn(),
  };
});

const mockElement = document.createElement('div');
jest.spyOn(React, 'useRef').mockReturnValue({ current: mockElement });

beforeEach(() => {
  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
  jest.clearAllMocks();
});

describe('useIntersectionObserver', () => {
  describe('initialisation', () => {
    it('returns isIntersecting as false by default', () => {
      const { result } = renderHook(() => useIntersectionObserver());
      expect(result.current.isIntersecting).toBe(false);
    });

    it('returns a ref object', () => {
      const { result } = renderHook(() => useIntersectionObserver());
      expect(result.current.ref).toBeDefined();
      expect(result.current.ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('creates an IntersectionObserver on mount', () => {
      renderHook(() => useIntersectionObserver());
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    });
  });

  describe('intersection', () => {
    it('sets isIntersecting to true when element enters viewport', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      expect(result.current.isIntersecting).toBe(true);
    });

    it('sets isIntersecting to false when element leaves viewport', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
      });

      expect(result.current.isIntersecting).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('disconnects the observer on unmount', () => {
      const { unmount } = renderHook(() => useIntersectionObserver());
      unmount();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
