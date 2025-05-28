
import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'manager' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    'dashboard.view',
    'chat.view',
    'chat.manage',
    'whatsapp.view',
    'whatsapp.manage',
    'chatbot.view',
    'chatbot.manage',
    'shopee.view',
    'shopee.manage',
    'admin.view',
    'admin.manage',
    'users.manage',
    'settings.manage'
  ],
  manager: [
    'dashboard.view',
    'chat.view',
    'chat.manage',
    'whatsapp.view',
    'chatbot.view',
    'chatbot.manage',
    'shopee.view',
    'shopee.manage',
    'settings.view'
  ],
  agent: [
    'dashboard.view',
    'chat.view',
    'settings.view'
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'João Atendente',
    email: 'joao@dohoo.com',
    role: 'admin',
    department: 'Suporte'
  });

  const login = async (email: string, password: string) => {
    // Simulação de login - integrar com Supabase depois
    setUser({
      id: '1',
      name: 'João Atendente',
      email,
      role: 'admin',
      department: 'Suporte'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
