
import React from 'react';

interface Props {
  onGoPro: () => void;
}

const ProBanner: React.FC<Props> = ({ onGoPro }) => {
  return (
    <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-6 rounded-2xl text-white shadow-lg">
      <h4 className="font-bold text-lg mb-1">FinanceLite Pro</h4>
      <p className="text-sky-100 text-sm mb-4">Apoie o desenvolvimento e remova todos os anúncios para sempre com um pagamento único.</p>
      <button 
        onClick={onGoPro}
        className="bg-white text-sky-600 px-6 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all"
      >
        Desbloquear Pro - R$ 9,90
      </button>
    </div>
  );
};

export default ProBanner;
