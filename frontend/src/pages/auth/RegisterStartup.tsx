import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, CheckCircle, Upload, Eye, EyeOff, Building2, Award, Lock, FileCheck } from 'lucide-react';
import { registerStartup } from '../../services/api/auth';
import emblemLogo from '../../assets/images/Emblem_of_India_(Government_Gazette).svg.webp';

const RegisterStartup = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setApiError(null);
      try {
        await registerStartup({
          companyName: data.companyName,
          username: data.email, // use email as username
          dpiitRecognitionNumber: data.dpiit,
          pan: data.pan.toUpperCase(),
          authorisedPersonName: data.authName,
          mobileNumber: data.mobile,
          email: data.email,
          password: data.password,
          otp: '',
          category: data.category,
          productSolutionName: data.solutionName,
          description: data.description,
          problemSolved: data.problemSolved,
        });
        alert(t('registerStartup.successAlert'));
        navigate('/login');
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
        setApiError(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* National / State Portal Identification Banner */}
        <div className="bg-[#0c2340] text-white rounded-xl shadow-lg border border-[#1e3a5f] p-6 mb-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src={emblemLogo} 
              alt="State Emblem of India" 
              className="h-20 w-auto object-contain brightness-0 invert filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)] shrink-0" 
            />
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                <FileCheck className="w-3.5 h-3.5" /> {t('registerStartup.deptName')}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {t('registerStartup.bannerTitle')}
              </h1>
              <p className="text-xs text-gray-300 mt-1 font-medium">
                {t('registerStartup.bannerSub')}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 text-right">
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> {t('registerStartup.dpiitSync')}
            </span>
            <Link to="/login" className="text-xs text-blue-300 hover:text-white underline">
              {t('registerStartup.alreadyRegistered')}
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= s ? 'bg-gov-blue border-gov-blue text-white' : 'border-gray-300 text-gray-400'}`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                <span className={`text-caption mt-2 ${step >= s ? 'text-gov-blue font-semibold' : 'text-gray-500'}`}>
                  {s === 1 && t('registerStartup.steps.s1')}
                  {s === 2 && t('registerStartup.steps.s2')}
                  {s === 3 && t('registerStartup.steps.s3')}
                  {s === 4 && t('registerStartup.steps.s4')}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-12"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-gov-blue -z-10 -translate-y-12 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gov-border">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10">
            
            {/* STEP 1: ORGANISATION DETAILS */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">{t('registerStartup.step1.title')}</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step1.companyName')}</label>
                    <input type="text" {...register("companyName", { required: true })} className={`mt-1 input-field ${errors.companyName ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.companyName && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.companyNameReq')}</span>}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step1.dpiit')}</label>
                    <input type="text" {...register("dpiit", { required: true, pattern: /^DIPP[0-9]+$/i })} placeholder="e.g. DIPP12345" className={`mt-1 input-field ${errors.dpiit ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.dpiit?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.dpiitReq')}</span>}
                    {errors.dpiit?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.dpiitPattern')}</span>}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step1.pan')}</label>
                    <input type="text" maxLength={10} {...register("pan", { required: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i })} placeholder="e.g. ABCDE1234F" className={`mt-1 input-field uppercase ${errors.pan ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.pan?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.panReq')}</span>}
                    {errors.pan?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.panPattern')}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step1.authName')}</label>
                    <input 
                      type="text" 
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, ''); }}
                      {...register("authName", { required: true })} 
                      className={`mt-1 input-field ${errors.authName ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    />
                    {errors.authName && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.authNameReq')}</span>}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step1.mobile')}</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                      {...register("mobile", { required: true, pattern: /^[0-9]{10}$/ })} 
                      placeholder="e.g. 9876543210" 
                      className={`mt-1 input-field ${errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    />
                    {errors.mobile?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.mobileReq')}</span>}
                    {errors.mobile?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.mobilePattern')}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step1.email')}</label>
                    <input type="email" {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })} className={`mt-1 input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.email?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.emailReq')}</span>}
                    {errors.email?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.emailPattern')}</span>}
                  </div>

                  <div className="sm:col-span-2 relative">
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step1.password')}</label>
                    <div className="mt-1 relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        {...register("password", { required: true, minLength: 8 })} 
                        className={`input-field pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`} 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.passwordReq')}</span>}
                    {errors.password?.type === 'minLength' && <span className="text-red-500 text-caption mt-1 block">{t('registerStartup.step1.passwordMin')}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TECHNOLOGY CATEGORY */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">{t('registerStartup.step2.title')}</h3>
                <p className="text-body text-gray-500">{t('registerStartup.step2.subtitle')}</p>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { key: 'mfg', label: t('registerStartup.step2.cats.mfg'), val: 'Advanced Manufacturing & Robotics' },
                    { key: 'agri', label: t('registerStartup.step2.cats.agri'), val: 'Agriculture Tech & New Foods' },
                    { key: 'ai', label: t('registerStartup.step2.cats.ai'), val: 'Artificial Intelligence / Big Data' },
                    { key: 'cyber', label: t('registerStartup.step2.cats.cyber'), val: 'Cybersecurity' },
                    { key: 'health', label: t('registerStartup.step2.cats.health'), val: 'Health & Life Sciences' },
                    { key: 'clean', label: t('registerStartup.step2.cats.clean'), val: 'CleanTech / Renewables' }
                  ].map((cat) => (
                    <div key={cat.key} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input id={cat.key} type="radio" value={cat.val} {...register("category", { required: true })} className="h-4 w-4 text-gov-blue focus:ring-gov-blue border-gray-300" />
                      <label htmlFor={cat.key} className="ml-3 block text-nav text-gray-700 cursor-pointer">{cat.label}</label>
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input id="other" type="radio" value="Other" {...register("category", { required: true })} className="h-4 w-4 text-gov-blue focus:ring-gov-blue border-gray-300" />
                    <label htmlFor="other" className="ml-3 block text-nav text-gray-700 cursor-pointer">{t('registerStartup.step2.cats.other')}</label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: STARTUP SOLUTION */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">{t('registerStartup.step3.title')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step3.solutionName')}</label>
                    <input type="text" {...register("solutionName", { required: true })} className="mt-1 input-field" />
                  </div>
                  
                  <div>
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step3.desc')}</label>
                    <textarea rows={3} {...register("description", { required: true })} className="mt-1 input-field"></textarea>
                  </div>
                  <div>
                    <label className="block text-small font-medium text-gray-700">{t('registerStartup.step3.problem')}</label>
                    <textarea rows={3} {...register("problemSolved", { required: true })} className="mt-1 input-field"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SUPPORTING INFORMATION */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">{t('registerStartup.step4.title')}</h3>
                <p className="text-body text-gray-500">{t('registerStartup.step4.subtitle')}</p>
                
                <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-body text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gov-blue hover:text-gov-blueLight focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gov-blue">
                        <span>{t('registerStartup.step4.uploadFile')}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">{t('registerStartup.step4.dragDrop')}</p>
                    </div>
                    <p className="text-caption text-gray-500">{t('registerStartup.step4.formats')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 pt-5 border-t border-gray-200">
              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {apiError}
                </div>
              )}
              <div className="flex justify-between">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary" disabled={isSubmitting}>
                    {t('registerStartup.nav.previous')}
                  </button>
                ) : (
                  <Link to="/login" className="btn-secondary">{t('registerStartup.nav.backToLogin')}</Link>
                )}
                
                <button type="submit" className="btn-primary flex items-center" disabled={isSubmitting}>
                  {isSubmitting ? t('registerStartup.nav.submitting') : (step < 4 ? t('registerStartup.nav.nextStep') : t('registerStartup.nav.submitReg'))}
                  {!isSubmitting && step < 4 && <ArrowRight className="ml-2 w-4 h-4" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStartup;
