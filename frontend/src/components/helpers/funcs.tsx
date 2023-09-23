import { useEffect, useRef } from "react";

export function runNTimes(func: (() => void), N=1) {
    const delta = useRef(0);
    useEffect(() => {
        if (delta.current == N) return; // make sure the  "func" only run N times
        delta.current += 1;

        func();
    }, []);
}

export function runOnce(func: (() => void)) {
    runNTimes(func);
}

export function incomingSockets(register: (() => void)) {
    runOnce(register);
}