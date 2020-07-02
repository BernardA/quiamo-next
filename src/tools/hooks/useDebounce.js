import { useEffect, useRef } from 'react';

// source https://gist.github.com/mudge/eb9178a4b6d595ffde8f9cb31744afcf
export default function useDebounce(callback, delay) {
    const latestCallback = useRef();
    const latestTimeout = useRef();

    useEffect(() => {
        latestCallback.current = callback;
    }, [callback]);

    return () => {
        if (latestTimeout.current) {
            clearTimeout(latestTimeout.current);
        }

        latestTimeout.current = setTimeout(() => { latestCallback.current(); }, delay);
    };
}
