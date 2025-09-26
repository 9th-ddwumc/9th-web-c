import { useState } from "react";
import Navbar from "./Navbar";
import ThemeContent from "./ThemeContent";
import { ThemeProvider } from "./context/ThemeProvider";

export default function ContextPage(){
const [counter, setCount] = useState(0)

    return (
    <ThemeProvider>
        <div className="flex flex-col itmes-center justify-center min-h-screen">
        <Navbar></Navbar>
        <main className="flex-1 w-full">
        <ThemeContent/>
        </main>
        </div>
    </ThemeProvider>
    );
};

