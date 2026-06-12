import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const AuthDialog = ({ open, onOpenChange }) => {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await login(fd.get('email'), fd.get('password'));
      toast.success('Welcome back');
      onOpenChange(false);
    } catch (err) { toast.error(err?.response?.data?.detail || 'Login failed'); }
    finally { setLoading(false); }
  };
  const onRegister = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await register(fd.get('email'), fd.get('password'), fd.get('full_name'));
      toast.success('Welcome to Olivia Dante');
      onOpenChange(false);
    } catch (err) { toast.error(err?.response?.data?.detail || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Welcome</DialogTitle>
          <DialogDescription>Sign in or create an account.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" data-testid="auth-tab-login">Sign in</TabsTrigger>
            <TabsTrigger value="register" data-testid="auth-tab-register">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={onLogin} className="space-y-3">
              <input data-testid="login-email" name="email" type="email" required placeholder="Email" className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <input data-testid="login-password" name="password" type="password" required placeholder="Password" className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <button data-testid="login-submit" disabled={loading} className="w-full h-10 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">{loading ? '...' : 'Sign in'}</button>
              <p className="text-xs text-muted-foreground text-center">Default admin: admin@oliviadante.com / Admin@123</p>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={onRegister} className="space-y-3">
              <input data-testid="register-name" name="full_name" placeholder="Full name" className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <input data-testid="register-email" name="email" type="email" required placeholder="Email" className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <input data-testid="register-password" name="password" type="password" required minLength={6} placeholder="Password (min 6)" className="w-full px-3 py-2 rounded-md bg-background border border-input outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <button data-testid="register-submit" disabled={loading} className="w-full h-10 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">{loading ? '...' : 'Create account'}</button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
