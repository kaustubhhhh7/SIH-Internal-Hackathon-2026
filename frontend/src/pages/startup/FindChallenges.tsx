import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, Bookmark, Building, Calendar, ArrowRight } from 'lucide-react';
import { startupChallengeApi } from '../../services/api/challenges';

const FindChallenges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Debounce search could be added here, but for simplicity we'll trigger on submit or blur
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['startupChallenges', page, sectorFilter, searchTerm],
    queryFn: () => startupChallengeApi.getChallenges({
      page,
      pageSize,
      search: searchTerm || undefined,
      sector: sectorFilter || undefined,
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section */}
      <div className="bg-gov-blue text-white p-8 rounded-xl shadow-md bg-opacity-90 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-page-title mb-2 text-white">Discover Government Challenges</h1>
          <p className="text-blue-100 max-w-2xl text-body">Browse operational challenges published by various Government of Maharashtra departments and submit your innovative solutions.</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title, keyword, or reference number..." 
            className="input-field pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              className="input-field pl-9 w-full"
              value={sectorFilter}
              onChange={(e) => { setSectorFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Sectors</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Urban Development">Urban Development</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
          <button onClick={handleSearch} className="btn-primary whitespace-nowrap">
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-blue"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center shadow-sm">
          <h3 className="text-card-title mb-1 text-red-700">Error Loading Challenges</h3>
          <p className="text-body">We couldn't load the challenges at this time. Please try again later.</p>
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-6">
          <div className="text-body text-gray-600 font-medium">
            Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, data.totalItems)} of {data.totalItems} Challenges
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((challenge: any) => (
              <div key={challenge.id} className="card flex flex-col hover:shadow-lg transition-shadow border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-100 text-gov-blue text-caption px-2.5 py-0.5 rounded">
                    {challenge.sector}
                  </span>
                  <span className="text-caption text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    {challenge.challengeReferenceNumber}
                  </span>
                </div>
                
                <h3 className="text-card-title mb-2 line-clamp-2">
                  {challenge.titleEnglish}
                </h3>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center text-small text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{challenge.departmentName}</span>
                  </div>
                  <div className="flex items-center text-small text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Closes: {challenge.submissionClosingDate ? new Date(challenge.submissionClosingDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  {challenge.pilotRequirement && (
                    <div className="flex items-center text-small text-amber-700 font-medium mt-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      Pilot Phase Required
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <button className="text-gray-400 hover:text-gov-blue transition-colors p-2" title="Save Challenge">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <Link 
                    to={`/startup/challenges/${challenge.id}`}
                    className="flex items-center text-nav text-gov-blue hover:text-blue-800"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 text-small font-medium hover:bg-gray-50"
              >
                Previous
              </button>
              <div className="flex items-center px-4 text-small font-medium text-gray-700">
                Page {page} of {data.totalPages}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 text-small font-medium hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-card-title mb-1">No challenges found</h3>
          <p className="text-body text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          {(searchTerm || sectorFilter) && (
            <button 
              onClick={() => { setSearchTerm(''); setSectorFilter(''); setPage(1); }}
              className="mt-4 text-gov-blue hover:underline text-small font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FindChallenges;
