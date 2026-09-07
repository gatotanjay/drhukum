import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { User, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/adminApi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ title: 'User ID & password wajib diisi', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await adminApi.login(username, password, remember);
      navigate('/admin');
    } catch (err) {
      toast({ title: 'Login gagal', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: 'Lupa password?',
      description: 'Hubungi admin lain atau developer untuk reset password akun kamu.',
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - DR.HUKUM</title>
      </Helmet>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Panel kiri — citra & pesan merek */}
        <div className="relative hidden lg:flex lg:w-[55%] overflow-hidden">
          <img
            src="/law.jpg"
            alt="Patung Dewi Keadilan"
            className="absolute inset-0 w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c]/95 via-[#0a0f1c]/80 to-[#0a0f1c]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/70 via-transparent to-[#0a0f1c]/40" />

          {/* Garis dekoratif emas */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none">
            <line x1="70%" y1="0%" x2="90%" y2="14%" stroke="#C9A24B" strokeWidth="1.5" />
            <line x1="85%" y1="0%" x2="100%" y2="10%" stroke="#C9A24B" strokeWidth="1.5" />
            <line x1="60%" y1="72%" x2="80%" y2="88%" stroke="#C9A24B" strokeWidth="1.5" />
            <line x1="88%" y1="80%" x2="100%" y2="96%" stroke="#C9A24B" strokeWidth="1.5" />
          </svg>

          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
            <div>
              <h2 className="text-2xl xl:text-3xl font-serif tracking-wide text-[#D4AF5A]">DR.HUKUM</h2>
              <p className="text-xs xl:text-sm text-gray-300 tracking-wide mt-0.5">Legal Consultant And Attorney At Law</p>
            </div>

            <div className="max-w-lg">
              <h1 className="font-serif leading-[1.1] text-4xl xl:text-5xl">
                <span className="block">Your Trusted.</span>
                <span className="block text-[#D4AF5A]">Legal Advisor.</span>
                <span className="block">in Bali.</span>
              </h1>
              <div className="w-16 h-1 bg-[#D4AF5A] my-6" />
              <p className="text-gray-300 text-base leading-relaxed">
                Solusi hukum komprehensif untuk melindungi hak dan kepentingan Anda.
                Dengan pengalaman lebih dari 10 tahun, kami siap membantu menyelesaikan
                berbagai permasalahan hukum Anda.
              </p>
            </div>

            <div />
          </div>
        </div>

        {/* Panel kanan — form login */}
        <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 p-8 sm:p-10">
              {/* Brand */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <img src="/logo.png" alt="DR.HUKUM" className="h-11 w-auto object-contain" />
                </div>
                <div className="w-10 h-0.5 bg-[#D4AF5A] mb-4" />
                <p className="text-[11px] font-semibold tracking-[0.15em] text-[#B8923F] mb-6">
                  SECURE ACCESS PORTAL
                </p>

                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-500 mt-1 mb-8">Please Sign In to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="User ID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#0a0f1c] focus:ring-[#D4AF5A]"
                    />
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#B8923F] hover:text-[#9c7b30] font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0a0f1c] hover:bg-[#141b2e] text-white font-semibold tracking-wide py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'MEMPROSES...' : 'LOGIN'}
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-7 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4 text-[#D4AF5A]" />
                Your Information is protected and secure with us
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
