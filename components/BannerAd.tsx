
import React from 'react';

interface Props {
  isDarkMode?: boolean;
}

const BannerAd: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <div className={`h-16 flex items-center justify-center border-t w-full shrink-0 transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-100 border-gray-200'
    }`}>
      <div className="text-[10px] flex flex-col items-center">
        <span className={`font-bold px-1 rounded mb-1 ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-400 text-white'}`}>ANÚNCIO</span>
        <span className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>Migre para o Pro para remover propagandas</span>
      </div>
    </div>
  );
};

export default BannerAd;
