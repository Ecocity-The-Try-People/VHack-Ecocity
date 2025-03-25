import { useState } from "react";

export const useToggle = (initialValue = false) => {
    const [state, setState] = useState(initialValue);

    const toggle = () => {
        setState((s) => !s)
    }

    return [state, toggle];
}