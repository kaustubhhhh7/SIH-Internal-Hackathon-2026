import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Building, MapPin, Target, Bookmark, BookmarkCheck, ArrowRight, Shield, Database, Users, CheckCircle } from 'lucide-react';
import { startupChallengeApi, govChallengeApi } from '../../services/api/challenges';

const ChallengeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const userRole = localStorage.getItem('userRole');

  const { data: challenge, isLoading, error, refetch } = useQuery({
    queryKey: ['challenge', id, userRole],
    queryFn: () => userRole === 'GOVERNMENT_DEPARTMENT' 
      ? govChallengeApi.getChallenge(id!)
      : startupChallengeApi.getChallenge(id!),
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: () => challenge?.isSaved ? startupChallengeApi.unsaveChallenge(id!) : startupChallengeApi.saveChallenge(id!),
    onSuccess: () => refetch()
  });

  const applyMutation = useMutation({
    mutationFn: () => startupChallengeApi.applyForChallenge(id!),
    onSuccess: (data) => {
      // In a real app, navigate to application form
      alert('Draft application started! ID: ' + data.applicationId);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to start application');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center shadow-sm max-w-2xl mx-auto mt-8">
        <h3 className="font-bold text-lg mb-1">Challenge Not Found</h3>
        <p>This challenge may have been removed or you don't have permission to view it.</p>
        <button onClick={() => navigate('/startup/challenges')} className="mt-4 text-gov-blue hover:underline font-medium">
          Back to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gov-blue to-indigo-700 p-8 text-white relative">
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-caption">
              {challenge.sector}
            </span>
            <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-caption font-mono">
              {challenge.challengeReferenceNumber}
            </span>
          </div>
          
          <h1 className="text-hero-title mt-4 mb-4 pr-12 text-white drop-shadow-md">
            {challenge.titleEnglish}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-body text-blue-50">
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-2 opacity-70" />
              <span className="font-medium">{challenge.departmentName}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 opacity-70" />
              <span>{challenge.geographicScope || 'Maharashtra'}</span>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 opacity-70" />
              <span>{challenge.targetBeneficiaries || 'Citizens'}</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-6 text-small">
            <div>
              <span className="text-gray-500 block mb-0.5">Published</span>
              <span className="font-semibold text-gray-900">
                {challenge.publishedAt ? new Date(challenge.publishedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Deadline</span>
              <span className="font-semibold text-red-600">
                {challenge.submissionClosingDate ? new Date(challenge.submissionClosingDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {challenge.estimatedBudget && (
              <div>
                <span className="text-gray-500 block mb-0.5">Est. Budget</span>
                <span className="font-semibold text-green-600">₹{challenge.estimatedBudget.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
            <button 
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-nav focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue transition-colors
                ${challenge.isSaved 
                  ? 'border-gov-blue text-gov-blue bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
            >
              {challenge.isSaved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
              {challenge.isSaved ? 'Saved' : 'Save for Later'}
            </button>
            
            <button
              onClick={() => applyMutation.mutate()}
              disabled={applyMutation.isPending || challenge.hasApplied || challenge.status !== 'ApplicationsOpen'}
              className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-nav text-white bg-gov-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue disabled:opacity-50 transition-colors"
            >
              {challenge.hasApplied ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Applied</>
              ) : (
                <>Start Application <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </div>
        </div>
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 text-small text-center border-b border-red-100">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-section-title mb-4">Problem Statement</h2>
            <div className="prose max-w-none text-body text-gray-700">
              <p className="whitespace-pre-wrap">{challenge.problemStatementEnglish}</p>
            </div>
            
            {challenge.backgroundEnglish && (
              <>
                <h3 className="text-card-title mt-6 mb-3">Background & Context</h3>
                <div className="prose max-w-none text-body text-gray-700">
                  <p className="whitespace-pre-wrap">{challenge.backgroundEnglish}</p>
                </div>
              </>
            )}
            
            {challenge.currentSituation && (
              <>
                <h3 className="text-card-title mt-6 mb-3">Current Situation</h3>
                <div className="prose max-w-none text-body text-gray-700">
                  <p className="whitespace-pre-wrap">{challenge.currentSituation}</p>
                </div>
              </>
            )}
          </div>

          <div className="card">
            <h2 className="text-section-title mb-4">Desired Outcomes & Deliverables</h2>
            <div className="prose max-w-none text-body text-gray-700">
              <p className="whitespace-pre-wrap">{challenge.desiredOutcomeEnglish}</p>
            </div>
            
            {challenge.expectedDeliverables && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-card-title text-gov-blue mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Expected Deliverables
                </h4>
                <p className="text-body text-gray-700 whitespace-pre-wrap">{challenge.expectedDeliverables}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-section-title mb-4">Technical & Functional Requirements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-card-title text-gray-800 mb-2">Functional</h4>
                <p className="text-body text-gray-600 whitespace-pre-wrap">{challenge.functionalRequirements || 'Standard portal requirements apply.'}</p>
              </div>
              <div>
                <h4 className="text-card-title text-gray-800 mb-2">Technical</h4>
                <p className="text-body text-gray-600 whitespace-pre-wrap">{challenge.technicalRequirements || 'Standard portal requirements apply.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card bg-gray-50 border-gray-200">
            <h3 className="text-card-title mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gov-blue" />
              Pilot Requirements
            </h3>
            <ul className="space-y-3 text-small">
              <li className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Pilot Required</span>
                <span className="font-medium text-gray-900">{challenge.pilotRequirement ? 'Yes' : 'No'}</span>
              </li>
              {challenge.pilotRequirement && (
                <>
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">{challenge.pilotDuration || 'Not specified'}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Funding Type</span>
                    <span className="font-medium text-gray-900">{challenge.fundingType || 'Not specified'}</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-card-title mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-gov-blue" />
              Data & Security
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-small font-semibold text-gray-700">Data Sharing</h4>
                <p className="text-caption text-gray-600 mt-1">{challenge.dataRequirements || 'No specific data sharing requirements listed.'}</p>
              </div>
              <div>
                <h4 className="text-small font-semibold text-gray-700">Cybersecurity</h4>
                <p className="text-caption text-gray-600 mt-1">{challenge.cybersecurityRequirements || 'Must comply with standard GoM cybersecurity guidelines.'}</p>
              </div>
              <div>
                <h4 className="text-small font-semibold text-gray-700">Intellectual Property</h4>
                <p className="text-caption text-gray-600 mt-1">{challenge.intellectualPropertyRequirements || 'As per standard innovation portal terms.'}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-card-title mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-gov-blue" />
              Eligibility
            </h3>
            <p className="text-body text-gray-700 whitespace-pre-wrap">
              {challenge.eligibilityRequirements || 'DPIIT recognized startups registered on the portal are eligible to apply.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;
