import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';

interface UnansweredQuestion {
  id: string;
  question: string;
  category: string;
  status: string;
  createdAt: string;
}

interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  source: string;
  isVerified: boolean;
}

const KnowledgeBaseAdmin = () => {
  const { t } = useTranslation();
  const [unanswered, setUnanswered] = useState<UnansweredQuestion[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'unanswered' | 'knowledge'>('unanswered');
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestion | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const uRes = await fetch('http://localhost:5015/api/admin/knowledge/unanswered');
      if (uRes.ok) {
        const uData = await uRes.json();
        setUnanswered(uData);
      }

      const kRes = await fetch('http://localhost:5015/api/admin/knowledge');
      if (kRes.ok) {
        const kData = await kRes.json();
        setKnowledge(kData);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleResolve = async () => {
    if (!selectedQuestion || !answerInput.trim()) return;

    try {
      const res = await fetch(`http://localhost:5015/api/admin/knowledge/unanswered/${selectedQuestion.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answerInput })
      });

      if (res.ok) {
        setAnswerInput('');
        setSelectedQuestion(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-gray-900">Knowledge Base Management</h1>
        <p className="text-body text-gray-500 mt-1">Review unanswered questions and verify portal knowledge.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('unanswered')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 text-nav ${
              activeTab === 'unanswered'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unanswered Questions ({unanswered.length})
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 text-nav ${
              activeTab === 'knowledge'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verified Knowledge ({knowledge.length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading data...</div>
      ) : (
        <div>
          {activeTab === 'unanswered' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {unanswered.length === 0 ? (
                    <li className="p-6 text-center text-gray-500">No unanswered questions right now.</li>
                  ) : (
                    unanswered.map((q) => (
                      <li key={q.id}>
                        <button 
                          onClick={() => setSelectedQuestion(q)}
                          className={`w-full text-left px-6 py-4 hover:bg-gray-50 ${selectedQuestion?.id === q.id ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex justify-between">
                            <p className="text-card-title text-blue-900 truncate">{q.question}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-yellow-100 text-yellow-800">
                              {q.status}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-small text-gray-500">
                                {q.category}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-small text-gray-500 sm:mt-0">
                              <p>{new Date(q.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {selectedQuestion && (
                <div className="bg-white shadow sm:rounded-md border border-gray-200 p-6 flex flex-col">
                  <h3 className="text-section-title text-gray-900 mb-2 border-none pb-0">Resolve Question</h3>
                  <p className="text-body text-gray-600 mb-4 bg-gray-50 p-3 border border-gray-200 rounded">
                    <strong>User Asked:</strong> {selectedQuestion.question}
                  </p>
                  
                  <div className="mb-4">
                    <label htmlFor="answer" className="block text-nav text-gray-700">Official Answer</label>
                    <textarea
                      id="answer"
                      rows={6}
                      className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-body border-gray-300 rounded-md border p-2"
                      placeholder="Provide the verified answer to this question..."
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                    />
                  </div>

                  <div className="mt-auto flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setSelectedQuestion(null)}>Cancel</Button>
                    <Button onClick={handleResolve} disabled={!answerInput.trim()}>Save & Verify</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {knowledge.map((k) => (
                  <li key={k.id} className="px-6 py-4">
                    <h4 className="text-card-title text-gray-900">{k.question}</h4>
                    <p className="text-body text-gray-600 mt-1">{k.answer}</p>
                    <div className="mt-2 flex items-center text-caption text-gray-500 gap-4">
                      <span>Source: {k.source}</span>
                      <span className="text-green-600 font-semibold">{k.isVerified ? '✓ Verified' : ''}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseAdmin;
