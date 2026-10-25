import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tour, Expense, Contributor } from '../types';
import { ThemeId, syncGlobalColors } from '../constants/theme';
import * as Crypto from 'expo-crypto';

interface StoreState {
  tours: Tour[];
  currentTourId: string | null;
  theme: ThemeId;
  setCurrentTourId: (id: string | null) => void;
  setTheme: (theme: ThemeId) => void;
  addTour: (tour: Omit<Tour, 'id' | 'createdAt' | 'expenses'> & { expenses?: Expense[] }) => void;
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
      theme: 'valley',

      setCurrentTourId: (id) => set({ currentTourId: id }),
      setTheme: (theme) => {
        syncGlobalColors(theme);
        set({ theme });
      },

      addTour: (tourData) => set((state) => {
        const newTourId = Crypto.randomUUID();
        // Map contributor IDs so imported expenses stay matched with their contributors
        const idMap: Record<string, string> = {};
        const contributors = (tourData.contributors || []).map(c => {
          const newId = Crypto.randomUUID();
          idMap[c.id] = newId;
          return { ...c, id: newId };
        });

        const expenses = (tourData.expenses || []).map(e => {
          const newPaidBy: Record<string, number> = {};
          if (e.paidBy) {
            Object.entries(e.paidBy).forEach(([oldId, amt]) => {
              const mappedId = idMap[oldId] || oldId;
              newPaidBy[mappedId] = amt;
            });
          }
          const newSplitAmong = (e.splitAmong || []).map(oldId => idMap[oldId] || oldId);

          const newSplitValues: Record<string, number> = {};
          if (e.splitValues) {
            Object.entries(e.splitValues).forEach(([oldId, amt]) => {
              const mappedId = idMap[oldId] || oldId;
              newSplitValues[mappedId] = amt;
            });
          }

          const newGivingShares: Record<string, string[]> = {};
          if (e.givingShares) {
            Object.entries(e.givingShares).forEach(([oldPayerId, beneficiaries]) => {
              const mappedPayerId = idMap[oldPayerId] || oldPayerId;
              newGivingShares[mappedPayerId] = (beneficiaries || []).map(bId => idMap[bId] || bId);
            });
          }

          return {
            ...e,
            id: Crypto.randomUUID(),
            tourId: newTourId,
            paidBy: newPaidBy,
            splitAmong: newSplitAmong,
            splitValues: Object.keys(newSplitValues).length > 0 ? newSplitValues : undefined,
            givingShares: Object.keys(newGivingShares).length > 0 ? newGivingShares : undefined,
          };
        });

        const newTour: Tour = {
          ...tourData,
          id: newTourId,
          createdAt: new Date().toISOString(),
          expenses,
          contributors,
        };
        return {
          tours: [newTour, ...state.tours],
          currentTourId: newTour.id,
        };
      }),

      updateTour: (id, tourData) => set((state) => ({
        tours: state.tours.map(t => t.id === id ? { ...t, ...tourData } : t)
      })),

      deleteTour: (id) => set((state) => {
        const remaining = state.tours.filter(t => t.id !== id);
        return {
          tours: remaining,
          currentTourId: state.currentTourId === id ? (remaining[0]?.id || null) : state.currentTourId,
        };
      }),

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
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          syncGlobalColors(state.theme);
        }
      },
    }
  )
);
