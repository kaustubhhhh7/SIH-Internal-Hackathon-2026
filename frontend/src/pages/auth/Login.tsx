import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { login, getMyProfile } from '../../services/api/auth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      // Attempt real database login
      const res = await login({
        emailOrUsername: data.emailOrUsername,
        password: data.password
      });

      if (res.accessToken) {
        localStorage.setItem('token', res.accessToken);
        
        // Fetch user info from database
        try {
          const userRes = await getMyProfile();
          const primaryRole = userRes?.data?.roles?.[0] || data.role || 'STARTUP';
          localStorage.setItem('userRole', primaryRole);
          if (userRes?.data?.startupProfile) {
            localStorage.setItem('startupProfile', JSON.stringify(userRes.data.startupProfile));
          }
          
          switch(primaryRole) {
            case 'STARTUP': navigate('/startup/dashboard'); break;
            case 'GOVERNMENT_DEPARTMENT': navigate('/gov/dashboard'); break;
            case 'ADMINISTRATOR': navigate('/admin/dashboard'); break;
            case 'EXPERT_EVALUATOR': navigate('/expert/dashboard'); break;
            case 'INDEPENDENT_VALIDATOR': navigate('/validator/dashboard'); break;
            case 'PROCUREMENT_OFFICER': navigate('/procurement/dashboard'); break;
            default: navigate('/startup/dashboard');
          }
          return;
        } catch (e) {
          // Token saved, continue navigation based on selection
        }
      }
      
      const selectedRole = data.role || 'STARTUP';
      localStorage.setItem('userRole', selectedRole);
      navigate('/startup/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please verify your email and password.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f3f4f8] h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgba(11,31,58,0.08)] border border-gray-200 p-5 sm:p-6 my-auto">
          
          <div className="mb-3 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{t('auth.signInTitle')}</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">{t('auth.signInSubtitle')}</p>
          </div>

            <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.designatedRole')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="role"
                    {...register("role")}
                    className="w-full text-xs font-medium text-gray-800 bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all cursor-pointer"
                  >
                    <option value="STARTUP">{t('auth.roles.startup')}</option>
                    <option value="GOVERNMENT_DEPARTMENT">{t('auth.roles.gov')}</option>
                    <option value="EXPERT_EVALUATOR">{t('auth.roles.expert')}</option>
                    <option value="INDEPENDENT_VALIDATOR">{t('auth.roles.validator')}</option>
                    <option value="PROCUREMENT_OFFICER">{t('auth.roles.procurement')}</option>
                    <option value="ADMINISTRATOR">{t('auth.roles.admin')}</option>
                  </select>
                </div>
              </div>

              {/* Username or Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.emailLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...register("emailOrUsername", { required: true })}
                  className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all placeholder:text-gray-400"
                  defaultValue="demo@example.com"
                />
                {errors.emailOrUsername && <span className="text-red-500 text-[11px] mt-1 block">{t('auth.emailRequired')}</span>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                    {t('auth.passwordLabel')} <span className="text-red-500">*</span>
                  </label>
                  <a href="#" className="text-xs font-medium text-blue-800 hover:text-blue-900 hover:underline">
                    {t('auth.forgotPassword')}
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
                {errors.password && <span className="text-red-500 text-[11px] mt-1 block">{t('auth.passwordRequired')}</span>}
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
                    {t('auth.rememberMe')}
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-[#0c2340] hover:bg-[#143763] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? t('auth.authenticating') : t('auth.loginBtn')}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div>
                  <div className="text-xs font-bold text-gray-900">{t('auth.startupPrompt')}</div>
                  <div className="text-[11px] text-gray-500">{t('auth.startupPromptSub')}</div>
                </div>
                <Link
                  to="/register/startup"
                  className="whitespace-nowrap px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:shadow transition-all text-center"
                >
                  {t('auth.registerBtn')}
                </Link>
              </div>
            </div>

        </div>
      </div>
    );
};

export default Login;

