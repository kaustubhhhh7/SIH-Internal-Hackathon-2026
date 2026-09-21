import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock, Building2, Award, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import emblemLogo from '../../assets/images/Emblem_of_India_(Government_Gazette).svg.webp';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log('Login data:', data);
    localStorage.setItem('token', 'mock_jwt_token_for_development');
    const selectedRole = data.role || 'STARTUP';
    localStorage.setItem('userRole', selectedRole);
    
    switch(selectedRole) {
      case 'STARTUP': navigate('/startup/dashboard'); break;
      case 'GOVERNMENT_DEPARTMENT': navigate('/gov/dashboard'); break;
      case 'ADMINISTRATOR': navigate('/admin/dashboard'); break;
      case 'EXPERT_EVALUATOR': navigate('/expert/dashboard'); break;
      case 'INDEPENDENT_VALIDATOR': navigate('/validator/dashboard'); break;
      case 'PROCUREMENT_OFFICER': navigate('/procurement/dashboard'); break;
      default: navigate('/startup/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex flex-col justify-between selection:bg-blue-900 selection:text-white">
      {/* Top Government Strip */}
      <div className="bg-[#0b1f3a] text-white text-xs border-b border-[#1e3a5f] px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold tracking-wider text-amber-400 uppercase">GOVERNMENT OF MAHARASHTRA</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">उद्योग, ऊर्जा व कामगार विभाग (Skill, Employment & Innovation)</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-300 text-[11px]">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span className="text-amber-300 font-medium">Digital India & DPIIT Aligned</span>
          </div>
        </div>
      </div>

      {/* Main Authentication Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl grid md:grid-cols-12 bg-white rounded-xl shadow-[0_12px_40px_rgba(11,31,58,0.12)] border border-gray-200 overflow-hidden">
          
          {/* Left Hero / Government Identity Column */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#0c2340] via-[#103057] to-[#0a1c33] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Tricolor subtle glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              {/* Official State / National Emblem Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <img 
                  src={emblemLogo} 
                  alt="State Emblem of India" 
                  className="h-16 w-auto object-contain brightness-0 invert filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]" 
                />
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">National Single Sign-On</div>
                  <h1 className="text-lg font-bold text-white tracking-tight leading-snug">MahaStartup Innovation Portal</h1>
                  <p className="text-[11px] text-gray-300 font-medium">Govt. of Maharashtra Procurement Gateway</p>
                </div>
              </div>

              {/* Startup & Enterprise Perks List */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-white">DPIIT & MSME Direct Matching</h2>
                    <p className="text-[11px] text-gray-300 leading-relaxed">Direct bid submission for verified high-growth technology startups.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-white">Govt Work Orders & Paid PoCs</h2>
                    <p className="text-[11px] text-gray-300 leading-relaxed">Fast-track pilot sanctioning without typical turnover pre-qualifications.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-white">40+ State Municipalities Connected</h2>
                    <p className="text-[11px] text-gray-300 leading-relaxed">Unified smart governance problem statements across all Maharashtra districts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security / Trust Certification */}
            <div className="pt-8 border-t border-white/10 mt-8">
              <div className="flex items-center gap-2 text-[11px] text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audited for Cyber Security by CERT-In Impaneled Agency</span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-7 p-8 lg:p-10 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to your Dashboard</h2>
              <p className="text-xs text-gray-500 mt-1">Please enter your authorized credentials to proceed to the secure portal</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-gray-700 mb-1">
                  Designated Portal Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="role"
                    {...register("role")}
                    className="w-full text-xs font-medium text-gray-800 bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all cursor-pointer"
                  >
                    <option value="STARTUP">🚀 Startup / Innovator Organization</option>
                    <option value="GOVERNMENT_DEPARTMENT">🏛️ Government Department / Municipal Body</option>
                    <option value="EXPERT_EVALUATOR">🔬 Technical & Financial Expert Evaluator</option>
                    <option value="INDEPENDENT_VALIDATOR">⚖️ Independent Pilot Validator</option>
                    <option value="PROCUREMENT_OFFICER">📑 State Procurement Officer (GeM / Work Orders)</option>
                    <option value="ADMINISTRATOR">🛡️ System Administrator</option>
                  </select>
                </div>
              </div>

              {/* Username or Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address / Authorized User ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  placeholder="e.g. founder@startup.co.in or officer@maharashtra.gov.in"
                  {...register("emailOrUsername", { required: true })}
                  className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all placeholder:text-gray-400"
                  defaultValue="demo@example.com"
                />
                {errors.emailOrUsername && <span className="text-red-500 text-[11px] mt-1 block">Valid credentials are required</span>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                    Secure Password <span className="text-red-500">*</span>
                  </label>
                  <a href="#" className="text-xs font-medium text-blue-800 hover:text-blue-900 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password", { required: true })}
                    className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all"
                    defaultValue="Password123!"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-[11px] mt-1 block">Password is required</span>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-900 focus:ring-blue-800 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-600 cursor-pointer">
                    Remember this device for 30 days
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-[#0c2340] hover:bg-[#143763] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 cursor-pointer"
              >
                Log In To Secure System
              </button>
            </form>

            {/* Registration CTA for Startups */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3.5">
                <div>
                  <div className="text-xs font-bold text-gray-900">Are you a DPIIT-recognized Startup?</div>
                  <div className="text-[11px] text-gray-500">Register in under 5 minutes to submit proposals.</div>
                </div>
                <Link
                  to="/register/startup"
                  className="whitespace-nowrap px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:shadow transition-all text-center"
                >
                  Register Startup
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-4 text-center text-[11px] text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            Website content owned & managed by <strong>Department of Skills, Employment, Entrepreneurship and Innovation, Govt. of Maharashtra</strong>.
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Designed & Engineered by State Digital Innovation Directorate</span>
            <span>•</span>
            <span>Version 2.4.0 (Enterprise)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;

