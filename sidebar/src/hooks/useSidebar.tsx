import { useState } from "react";

export const useSiderbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    /* setIsOpen의 기능
    * 1. isOpen = true => open
    * 2. isOpen = false => close
    * 3. isOpen === true ? open : close => toggle  
    */
    
    const toggle = () => {
        setIsOpen((prev) => !prev);
    };

    const open = () => {
        setIsOpen(true);
    };

    const close= ()=> {
        setIsOpen(false);
    };

    return {
        isOpen,
        toggle, 
        open,
        close,
    };
};