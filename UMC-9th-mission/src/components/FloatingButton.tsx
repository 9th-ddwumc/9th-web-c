interface FloatingButtonProps {
  onClick: () => void;
}

export const FloatingButton = ({onClick}: FloatingButtonProps) => {;

    return (
        <button onClick={onClick}
      className="fixed bottom-10 right-5 w-14 h-14 bg-[#ed2463] text-white text-3xl font-bold rounded-full shadow-lg 
      text-center hover:scale-105 hover:cursor-pointer transition-transform flex items-center justify-center z-50">
      +
    </button>
    );
}