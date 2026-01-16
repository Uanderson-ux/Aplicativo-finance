
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Expense, MonthData, Category } from './types';
import { 
  STORAGE_KEY, 
  PRO_KEY, 
  getMonthKey, 
  getMonthName, 
} from './constants';
import { AnimatePresence } from 'framer-motion';
import MonthNavigator from './components/MonthNavigator';
import BalanceCard from './components/BalanceCard';
import ExpenseList from './components/ExpenseList';
import AddExpenseModal from './components/AddExpenseModal';
import BannerAd from './components/BannerAd';
import ProBanner from './components/ProBanner';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allData, setAllData] = useState<AppState>({});
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Inicialização
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) setAllData(JSON.parse(savedData));
    
    const savedPro = localStorage.getItem(PRO_KEY);
    if (savedPro === 'true') setIsPro(true);

    const savedDark = localStorage.getItem('financelite_dark_mode');
    if (savedDark === 'true' || (!savedDark && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('financelite_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }, [allData]);

  const monthKey = useMemo(() => getMonthKey(currentDate), [currentDate]);
  
  const currentMonthData: MonthData = useMemo(() => {
    return allData[monthKey] || { salary: 0, expenses: [] };
  }, [allData, monthKey]);

  useEffect(() => {
    if (Notification.permission === "granted") {
      const today = new Date().getDate();
      const dueSoon = currentMonthData.expenses.filter(e => 
        !e.isPaid && e.dueDay && (e.dueDay === today || e.dueDay === today + 1)
      );

      dueSoon.forEach(exp => {
        const title = exp.dueDay === today ? "Vence HOJE!" : "Vence amanhã";
        new Notification(title, {
          body: `A despesa "${exp.name}" no valor de R$ ${exp.value.toFixed(2)} precisa de atenção.`,
          icon: "/favicon.ico"
        });
      });
    }
  }, [monthKey]);

  // CORREÇÃO: Usando update funcional para evitar stale closures
  const updateCurrentMonth = (newData: Partial<MonthData>) => {
    setAllData(prev => {
      const existing = prev[monthKey] || { salary: 0, expenses: [] };
      return {
        ...prev,
        [monthKey]: { ...existing, ...newData }
      };
    });
  };

  const handleSalaryChange = (value: number) => updateCurrentMonth({ salary: value });

  const handleSaveExpense = (name: string, value: number, isRecurrent: boolean, category: Category, dueDay?: number) => {
    setAllData(prev => {
      const updatedAllData = { ...prev };
      const iterations = isRecurrent ? 12 : 1;

      for (let i = 0; i < iterations; i++) {
        const targetDate = new Date(currentDate);
        targetDate.setMonth(targetDate.getMonth() + i);
        const targetKey = getMonthKey(targetDate);

        const targetMonthData = { ...(updatedAllData[targetKey] || { salary: prev[monthKey]?.salary || 0, expenses: [] }) };
        targetMonthData.expenses = [...targetMonthData.expenses];

        if (editingExpense && i === 0) {
          targetMonthData.expenses = targetMonthData.expenses.map(exp => 
            exp.id === editingExpense.id ? { ...exp, name, value, isRecurrent, category, dueDay } : exp
          );
        } else {
          const newInstance: Expense = {
            id: crypto.randomUUID(),
            name,
            value,
            category,
            isPaid: false,
            isRecurrent,
            dueDay
          };
          targetMonthData.expenses.push(newInstance);
        }

        updatedAllData[targetKey] = targetMonthData;
      }
      return updatedAllData;
    });
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingExpense(null);
  };

  const togglePaid = (id: string) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
    
    setAllData(prev => {
      const monthData = prev[monthKey];
      if (!monthData) return prev;
      return {
        ...prev,
        [monthKey]: {
          ...monthData,
          expenses: monthData.expenses.map(exp => 
            exp.id === id ? { ...exp, isPaid: !exp.isPaid } : exp
          )
        }
      };
    });
  };

  const deleteExpense = (id: string) => {
    setAllData(prev => {
      const monthData = prev[monthKey];
      if (!monthData) return prev;
      return {
        ...prev,
        [monthKey]: {
          ...monthData,
          expenses: monthData.expenses.filter(exp => exp.id !== id)
        }
      };
    });
  };

  const handleExportCSV = () => {
    if (currentMonthData.expenses.length === 0) return alert('Sem despesas.');
    const headers = ['Nome', 'Valor', 'Categoria', 'Status', 'Vencimento'];
    const rows = currentMonthData.expenses.map(exp => [
      `"${exp.name}"`, exp.value.toFixed(2), exp.category, exp.isPaid ? 'Pago' : 'Pendente', exp.dueDay || '-'
    ]);
    const csvContent = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financas_${monthKey}.csv`;
    link.click();
  };

  const totalExpenses = useMemo(() => currentMonthData.expenses.reduce((sum, exp) => sum + exp.value, 0), [currentMonthData.expenses]);
  const balance = currentMonthData.salary - totalExpenses;

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto shadow-xl overflow-hidden relative border-x transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-900 text-slate-100' : 'bg-white border-gray-100 text-gray-900'}`}>
      
      <header className="bg-sky-500 text-white p-4 pt-8 shadow-md z-10 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <MonthNavigator 
            monthName={getMonthName(currentDate)} 
            onPrev={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); }} 
            onNext={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); }} 
          />
          <div className="flex items-center space-x-1">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-white/20 transition-all">
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <button onClick={handleExportCSV} className="p-2 rounded-full hover:bg-white/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className={`flex items-center justify-between sticky top-0 py-2 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/80' : 'bg-white/80'} backdrop-blur-sm`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Despesas</h2>
          <button onClick={() => setShowAddModal(true)} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full font-medium shadow-lg transition-all active:scale-95">
            + Nova
          </button>
        </div>

        <ExpenseList 
          expenses={currentMonthData.expenses} 
          onTogglePaid={togglePaid} 
          onEdit={setEditingExpense} 
          isDarkMode={isDarkMode} 
        />
        
        {!isPro && <ProBanner onGoPro={() => { setIsPro(true); localStorage.setItem(PRO_KEY, 'true'); }} />}
        <div className="h-44"></div>
      </main>

      <div className={`border-t shadow-2xl z-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <BalanceCard 
          salary={currentMonthData.salary} 
          totalExpenses={totalExpenses} 
          balance={balance} 
          onSalaryChange={handleSalaryChange} 
          isDarkMode={isDarkMode} 
        />
        {!isPro && <BannerAd isDarkMode={isDarkMode} />}
      </div>

      <AnimatePresence>
        {(showAddModal || editingExpense) && (
          <AddExpenseModal 
            onClose={closeModal} 
            onAdd={handleSaveExpense} 
            onDelete={deleteExpense} 
            expense={editingExpense} 
            isDarkMode={isDarkMode} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
