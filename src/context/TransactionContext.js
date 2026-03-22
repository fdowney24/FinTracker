import { createContext, useContext, useState, useCallback } from 'react';
import { SEED_TRANSACTIONS, getCategoryById } from '../data/data';

// ─────────────────────────────────────────────────────────────────────────────
// TransactionContext — global in-memory store
// ─────────────────────────────────────────────────────────────────────────────
// All CRUD operations live here. In a real app, this would be the only place where we interact with the database.
// ─────────────────────────────────────────────────────────────────────────────

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  // Seed every launch so there is always demo data to explore.

  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);

  // ── SELECT t.*, c.* FROM transactions t
  //          JOIN categories c ON t.categoryId = c.id
  //         ORDER BY t.date DESC
  const getTransactions = useCallback(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(t => ({ ...t, category: getCategoryById(t.categoryId) }));
  }, [transactions]);

  // ── INSERT INTO transactions (amount, description, categoryId, date, type)
  //    VALUES (?, ?, ?, ?, ?)
  const addTransaction = useCallback(({ amount, description, categoryId, date, type }) => {
    const newTx = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      categoryId,
      date,
      type,
    };
    setTransactions(prev => [...prev, newTx]);
    return newTx;
  }, []);

  // ── UPDATE transactions SET amount=?, description=?, categoryId=?, date=?, type=?
  //    WHERE id = ?
  const updateTransaction = useCallback((id, { amount, description, categoryId, date, type }) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, amount: parseFloat(amount), description, categoryId, date, type }
          : t
      )
    );
  }, []);

  // ── DELETE FROM transactions WHERE id = ?
  //    (CASCADE: in SQLite this would remove child rows in related tables)
  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── SELECT strftime('%Y-%m', date) AS month,
  //          type, SUM(amount) AS total
  //     FROM transactions
  //    GROUP BY month, type
  //    ORDER BY month DESC
  const getMonthlySummary = useCallback(() => {
    const map = {};
    for (const t of transactions) {
      const month = t.date.substring(0, 7); // 'YYYY-MM'
      if (!map[month]) map[month] = { month, income: 0, expense: 0 };
      map[month][t.type] += t.amount;
    }
    return Object.values(map).sort((a, b) => b.month.localeCompare(a.month));
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{ getTransactions, addTransaction, updateTransaction, deleteTransaction, getMonthlySummary }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used inside TransactionProvider');
  return ctx;
}
