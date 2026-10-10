import React, { createContext, useContext, useState, useMemo } from 'react';
import { providers as initialProviders } from '../data/providers';
import { users as initialUsers } from '../data/users';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [providers, setProviders] = useState(initialProviders);
  const [users, setUsers] = useState(initialUsers);

  // Initial pending count from Figma is 14. Track delta from initial data
  const initialPendingInMock = useMemo(
    () => initialProviders.filter((p) => p.status === 'pending').length,
    []
  );

  const initialActiveUsersInMock = useMemo(
    () => initialUsers.filter((u) => u.status === 'active').length,
    []
  );

  const pendingProvidersCount = useMemo(() => {
    const currentPending = providers.filter((p) => p.status === 'pending').length;
    const delta = currentPending - initialPendingInMock;
    return Math.max(0, 14 + delta);
  }, [providers, initialPendingInMock]);

  const activeUsersCount = useMemo(() => {
    const currentActive = users.filter((u) => u.status === 'active').length;
    const delta = currentActive - initialActiveUsersInMock;
    return Math.max(0, 845 + delta);
  }, [users, initialActiveUsersInMock]);

  const metrics = useMemo(
    () => ({
      totalUsers: activeUsersCount,
      usersTrend: '+12% this week',
      totalProviders: 482,
      pendingProviders: pendingProvidersCount,
      bookings: 1490,
      bookingsTrend: '+8% vs last month',
      completed: 1204,
      completedRate: '90% success rate',
    }),
    [activeUsersCount, pendingProvidersCount]
  );

  const approveProvider = (id) => {
    const target = providers.find((p) => p.id === id);
    if (!target) return { success: false, error: 'Provider not found.' };
    if (!target.feePaid) {
      return {
        success: false,
        error: 'Verification fee has not been paid. Cannot approve provider.',
      };
    }

    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'verified' } : p))
    );
    return { success: true };
  };

  const rejectProvider = (id) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );
    return { success: true };
  };

  const updateUserStatus = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    return { success: true };
  };

  const getProviderById = (id) => providers.find((p) => p.id === id);
  const getUserById = (id) => users.find((u) => u.id === id);

  const value = {
    providers,
    users,
    metrics,
    approveProvider,
    rejectProvider,
    updateUserStatus,
    getProviderById,
    getUserById,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
