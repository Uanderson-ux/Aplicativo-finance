
import React from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  expenses: Expense[];
  onTogglePaid: (id: string) => void;
  onEdit: (expense: Expense) => void;
  isDarkMode?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    x: -20,
    transition: { duration: 0.2 } 
  }
};

const ExpenseList: React.FC<Props> = ({ expenses, onTogglePaid, onEdit, isDarkMode }) => {
  const today = new Date().getDate();

  if (expenses.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-center py-10 italic ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}
      >
        Nenhuma despesa este mês.
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {expenses.map((expense) => {
          const isOverdue = expense.dueDay && !expense.isPaid && today > expense.dueDay;
          return (
            <motion.div 
              layout
              variants={itemVariants}
              key={expense.id} 
              exit="exit"
              onClick={() => onEdit(expense)}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between p-4 border rounded-xl shadow-sm cursor-pointer transition-all duration-300 ${
                isDarkMode 
                  ? `${isOverdue ? 'bg-red-950/20 border-red-900' : 'bg-slate-900 border-slate-800'} hover:bg-slate-800` 
                  : `${isOverdue ? 'bg-red-50/30 border-red-200' : 'bg-white border-gray-100'} hover:bg-gray-50`
              }`}
            >
              <div className="flex items-center space-x-4">
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => { e.stopPropagation(); onTogglePaid(expense.id); }}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    expense.isPaid 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : isDarkMode ? 'border-slate-700' : 'border-gray-300'
                  }`}
                >
                  <AnimatePresence>
                    {expense.isPaid && (
                      <motion.svg 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium transition-all ${
                      expense.isPaid 
                        ? (isDarkMode ? 'line-through text-slate-600' : 'line-through text-gray-400') 
                        : (isDarkMode ? 'text-slate-200' : 'text-gray-800')
                    }`}>
                      {expense.name}
                    </p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <p className={`text-lg font-bold transition-all ${
                       expense.isPaid 
                         ? (isDarkMode ? 'text-slate-700' : 'text-gray-300') 
                         : (isDarkMode ? 'text-slate-100' : 'text-gray-900')
                     }`}>
                       {formatCurrency(expense.value)}
                     </p>
                     {expense.dueDay && !expense.isPaid && (
                      <span className={`text-[10px] font-bold ${isOverdue ? 'text-red-500' : (isDarkMode ? 'text-slate-500' : 'text-gray-400')}`}>
                        Dia {expense.dueDay}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={isDarkMode ? 'text-slate-700' : 'text-gray-300'}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpenseList;
