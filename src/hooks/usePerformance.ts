import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for throttling updates to improve performance
 * Limits updates to specified FPS (frames per second)
 */
export function useThrottle<T extends (...args: any[]) => void>(
    callback: T,
    fps: number = 60
): T {
    const lastRun = useRef(Date.now());
    const timeout = useRef<number | undefined>(undefined);

    const throttledFn = useRef((...args: Parameters<T>) => {
        const now = Date.now();
        const delay = 1000 / fps;

        if (now - lastRun.current >= delay) {
            callback(...args);
            lastRun.current = now;
        } else {
            // Schedule for next available slot
            clearTimeout(timeout.current);
            timeout.current = window.setTimeout(() => {
                callback(...args);
                lastRun.current = Date.now();
            }, delay - (now - lastRun.current));
        }
    });

    useEffect(() => {
        return () => {
            clearTimeout(timeout.current);
        };
    }, []);

    return throttledFn.current as T;
}

/**
 * Custom hook for detecting when element is visible in viewport
 * Pauses animations when off-screen to save CPU
 */
export function useIntersectionObserver(
    ref: React.RefObject<Element | null>,
    options: IntersectionObserverInit = {}
): boolean {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, options.threshold, options.root, options.rootMargin]);

    return isVisible;
}

/**
 * Detect if device is mobile for performance optimizations
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth <= 900
    );

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 900);
        };

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}
