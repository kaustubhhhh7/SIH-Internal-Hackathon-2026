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
    <div className="min-h-screen bg-[#f1f3f6] py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* National / State Portal Identification Banner */}
        <div className="bg-[#0b1f3a] text-white rounded-t-sm border-t-4 border-amber-500 shadow-sm p-6 mb-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img 
                src={emblemLogo} 
                alt="State Emblem of India" 
                className="h-16 w-auto object-contain brightness-0 invert filter shrink-0 opacity-95" 
              />
              <div className="border-l border-white/20 pl-5">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {t('registerStartup.deptName')}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                  {t('registerStartup.bannerTitle')}
                </h1>
                <p className="text-xs text-slate-300 mt-1 font-normal">
                  {t('registerStartup.bannerSub')}
                </p>
              </div>
            </div>
            
            <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 w-full sm:w-auto justify-between">
              <span className="px-2.5 py-1 rounded-xs bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" /> {t('registerStartup.dpiitSync')}
              </span>
              <Link to="/login" className="text-xs text-blue-200 hover:text-white underline font-medium">
                {t('registerStartup.alreadyRegistered')}
              </Link>
            </div>
          </div>
        </div>

        {/* Structured Stepper Bar */}
        <div className="bg-white border-x border-b border-gray-300 px-6 py-5 shadow-2xs mb-6">
          <div className="grid grid-cols-4 gap-2 relative">
            {[
              { num: 1, label: t('registerStartup.steps.s1') },
              { num: 2, label: t('registerStartup.steps.s2') },
              { num: 3, label: t('registerStartup.steps.s3') },
              { num: 4, label: t('registerStartup.steps.s4') },
            ].map((s) => (
              <div key={s.num} className="flex flex-col sm:flex-row items-center sm:items-center gap-2 text-center sm:text-left">
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    step > s.num 
                      ? 'bg-emerald-700 text-white' 
                      : step === s.num 
                        ? 'bg-[#0b1f3a] text-white ring-2 ring-blue-800 ring-offset-2' 
                        : 'bg-gray-100 text-gray-500 border border-gray-300'
                  }`}
                >
                  {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Step 0{s.num}</div>
                  <div className={`text-xs font-semibold truncate ${step === s.num ? 'text-[#0b1f3a]' : 'text-gray-600'}`}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-300 rounded-sm shadow-2xs">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            
            {/* STEP 1: ORGANISATION DETAILS */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-bold text-gray-900">{t('registerStartup.step1.title')}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Please provide statutory company credentials as registered with DPIIT / MCA.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-y-5 gap-x-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step1.companyName')} <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. Acme DeepTech Innovations Private Limited" {...register("companyName", { required: true })} className={`input-field ${errors.companyName ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.companyName && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.companyNameReq')}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step1.dpiit')} <span className="text-red-500">*</span></label>
                    <input type="text" {...register("dpiit", { required: true, pattern: /^DIPP[0-9]+$/i })} placeholder="e.g. DIPP12345" className={`input-field font-mono uppercase ${errors.dpiit ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.dpiit?.type === 'required' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.dpiitReq')}</span>}
                    {errors.dpiit?.type === 'pattern' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.dpiitPattern')}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step1.pan')} <span className="text-red-500">*</span></label>
                    <input type="text" maxLength={10} {...register("pan", { required: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i })} placeholder="e.g. ABCDE1234F" className={`input-field font-mono uppercase ${errors.pan ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.pan?.type === 'required' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.panReq')}</span>}
                    {errors.pan?.type === 'pattern' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.panPattern')}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step1.authName')} <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rajesh S. Patil"
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, ''); }}
                      {...register("authName", { required: true })} 
                      className={`input-field ${errors.authName ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    />
                    {errors.authName && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.authNameReq')}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step1.mobile')} <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                      {...register("mobile", { required: true, pattern: /^[0-9]{10}$/ })} 
                      placeholder="e.g. 9876543210" 
                      className={`input-field font-mono ${errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    />
                    {errors.mobile?.type === 'required' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.mobileReq')}</span>}
                    {errors.mobile?.type === 'pattern' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.mobilePattern')}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step1.email')} <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="official@startup.in" {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })} className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.email?.type === 'required' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.emailReq')}</span>}
                    {errors.email?.type === 'pattern' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.emailPattern')}</span>}
                  </div>

                  <div className="sm:col-span-2 relative">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step1.password')} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        {...register("password", { required: true, minLength: 8 })} 
                        className={`input-field pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`} 
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password?.type === 'required' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.passwordReq')}</span>}
                    {errors.password?.type === 'minLength' && <span className="text-red-600 text-[11px] mt-1 block">{t('registerStartup.step1.passwordMin')}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TECHNOLOGY CATEGORY */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-bold text-gray-900">{t('registerStartup.step2.title')}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{t('registerStartup.step2.subtitle')}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { key: 'mfg', label: t('registerStartup.step2.cats.mfg'), val: 'Advanced Manufacturing & Robotics' },
                    { key: 'agri', label: t('registerStartup.step2.cats.agri'), val: 'Agriculture Tech & New Foods' },
                    { key: 'ai', label: t('registerStartup.step2.cats.ai'), val: 'Artificial Intelligence / Big Data' },
                    { key: 'cyber', label: t('registerStartup.step2.cats.cyber'), val: 'Cybersecurity' },
                    { key: 'health', label: t('registerStartup.step2.cats.health'), val: 'Health & Life Sciences' },
                    { key: 'clean', label: t('registerStartup.step2.cats.clean'), val: 'CleanTech / Renewables' }
                  ].map((cat) => (
                    <label key={cat.key} className="flex items-center p-3.5 border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors bg-white">
                      <input id={cat.key} type="radio" value={cat.val} {...register("category", { required: true })} className="h-4 w-4 text-[#0b1f3a] focus:ring-blue-800 border-gray-300" />
                      <span className="ml-3 block text-xs font-semibold text-gray-800">{cat.label}</span>
                    </label>
                  ))}
                  <label htmlFor="other" className="sm:col-span-2 flex items-center p-3.5 border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors bg-white">
                    <input id="other" type="radio" value="Other" {...register("category", { required: true })} className="h-4 w-4 text-[#0b1f3a] focus:ring-blue-800 border-gray-300" />
                    <span className="ml-3 block text-xs font-semibold text-gray-800">{t('registerStartup.step2.cats.other')}</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3: STARTUP SOLUTION */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-bold text-gray-900">{t('registerStartup.step3.title')}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Highlight your core proprietary innovation, readiness level, and problem impact.</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step3.solutionName')} <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. AgriSense Edge-AI Soil Sensor System" {...register("solutionName", { required: true })} className="mt-1 input-field" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step3.desc')} <span className="text-red-500">*</span></label>
                    <textarea rows={4} placeholder="Describe the technology architecture, intellectual property, and current deployment scale..." {...register("description", { required: true })} className="mt-1 input-field"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('registerStartup.step3.problem')} <span className="text-red-500">*</span></label>
                    <textarea rows={3} placeholder="Which public service or operational bottle-neck does this solution eliminate?" {...register("problemSolved", { required: true })} className="mt-1 input-field"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SUPPORTING INFORMATION */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-bold text-gray-900">{t('registerStartup.step4.title')}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{t('registerStartup.step4.subtitle')}</p>
                </div>
                
                <div className="mt-4 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-sm bg-gray-50/50 hover:bg-white hover:border-gray-400 transition-colors">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-xs text-gray-600 justify-center items-center gap-1">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white px-2.5 py-1 border border-gray-300 rounded-xs font-semibold text-[#0b1f3a] hover:bg-gray-50 shadow-2xs">
                        <span>{t('registerStartup.step4.uploadFile')}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <span className="text-gray-500">{t('registerStartup.step4.dragDrop')}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-mono">{t('registerStartup.step4.formats')}</p>
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
