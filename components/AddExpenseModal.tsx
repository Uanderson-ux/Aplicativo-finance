
import React, { useState, useEffect } from 'react';
import { Expense, Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onClose: () => void;
  onAdd: (name: string, value: number, isRecurrent: boolean, category: Category, dueDay?: number) => void;
  onDelete?: (id: string) => void;
  expense?: Expense | null;
  isDarkMode?: boolean;
}

const CATEGORIES: Category[] = ['Geral', 'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde'];

const AddExpenseModal: React.FC<Props> = ({ onClose, onAdd, onDelete, expense, isDarkMode }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<Category>('Geral');
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [dueDay, setDueDay] = useState<string>('');

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setValue(expense.value.toString());
      setCategory(expense.category || 'Geral');
      setIsRecurrent(expense.isRecurrent);
      setDueDay(expense.dueDay?.toString() || '');
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && value) {
      onAdd(
        name, 
        parseFloat(value), 
        isRecurrent, 
        category,
        dueDay ? parseInt(dueDay) : undefined
      );
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (expense && onDelete) {
      if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
        onDelete(expense.id);
        onClose();
      }
    }
  };

  const inputClass = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all ${
    isDarkMode 
      ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' 
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
  }`;

  const labelClass = `block text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-colors ${
          isDarkMode ? 'bg-slate-900' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
            {expense ? 'Editar' : 'Nova'} Despesa
          </h3>
          <div className="flex items-center space-x-2">
            {expense && (
              <motion.button 
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete} 
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Excluir Despesa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            )}
            <button 
              type="button"
              onClick={onClose} 
              className="text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Nome</label>
            <input 
              autoFocus
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Valor (R$)</label>
              <input 
                type="number" 
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={inputClass}
              >
                {CATEGORIES.map(c => <option key={c} value={c} className={isDarkMode ? 'bg-slate-800' : ''}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className={labelClass}>Vencimento (Dia)</label>
              <select 
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className={inputClass}
              >
                <option value="" className={isDarkMode ? 'bg-slate-800' : ''}>Nenhum</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className={isDarkMode ? 'bg-slate-800' : ''}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={isRecurrent}
                  onChange={(e) => setIsRecurrent(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500 bg-transparent"
                />
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-gray-600 group-hover:text-gray-800'}`}>Recorrente</span>
              </label>
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4"
          >
            {expense ? 'Salvar Alterações' : 'Adicionar Despesa'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddExpenseModal;
