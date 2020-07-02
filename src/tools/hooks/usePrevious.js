import { useEffect, useRef } from 'react';
// https://medium.com/@hegystyle/remembering-the-previous-value-of-a-prop-or-a-state-while-using-react-hooks-6f57686aa0a6

export default function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
