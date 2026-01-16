
import React from 'react';

interface Props {
  monthName: string;
  onPrev: () => void;
  onNext: () => void;
}

const MonthNavigator: React.FC<Props> = ({ monthName, onPrev, onNext }) => {
  return (
    <div className="flex items-center flex-1 space-x-4">
      <button 
        onClick={onPrev}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Mês Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <h1 className="text-xl font-semibold uppercase tracking-wider text-center flex-1">{monthName}</h1>
      
      <button 
        onClick={onNext}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Próximo Mês"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default MonthNavigator;
