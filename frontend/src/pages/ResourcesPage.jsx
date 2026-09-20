import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { triggerConfetti } from '../components/common/Confetti';
import { 
  BookOpen, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export const ResourcesPage = () => {
  const { student, addCompletedQuiz, setActiveTab } = useStudent();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quiz Modal State
  const [activeQuizResource, setActiveQuizResource] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await api.getResources(student.id);
      setResources(data);
    } catch (err) {
      console.warn('Could not fetch resources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [student.verified_skills, student.completed_quizzes]);

  const handleOpenQuiz = (resource) => {
    setActiveQuizResource(resource);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleSelectAnswer = (qId, optionIdx) => {
    setQuizAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuizResource) return;
    setSubmittingQuiz(true);
    try {
      const res = await api.submitQuiz({
        studentId: student.id,
        skillId: activeQuizResource.skill_id,
        answers: quizAnswers
      });
      setQuizResult(res);

      if (res.passed) {
        addCompletedQuiz(activeQuizResource.skill_id);
        triggerConfetti();
        // Reload resources to unlock next item
        setTimeout(() => {
          loadResources();
        }, 1200);
      }
    } catch (e) {
      console.error('Quiz submission failed', e);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="icon-3d icon-3d-navy w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          <BookOpen className="w-7 h-7 text-teal-300" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-xs font-bold text-[#1F4E5F] border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-[#F4B942]" />
          <span>Sequenced Adaptive Pathway</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Curated Free Resources & Re-check Quizzes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Industry-tested free learning guides from freeCodeCamp, MDN, and official docs. 
          Resources unlock in dependency sequence once you pass each module’s 3-question verification quiz.
        </p>
      </div>

      {/* SEQUENCED RESOURCE CARDS WITH CONNECTING TIMELINE */}
      <div className="relative space-y-6">
        {/* Subtle vertical connecting guideline behind milestones */}
        <div className="hidden md:block absolute left-12 top-8 bottom-8 w-0.5 bg-gradient-to-b from-teal-500 via-amber-400 to-slate-200 opacity-30 -z-0" />

        {resources.map((res, idx) => {
          const isCompleted = student.completed_quizzes?.includes(res.skill_id) || res.is_completed;
          const isUnlocked = res.is_unlocked || isCompleted;

          return (
            <div
              key={res.skill_id}
              className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 border relative overflow-hidden bg-white/95 backdrop-blur-md ${
                isCompleted
                  ? 'border-teal-200 shadow-sm hover:shadow-md hover:border-teal-300'
                  : isUnlocked
                  ? 'border-slate-200/90 shadow-lg hover:shadow-2xl ring-1 ring-[#1F4E5F]/15 hover:-translate-y-1 glow-ring-teal'
                  : 'border-slate-200/60 bg-slate-50/70 opacity-65 backdrop-blur-xs'
              }`}
            >
              {/* Specular top highlight for unlocked */}
              {isUnlocked && !isCompleted && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1F4E5F] via-[#F4B942] to-teal-400"></div>
              )}
              {isCompleted && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
              )}

              {/* Order Watermark */}
              <div className="absolute right-6 top-5 text-6xl font-black text-slate-100/90 select-none pointer-events-none font-mono">
                #{res.order}
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                
                {/* Left Content with 3D Status Pedestal */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`icon-3d ${
                    isCompleted 
                      ? 'icon-3d-emerald' 
                      : isUnlocked 
                      ? 'icon-3d-amber' 
                      : 'icon-3d-navy opacity-50'
                  } w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : isUnlocked ? (
                      <BookOpen className="w-5 h-5 text-slate-950" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-[#1F4E5F] bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                        Milestone {res.order}
                      </span>

                      {isCompleted ? (
                        <Badge variant="verified" size="sm">
                          Quiz Passed & Verified
                        </Badge>
                      ) : isUnlocked ? (
                        <Badge variant="in_progress" size="sm">
                          Ready to Learn & Quiz
                        </Badge>
                      ) : (
                        <Badge variant="locked" size="sm">
                          Locked (Pass Prior Quiz)
                        </Badge>
                      )}

                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {res.duration_hours}
                      </span>

                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        {res.provider}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                        {res.summary}
                      </p>
                    </div>

                    {res.prerequisites?.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Prerequisites:{' '}
                        <span className="font-semibold text-slate-700">
                          {res.prerequisites.map(p => p.replace('skill-', '').replace('-', ' ').toUpperCase()).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 min-w-[210px] shrink-0">
                  {isUnlocked ? (
                    <>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>Open Free Tutorial</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>

                      <Button
                        variant={isCompleted ? 'secondary' : 'accent'}
                        size="md"
                        onClick={() => handleOpenQuiz(res)}
                        iconLeft={HelpCircle}
                        className={`text-xs font-bold ${isCompleted ? '' : 'text-slate-950 shadow-accent'} hover:-translate-y-0.5 active:translate-y-0`}
                      >
                        {isCompleted ? 'Re-take Quiz' : 'Take Re-check Quiz'}
                      </Button>
                    </>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Locked until prior module</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* 3-QUESTION RE-CHECK QUIZ MODAL */}
      <Modal
        isOpen={Boolean(activeQuizResource)}
        onClose={() => setActiveQuizResource(null)}
        title={`Re-check Quiz: ${activeQuizResource?.title}`}
        subtitle="Answer at least 2 out of 3 questions correctly to verify this module and unlock the next milestone."
        maxWidth="max-w-2xl"
      >
        {activeQuizResource && (
          <div className="space-y-6 pt-2">
            
            {/* Feedback Alert if result exists */}
            {quizResult && (
              <div className={`p-4 rounded-2xl text-xs font-medium border flex items-center gap-3.5 ${
                quizResult.passed
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-sm'
              }`}>
                <div className={`icon-3d ${quizResult.passed ? 'icon-3d-emerald' : 'icon-3d-amber'} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                  {quizResult.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-slate-950" />
                  )}
                </div>
                <div>
                  <div className="font-black text-sm tracking-tight">
                    Score: {quizResult.score} / {quizResult.total_questions} ({quizResult.percentage}%) — {quizResult.passed ? 'Passed!' : 'Needs Review'}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{quizResult.feedback}</p>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {activeQuizResource.quiz?.map((q, qIndex) => {
                const selectedOption = quizAnswers[q.id];
                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
                    <p className="text-xs sm:text-sm font-black text-slate-900">
                      <span className="text-[#1F4E5F] mr-1.5">Q{qIndex + 1}.</span>
                      {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        return (
                          <label
                            key={optIdx}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all hover:scale-[1.01] ${
                              isChosen
                                ? 'bg-teal-50 border-[#1F4E5F] text-slate-900 font-bold shadow-xs'
                                : 'bg-white border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={isChosen}
                              onChange={() => handleSelectAnswer(q.id, optIdx)}
                              className="text-[#1F4E5F] focus:ring-[#1F4E5F] cursor-pointer"
                            />
                            <span className="leading-snug">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveQuizResource(null)}
              >
                Close
              </Button>

              <Button
                variant="accent"
                size="md"
                onClick={handleSubmitQuiz}
                loading={submittingQuiz}
                disabled={Object.keys(quizAnswers).length < (activeQuizResource.quiz?.length || 3)}
                className="text-slate-950 font-bold px-6 shadow-accent hover:-translate-y-0.5 active:translate-y-0"
              >
                Submit Answers
              </Button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};
