import React from 'react';
import { DiceValue } from '../types';

interface DieProps {
  value: DiceValue;
  isRolling: boolean;
}

export const Die: React.FC<DieProps> = ({ value, isRolling }) => {
  // Map value to dot positions
  // We use a 3x3 grid system logic for rendering dots
  // 1: center
  // 2: top-left, bottom-right
  // 3: top-left, center, bottom-right
  // 4: top-left, top-right, bottom-left, bottom-right
  // 5: 4 + center
  // 6: top-left, top-right, middle-left, middle-right, bottom-left, bottom-right

  const renderDots = () => {
    switch (value) {
      case 1:
        return <div className="w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full shadow-inner" style={{ gridArea: '2 / 2 / 3 / 3' }}></div>;
      case 2:
        return (
          <>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '1 / 1 / 2 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '3 / 3 / 4 / 4' }}></div>
          </>
        );
      case 3:
        return (
          <>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '1 / 1 / 2 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '2 / 2 / 3 / 3' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '3 / 3 / 4 / 4' }}></div>
          </>
        );
      case 4:
        return (
          <>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full shadow-inner" style={{ gridArea: '1 / 1 / 2 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full shadow-inner" style={{ gridArea: '1 / 3 / 2 / 4' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full shadow-inner" style={{ gridArea: '3 / 1 / 4 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-600 rounded-full shadow-inner" style={{ gridArea: '3 / 3 / 4 / 4' }}></div>
          </>
        );
      case 5:
        return (
          <>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '1 / 1 / 2 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '1 / 3 / 2 / 4' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '2 / 2 / 3 / 3' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '3 / 1 / 4 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '3 / 3 / 4 / 4' }}></div>
          </>
        );
      case 6:
        return (
          <>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '1 / 1 / 2 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '1 / 3 / 2 / 4' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '2 / 1 / 3 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '2 / 3 / 3 / 4' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '3 / 1 / 4 / 2' }}></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-black rounded-full shadow-inner" style={{ gridArea: '3 / 3 / 4 / 4' }}></div>
          </>
        );
    }
  };

  return (
    <div 
      className={`
        w-16 h-16 md:w-24 md:h-24 bg-white rounded-xl shadow-[0_4px_0_0_#94a3b8] border-2 border-slate-300
        grid grid-cols-3 grid-rows-3 gap-0.5 p-1 md:p-2 items-center justify-items-center
        ${isRolling ? 'animate-spin' : ''}
      `}
    >
      {renderDots()}
    </div>
  );
};
