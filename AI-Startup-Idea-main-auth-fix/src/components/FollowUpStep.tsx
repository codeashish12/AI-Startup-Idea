import React, { useState, useEffect } from 'react';
import { HelpCircle, ArrowRight, Loader2, Sparkles, Check, RefreshCw } from 'lucide-react';
import { FollowUpQuestion, GoalDetails, UserProfile } from '../types';

interface FollowUpStepProps {
  userProfile: UserProfile;
  goalDetails: GoalDetails;
  onSubmitSimulation: (answers: Record<string, string>) => void;
  isLoadingSimulation: boolean;
  darkMode: boolean;
}

export const FollowUpStep: React.FC<FollowUpStepProps> = ({
  userProfile,
  goalDetails,
  onSubmitSimulation,
  isLoadingSimulation,
  darkMode,
}) => {
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(true);

  // Fetch AI generated follow-up questions on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchQuestions() {
      setIsFetchingQuestions(true);
      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userProfile,
            goalCategory: goalDetails.category,
            goalTitle: goalDetails.title,
            goalDescription: goalDetails.description,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.questions && Array.isArray(data.questions)) {
            setQuestions(data.questions);
            // Default select first option for each
            const initial: Record<string, string> = {};
            data.questions.forEach((q: FollowUpQuestion) => {
              if (q.options && q.options.length > 0) {
                initial[q.id] = q.options[0];
              }
            });
            setAnswers(initial);
          }
        }
      } catch (e) {
        console.error('Failed to fetch follow-up questions', e);
      } finally {
        if (isMounted) setIsFetchingQuestions(false);
      }
    }

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [userProfile, goalDetails]);

  const handleSelectOption = (qId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleCustomAnswerChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSimulation(answers);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Title */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2: AI Parameter Refinement</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Refining Your Decision Variables</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          To calculate precise Future Decision Framework (FDF) scores for "{goalDetails.title}", please clarify these key operational parameters.
        </p>
      </div>

      {isFetchingQuestions ? (
        <div className={`p-12 rounded-2xl border text-center ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-200">Analyzing Goal Context...</h3>
          <p className="text-xs text-slate-400 mt-1">Generating custom follow-up questions based on your profile and goal.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {questions.map((q, idx) => (
            <div
              key={q.id || idx}
              className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-start space-x-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{q.question}</h3>
                  {q.helpText && <p className="text-xs text-slate-400 mt-0.5">{q.helpText}</p>}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {q.options?.map((opt) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                          : darkMode
                            ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

            </div>
          ))}

          {/* Action button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isLoadingSimulation}
              className="flex items-center justify-center space-x-3 px-10 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-600/25 disabled:opacity-50"
            >
              {isLoadingSimulation ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Calculating FDF Scenarios (0–100 Scores)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate 3–5 Decision Scenarios</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
