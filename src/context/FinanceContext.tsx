import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Expense, TeamMember, Budget, Revenue, FinanceSummary, ExpenseCategory, AdStatus } from '../types';
import { mockExpenses, mockTeamMembers, mockBudgets, mockRevenueEntries } from '../data/finance';

interface FinanceContextType {
  expenses: Expense[];
  teamMembers: TeamMember[];
  budgets: Budget[];
  revenues: Revenue[];
  summary: FinanceSummary;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateExpenseStatus: (id: string, status: AdStatus) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  addRevenue: (revenue: Omit<Revenue, 'id'>) => void;
  deleteRevenue: (id: string) => void;
  updateRevenue: (id: string, revenue: Partial<Revenue>) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, amount: number) => void;
  deleteBudget: (id: string) => void;
  alerts: BudgetAlert[];
  budgetUsage: Record<string, number>;
  getExpensesByCategory: (category: ExpenseCategory) => Expense[];
  getCostsByType: (type: 'publicidade' | 'desenvolvimento') => number;
}

interface BudgetAlert {
  id: string;
  category: string;
  percentage: number;
  status: 'ok' | 'warning' | 'exceeded';
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getMonthYear = () => {
  const now = new Date();
  return { month: now.toLocaleString('pt-BR', { month: 'long' }), year: now.getFullYear() };
};

const calculateSummary = (expenses: Expense[], revenues: Revenue[], budgets: Budget[]): FinanceSummary => {
  const adExpenses = expenses.filter(e => e.category === 'publicidade').reduce((sum, e) => sum + e.amount, 0);
  const devExpenses = expenses.filter(e => ['infraestrutura', 'ferramentas', 'licencas', 'desenvolvimento'].includes(e.category)).reduce((sum, e) => sum + e.amount, 0);
  const teamCosts = expenses.filter(e => e.category === 'salarios').reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = adExpenses + devExpenses + teamCosts;
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const margin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
  const roi = adExpenses > 0 ? (totalRevenue * 0.4) / adExpenses : 0;
  
  const currentBudgets = budgets.filter(b => {
    const { month, year } = getMonthYear();
    return b.month === month && b.year === year;
  });
  const totalBudget = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetRemaining = totalBudget - totalExpenses;

  return { totalExpenses, totalRevenue, margin, roi, budgetRemaining };
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [budgetUsage, setBudgetUsage] = useState<Record<string, number>>({});
  const [summary, setSummary] = useState<FinanceSummary>({ totalExpenses: 0, totalRevenue: 0, margin: 0, roi: 0, budgetRemaining: 0 });

  const parseDates = (data: any) => {
    if (!data) return data;
    const parsed = { ...data };
    if (parsed.expenses) {
      parsed.expenses = parsed.expenses.map((e: any) => ({
        ...e,
        date: new Date(e.date),
        nextDueDate: e.nextDueDate ? new Date(e.nextDueDate) : undefined,
      }));
    }
    if (parsed.revenues) {
      parsed.revenues = parsed.revenues.map((r: any) => ({
        ...r,
        date: new Date(r.date),
      }));
    }
    if (parsed.teamMembers) {
      parsed.teamMembers = parsed.teamMembers.map((m: any) => ({
        ...m,
        startDate: new Date(m.startDate),
      }));
    }
    if (parsed.budgets) {
      parsed.budgets = parsed.budgets.map((b: any) => ({ ...b }));
    }
    return parsed;
  };

  useEffect(() => {
    const stored = localStorage.getItem('financeData');
    if (stored) {
      const data = parseDates(JSON.parse(stored));
      setExpenses(data.expenses || []);
      setTeamMembers(data.teamMembers || []);
      setBudgets(data.budgets || []);
      setRevenues(data.revenues || []);
    } else {
      setExpenses(mockExpenses);
      setTeamMembers(mockTeamMembers);
      setBudgets(mockBudgets);
      setRevenues(mockRevenueEntries);
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0 || teamMembers.length > 0 || budgets.length > 0 || revenues.length > 0) {
      const data = { expenses, teamMembers, budgets, revenues };
      localStorage.setItem('financeData', JSON.stringify(data));
    }
  }, [expenses, teamMembers, budgets, revenues]);

  useEffect(() => {
    setSummary(calculateSummary(expenses, revenues, budgets));
    
    const newAlerts: BudgetAlert[] = [];
    const newBudgetUsage: Record<string, number> = {};
    
    budgets.forEach(budget => {
      const category = budget.category;
      const spent = expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0);
      const percent = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      newBudgetUsage[category] = percent;
      
      if (percent >= 100) {
        newAlerts.push({ id: budget.id, category, percentage: percent, status: 'exceeded' });
      } else if (percent >= 80) {
        newAlerts.push({ id: budget.id, category, percentage: percent, status: 'warning' });
      } else {
        newAlerts.push({ id: budget.id, category, percentage: percent, status: 'ok' });
      }
    });
    setAlerts(newAlerts);
    setBudgetUsage(newBudgetUsage);
  }, [expenses, budgets, revenues]);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId('exp') };
    setExpenses(prev => [...prev, newExpense]);
  }, []);

  const updateExpense = useCallback((id: string, expense: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...expense } : e));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateExpenseStatus = useCallback((id: string, status: AdStatus) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  }, []);

  const addTeamMember = useCallback((member: Omit<TeamMember, 'id'>) => {
    const newMember = { ...member, id: generateId('tm') };
    setTeamMembers(prev => [...prev, newMember]);
  }, []);

  const updateTeamMember = useCallback((id: string, member: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...member } : m));
  }, []);

  const deleteTeamMember = useCallback((id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  }, []);

  const addRevenue = useCallback((revenue: Omit<Revenue, 'id'>) => {
    const newRevenue = { ...revenue, id: generateId('rev') };
    setRevenues(prev => [...prev, newRevenue]);
  }, []);

  const deleteRevenue = useCallback((id: string) => {
    setRevenues(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateRevenue = useCallback((id: string, revenue: Partial<Revenue>) => {
    setRevenues(prev => prev.map(r => r.id === id ? { ...r, ...revenue } : r));
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId('bud') };
    setBudgets(prev => [...prev, newBudget]);
  }, []);

  const updateBudget = useCallback((id: string, amount: number) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, amount } : b));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);

  const getExpensesByCategory = useCallback((category: ExpenseCategory) => {
    return expenses.filter(e => e.category === category);
  }, [expenses]);

  const getCostsByType = useCallback((type: 'publicidade' | 'desenvolvimento') => {
    if (type === 'publicidade') {
      return expenses.filter(e => e.category === 'publicidade').reduce((sum, e) => sum + e.amount, 0);
    }
    return expenses.filter(e => ['infraestrutura', 'ferramentas', 'licencas'].includes(e.category)).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  return (
    <FinanceContext.Provider value={{
      expenses,
      teamMembers,
      budgets,
      revenues,
      summary,
      addExpense,
      updateExpense,
      deleteExpense,
      updateExpenseStatus,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      addRevenue,
      deleteRevenue,
      updateRevenue,
      addBudget,
      updateBudget,
      deleteBudget,
      alerts,
      budgetUsage,
      getExpensesByCategory,
      getCostsByType,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};