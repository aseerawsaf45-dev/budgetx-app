import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tour, Expense, Contributor } from '../types';
import * as Crypto from 'expo-crypto';

interface StoreState {
  tours: Tour[];
  currentTourId: string | null;
  setCurrentTourId: (id: string | null) => void;
  addTour: (tour: Omit<Tour, 'id' | 'createdAt' | 'expenses'>) => void;
  updateTour: (id: string, tour: Partial<Tour>) => void;
  deleteTour: (id: string) => void;
  addExpense: (tourId: string, expense: Omit<Expense, 'id'>) => void;
  updateExpense: (tourId: string, expenseId: string, expense: Partial<Expense>) => void;
  deleteExpense: (tourId: string, expenseId: string) => void;
  addContributor: (tourId: string, contributor: Omit<Contributor, 'id'>) => void;
  removeContributor: (tourId: string, contributorId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tours: [],
      currentTourId: null,

      setCurrentTourId: (id) => set({ currentTourId: id }),

      addTour: (tourData) => set((state) => {
        const newTour: Tour = {
          ...tourData,
          id: Crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          expenses: [],
          contributors: tourData.contributors || [],
        };
        return {
          tours: [newTour, ...state.tours],
          currentTourId: newTour.id,
        };
      }),

      updateTour: (id, tourData) => set((state) => ({
        tours: state.tours.map(t => t.id === id ? { ...t, ...tourData } : t)
      })),

      deleteTour: (id) => set((state) => ({
        tours: state.tours.filter(t => t.id !== id),
        currentTourId: state.currentTourId === id ? null : state.currentTourId,
      })),

      addExpense: (tourId, expenseData) => set((state) => ({
        tours: state.tours.map(t => {
          if (t.id === tourId) {
            return {
              ...t,
              expenses: [...t.expenses, { ...expenseData, id: Crypto.randomUUID() }]
            };
          }
          return t;
        })
      })),

      updateExpense: (tourId, expenseId, expenseData) => set((state) => ({
        tours: state.tours.map(t => {
          if (t.id === tourId) {
            return {
              ...t,
              expenses: t.expenses.map(e => e.id === expenseId ? { ...e, ...expenseData } : e)
            };
          }
          return t;
        })
      })),

      deleteExpense: (tourId, expenseId) => set((state) => ({
        tours: state.tours.map(t => {
          if (t.id === tourId) {
            return {
              ...t,
              expenses: t.expenses.filter(e => e.id !== expenseId)
            };
          }
          return t;
        })
      })),

      addContributor: (tourId, contributorData) => set((state) => ({
        tours: state.tours.map(t => {
          if (t.id === tourId) {
            return {
              ...t,
              contributors: [...t.contributors, { ...contributorData, id: Crypto.randomUUID() }]
            };
          }
          return t;
        })
      })),

      removeContributor: (tourId, contributorId) => set((state) => ({
        tours: state.tours.map(t => {
          if (t.id === tourId) {
            return {
              ...t,
              contributors: t.contributors.filter(c => c.id !== contributorId)
            };
          }
          return t;
        })
      })),
    }),
    {
      name: 'budgetx-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
