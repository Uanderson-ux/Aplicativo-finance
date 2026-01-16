
import React from 'react';
import { formatCurrency } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  salary: number;
  totalExpenses: number;
  balance: number;
  onSalaryChange: (value: number) => void;
  isDarkMode?: boolean;
}

const BalanceCard: React.FC<Props> = ({ salary, totalExpenses, balance, onSalaryChange, isDarkMode }) => {
  const percentageUsed = salary > 0 ? Math.min((totalExpenses / salary) * 100, 100) : 0;
  
  const getProgressColor = () => {
    if (percentageUsed > 90) return 'bg-red-500';
    if (percentageUsed > 70) return 'bg-orange-500';
    return 'bg-sky-500';
  };

  return (
    <div className={`p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
            Salário Mensal
          </label>
          <div className="relative">
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 font-bold text-sm ${isDarkMode ? 'text-sky-600' : 'text-sky-400'}`}>R$</span>
            <input 
              type="number" 
              value={salary || ''}
              onChange={(e) => onSalaryChange(Number(e.target.value))}
              placeholder="0,00"
              className={`w-full bg-transparent border-b outline-none pl-6 py-1 text-lg font-semibold transition-colors ${
                isDarkMode ? 'border-slate-800 focus:border-sky-500 text-slate-100' : 'border-sky-100 focus:border-sky-500 text-sky-900'
              }`}
            />
          </div>
        </div>

        <div className="col-span-1">
          <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
            Total Despesas
          </label>
          <motion.div 
            key={totalExpenses}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg font-bold py-1 border-b border-transparent ${isDarkMode ? 'text-slate-400' : 'text-gray-700'}`}
          >
            {formatCurrency(totalExpenses)}
          </motion.div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>Uso da Renda</span>
          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{Math.round(percentageUsed)}%</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentageUsed}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className={`h-full ${getProgressColor()}`}
          ></motion.div>
        </div>
      </div>
      
      <motion.div 
        animate={{ scale: balance < 0 ? [1, 1.02, 1] : 1 }}
        transition={{ repeat: balance < 0 ? Infinity : 0, duration: 1.5 }}
        className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${isDarkMode ? 'bg-sky-950/30' : 'bg-sky-50'}`}
      >
        <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-sky-400' : 'text-sky-700'}`}>
          Saldo Restante
        </label>
        <div className={`text-2xl font-black ${balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
          {formatCurrency(balance)}
        </div>
      </motion.div>
    </div>
  );
};

export default BalanceCard;
