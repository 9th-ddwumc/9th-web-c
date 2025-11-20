import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className='fixed bottom-18 right-6 w-14 h-14 bg-pink-600 text-white rounded-full
        flex items-center justify-center text-3xl hover:bg-pink-700 transition-colors z-50 text-center'
    >
      <Plus strokeWidth={3} />
    </button>
  );
};

export default FloatingButton;