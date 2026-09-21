import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log('Login data:', data);
    // Mock login for foundation
    localStorage.setItem('token', 'mock_jwt_token_for_development');
    
    // Assign role based on demo logic or selection
    // For foundation, let's just make them a STARTUP if they don't specify, or let them pick
    const selectedRole = data.role || 'STARTUP';
    localStorage.setItem('userRole', selectedRole);
    
    // Navigate based on role
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
    <div className="min-h-screen bg-gov-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShieldCheck className="w-16 h-16 text-gov-blue" />
        </div>
        <h2 className="mt-6 text-center text-page-title text-gov-blue">
          {t('auth.loginTitle')}
        </h2>
        <p className="mt-2 text-center text-body text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gov-border">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Demo Role Selector just for Phase 1 Foundation Testing */}
            <div>
              <label htmlFor="role" className="block text-small font-medium text-gray-700">
                Login As (Demo Feature)
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  {...register("role")}
                  className="input-field"
                >
                  <option value="STARTUP">Startup</option>
                  <option value="GOVERNMENT_DEPARTMENT">Government Department</option>
                  <option value="EXPERT_EVALUATOR">Expert Evaluator</option>
                  <option value="INDEPENDENT_VALIDATOR">Independent Validator</option>
                  <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-small font-medium text-gray-700">
                Email address or Username
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  {...register("emailOrUsername", { required: true })}
                  className="input-field"
                  defaultValue="demo@example.com"
                />
                {errors.emailOrUsername && <span className="text-red-500 text-caption mt-1">This field is required</span>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-small font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", { required: true })}
                  className="input-field pr-10"
                  defaultValue="Password123!"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && <span className="text-red-500 text-caption mt-1 block">This field is required</span>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gov-blue focus:ring-gov-blue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-small text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-small">
                <a href="#" className="font-medium text-gov-blue hover:text-gov-blueLight">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-nav text-white bg-gov-blue hover:bg-gov-blueLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue"
              >
                {t('common.login')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-small">
                <span className="px-2 bg-white text-gray-500">New to the platform?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register/startup"
                className="w-full flex justify-center py-2 px-4 border border-gov-blue rounded-md shadow-sm text-nav text-gov-blue bg-white hover:bg-gray-50"
              >
                {t('auth.registerStartup')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
