import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle, Upload, Eye, EyeOff } from 'lucide-react';
import { registerStartup } from '../../services/api/auth';

const RegisterStartup = () => {
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
        alert('Startup registered successfully! You can now log in.');
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
    <div className="min-h-screen bg-gov-gray py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <ShieldCheck className="mx-auto h-12 w-12 text-gov-blue" />
          <h2 className="mt-3 text-page-title text-gov-blue">Startup Registration</h2>
          <p className="mt-2 text-body text-gray-600">Join the Government of Maharashtra Innovation Procurement Portal</p>
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
                  {s === 1 && 'Organisation'}
                  {s === 2 && 'Category'}
                  {s === 3 && 'Solution'}
                  {s === 4 && 'Documents'}
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
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">Organisation Details</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-small font-medium text-gray-700">Company Name</label>
                    <input type="text" {...register("companyName", { required: true })} className={`mt-1 input-field ${errors.companyName ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.companyName && <span className="text-red-500 text-caption mt-1 block">Company Name is required</span>}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-gray-700">DPIIT Recognition Number</label>
                    <input type="text" {...register("dpiit", { required: true, pattern: /^DIPP[0-9]+$/i })} placeholder="e.g. DIPP12345" className={`mt-1 input-field ${errors.dpiit ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.dpiit?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">DPIIT Number is required</span>}
                    {errors.dpiit?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">Must start with DIPP followed by numbers</span>}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-gray-700">PAN Number</label>
                    <input type="text" maxLength={10} {...register("pan", { required: true, pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i })} placeholder="e.g. ABCDE1234F" className={`mt-1 input-field uppercase ${errors.pan ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.pan?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">PAN Number is required</span>}
                    {errors.pan?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">Invalid PAN format</span>}
                  </div>
                  
                  <div>
                    <label className="block text-small font-medium text-gray-700">Authorised Person Name</label>
                    <input 
                      type="text" 
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, ''); }}
                      {...register("authName", { required: true })} 
                      className={`mt-1 input-field ${errors.authName ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    />
                    {errors.authName && <span className="text-red-500 text-caption mt-1 block">Authorised Person Name is required</span>}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-gray-700">Mobile Number</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                      {...register("mobile", { required: true, pattern: /^[0-9]{10}$/ })} 
                      placeholder="e.g. 9876543210" 
                      className={`mt-1 input-field ${errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    />
                    {errors.mobile?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">Mobile Number is required</span>}
                    {errors.mobile?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">Must be exactly 10 digits</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-small font-medium text-gray-700">Email Address (Username)</label>
                    <input type="email" {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })} className={`mt-1 input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} />
                    {errors.email?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">Email is required</span>}
                    {errors.email?.type === 'pattern' && <span className="text-red-500 text-caption mt-1 block">Invalid email format</span>}
                  </div>

                  <div className="sm:col-span-2 relative">
                    <label className="block text-small font-medium text-gray-700">Password</label>
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
                    {errors.password?.type === 'required' && <span className="text-red-500 text-caption mt-1 block">Password is required</span>}
                    {errors.password?.type === 'minLength' && <span className="text-red-500 text-caption mt-1 block">Password must be at least 8 characters</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TECHNOLOGY CATEGORY */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">Technology / Industry Category</h3>
                <p className="text-body text-gray-500">Select the primary category that describes your startup's core technology.</p>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {['Advanced Manufacturing & Robotics', 'Agriculture Tech & New Foods', 'Artificial Intelligence / Big Data', 'Cybersecurity', 'Health & Life Sciences', 'CleanTech / Renewables'].map((cat) => (
                    <div key={cat} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input id={cat} type="radio" value={cat} {...register("category", { required: true })} className="h-4 w-4 text-gov-blue focus:ring-gov-blue border-gray-300" />
                      <label htmlFor={cat} className="ml-3 block text-nav text-gray-700 cursor-pointer">{cat}</label>
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input id="other" type="radio" value="Other" {...register("category", { required: true })} className="h-4 w-4 text-gov-blue focus:ring-gov-blue border-gray-300" />
                    <label htmlFor="other" className="ml-3 block text-nav text-gray-700 cursor-pointer">Other</label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: STARTUP SOLUTION */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">Startup Solution Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-small font-medium text-gray-700">Product / Solution Name</label>
                    <input type="text" {...register("solutionName", { required: true })} className="mt-1 input-field" />
                  </div>
                  
                  <div>
                    <label className="block text-small font-medium text-gray-700">Description</label>
                    <textarea rows={3} {...register("description", { required: true })} className="mt-1 input-field"></textarea>
                  </div>
                  <div>
                    <label className="block text-small font-medium text-gray-700">Problem Solved</label>
                    <textarea rows={3} {...register("problemSolved", { required: true })} className="mt-1 input-field"></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SUPPORTING INFORMATION */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-section-title text-gov-blue border-b pb-2 border-none">Supporting Documents</h3>
                <p className="text-body text-gray-500">Upload your DPIIT Certificate, Company Incorporation document, and any relevant brochures.</p>
                
                <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-body text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gov-blue hover:text-gov-blueLight focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gov-blue">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-caption text-gray-500">PDF, PNG, JPG up to 10MB</p>
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
                    Previous
                  </button>
                ) : (
                  <Link to="/login" className="btn-secondary">Back to Login</Link>
                )}
                
                <button type="submit" className="btn-primary flex items-center" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : (step < 4 ? 'Next Step' : 'Submit Registration')}
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
