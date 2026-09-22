import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, Shield, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import PageWrapper from '../components/layout/PageWrapper';

export function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' | 'asha_worker' | 'admin'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, role);
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-water-gradient">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-xl shadow-sky-600/20 mb-2">
            <Droplets className="w-7 h-7 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-sm text-slate-500">
            Join the public health network and start analyzing water safety.
          </p>
        </div>

        <Card className="p-8">
          {error && <Alert type="danger" message={error} onClose={() => setError(null)} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Account Purpose
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === 'user'
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 text-sky-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-sky-600 mb-1" />
                  <p className="text-xs font-bold">Personal / Household</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Check water for family</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('asha_worker')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === 'asha_worker' || role === 'admin'
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 text-sky-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Shield className="w-5 h-5 text-sky-600 mb-1" />
                  <p className="text-xs font-bold">Health Officer / Bulk</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Surveillance & CSV checks</p>
                </button>
              </div>

              {/* Admin toggle if health worker selected */}
              {(role === 'asha_worker' || role === 'admin') && (
                <div className="pt-1 flex items-center justify-end">
                  <label className="text-xs text-slate-500 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.checked ? 'admin' : 'asha_worker')}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>Administrator privilege request</span>
                  </label>
                </div>
              )}
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Minimum 6 characters"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={ArrowRight}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-sky-600 hover:text-sky-700">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default SignUpPage;
