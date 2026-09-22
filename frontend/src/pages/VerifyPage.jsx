import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import PageWrapper from '../components/layout/PageWrapper';

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();

  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !otp) {
      setError('Please provide your email and the 6-digit code sent to your inbox.');
      return;
    }

    setIsLoading(true);

    try {
      await verifyOtp(email, otp);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-water-gradient">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-sky-100 text-sky-700 mb-2">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-sm text-slate-500">
            We sent a verification code to <span className="font-semibold text-slate-700">{email || 'your email'}</span>.
          </p>
        </div>

        <Card className="p-8">
          {error && <Alert type="danger" message={error} onClose={() => setError(null)} className="mb-6" />}
          {success && (
            <Alert
              type="success"
              title="Verification Successful!"
              message="Your account is active. Redirecting to sign in..."
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!emailParam && (
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            <Input
              label="Verification Code (OTP)"
              type="text"
              placeholder="e.g. 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center text-lg font-bold tracking-widest"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={success}
              icon={ArrowRight}
              className="w-full mt-2"
            >
              Verify Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Didn't receive code?{' '}
            <Link to="/signup" className="font-bold text-sky-600 hover:text-sky-700">
              Resend or change email
            </Link>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default VerifyPage;
