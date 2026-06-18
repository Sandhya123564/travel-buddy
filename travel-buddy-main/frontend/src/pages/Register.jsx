import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { Plane, Mail, Lock, Phone, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, verifyOTP } = useAuth();
  
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'traveler'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        role: formData.role
      });
      
      toast.success('Account created! Please verify your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(formData.email, otp);
      toast.success('Email verified successfully!');
      
      // Redirect based on role
      if (formData.role === 'buddy') {
        navigate('/buddy/dashboard');
      } else {
        navigate('/traveler/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authAPI.resendOTP(formData.email);
      toast.success('New code sent to your email');
    } catch (err) {
      toast.error('Failed to resend code');
    }
  };

  const handleSkipVerification = () => {
    toast.info('You can verify your email later from settings');
    if (formData.role === 'buddy') {
      navigate('/buddy/dashboard');
    } else {
      navigate('/traveler/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4" data-testid="register-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-heading font-bold">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span>Travel<span className="text-primary-600">Buddy</span></span>
          </Link>
        </div>

        <Card className="bg-white rounded-2xl border border-slate-100 card-shadow">
          {step === 1 ? (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
                <CardDescription>Join TravelBuddy today</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" data-testid="register-error">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  {/* Role Selection */}
                  <div>
                    <Label className="mb-3 block">I want to</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label
                        htmlFor="traveler"
                        className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.role === 'traveler' 
                            ? 'border-primary-600 bg-primary-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <RadioGroupItem value="traveler" id="traveler" className="sr-only" />
                        <User className={`w-6 h-6 mb-2 ${formData.role === 'traveler' ? 'text-primary-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${formData.role === 'traveler' ? 'text-primary-600' : 'text-slate-600'}`}>
                          Find a Buddy
                        </span>
                      </Label>
                      <Label
                        htmlFor="buddy"
                        className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.role === 'buddy' 
                            ? 'border-primary-600 bg-primary-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <RadioGroupItem value="buddy" id="buddy" className="sr-only" />
                        <Plane className={`w-6 h-6 mb-2 ${formData.role === 'buddy' ? 'text-primary-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${formData.role === 'buddy' ? 'text-primary-600' : 'text-slate-600'}`}>
                          Become a Buddy
                        </span>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 h-12"
                        required
                        data-testid="register-email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 h-12"
                        data-testid="register-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 h-12"
                        required
                        data-testid="register-password"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10 h-12"
                        required
                        data-testid="register-confirm-password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary-600 hover:bg-primary-700 rounded-xl btn-primary-shadow"
                    disabled={loading}
                    data-testid="register-submit"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-medium hover:underline" data-testid="login-link">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <CardTitle className="font-heading text-2xl">Verify Your Email</CardTitle>
                <CardDescription>
                  We sent a 6-digit code to<br />
                  <span className="font-medium text-foreground">{formData.email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4" data-testid="otp-error">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex justify-center mb-6">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    data-testid="otp-input"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  className="w-full h-12 bg-primary-600 hover:bg-primary-700 rounded-xl btn-primary-shadow mb-4"
                  disabled={loading}
                  data-testid="verify-otp-btn"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Email
                    </>
                  )}
                </Button>

                <div className="text-center space-y-3">
                  <button
                    onClick={handleResendOTP}
                    className="text-sm text-primary-600 hover:underline"
                    data-testid="resend-otp-btn"
                  >
                    Didn't receive the code? Resend
                  </button>
                  <br />
                  <button
                    onClick={handleSkipVerification}
                    className="text-sm text-slate-500 hover:text-slate-700"
                    data-testid="skip-verification-btn"
                  >
                    Skip for now
                  </button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
