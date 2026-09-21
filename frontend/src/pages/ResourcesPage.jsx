import React, { useState, useEffect, useMemo } from 'react';
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
  Check,
  Search,
  Play,
  Tv,
  Filter,
  GraduationCap,
  TrendingUp,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

// Pixel-perfect official YouTube Play Logo SVG
export const YoutubeIcon = ({ className = "w-4 h-4 text-red-600" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const ResourcesPage = () => {
  const { student, addCompletedQuiz, setActiveTab } = useStudent();
  const [resources, setResources] = useState([]);
  const [youtubeCourses, setYoutubeCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'youtube' | 'pathway'
  const [selectedTrack, setSelectedTrack] = useState('all'); // 'all' | 'Software Developer' | 'Data Analyst' | 'Embedded Systems'
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz Modal State
  const [activeQuizResource, setActiveQuizResource] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // In-Site Video Cinema Player State
  const [playingVideo, setPlayingVideo] = useState(null);

  const extractYoutubeVideoId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : '';
  };

  const handlePlayVideo = (videoObj, parentResource = null) => {
    if (!videoObj) return;
    const videoId = videoObj.video_id || extractYoutubeVideoId(videoObj.url);
    setPlayingVideo({
      ...videoObj,
      video_id: videoId,
      skill_id: videoObj.skill_id || parentResource?.skill_id,
      description: videoObj.description || parentResource?.summary,
      key_topics: videoObj.key_topics || (parentResource?.title ? [parentResource.title, `${parentResource.level} Level`] : [])
    });
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const [resData, ytData] = await Promise.all([
        api.getResources(student.id),
        api.getYoutubeCourses()
      ]);
      setResources(resData || []);
      setYoutubeCourses(ytData || []);
    } catch (err) {
      console.warn('Could not fetch resources or YouTube courses', err);
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

  // Filter YouTube courses by track and search query
  const filteredYoutubeCourses = useMemo(() => {
    return youtubeCourses.filter(course => {
      const matchesTrack = selectedTrack === 'all' || course.track?.toLowerCase() === selectedTrack.toLowerCase();
      const matchesSearch = !searchQuery.trim() || 
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.channel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.key_topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTrack && matchesSearch;
    });
  }, [youtubeCourses, selectedTrack, searchQuery]);

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-6xl mx-auto">
      
      {/* ========================================================================= */}
      {/* 1. HEADER SECTION                                                         */}
      {/* ========================================================================= */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <div className="icon-3d icon-3d-navy w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-teal-300" />
          </div>
          <div className="w-13 h-13 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 text-white">
            <YoutubeIcon className="w-7 h-7 text-white fill-current" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-xs font-bold text-[#1F4E5F] border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-[#F4B942]" />
          <span>Curated In-Site Video Masterclasses & Sequenced Pathways</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Curated Free Resources & In-Site Video Courses
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Industry-tested free learning guides and full YouTube video masterclasses from top engineering educators 
          (<strong className="text-slate-900">freeCodeCamp, TechWorld with Nana, Chai aur Code, Alex The Analyst</strong>). 
          Stream complete courses directly inside NexStep without external redirects!
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & VIEW SWITCHER TOOLBAR                                         */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl glass-card-premium border-sharp space-y-4 shadow-sm">
        
        {/* Top View Mode Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTabFilter('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Resources ({resources.length + youtubeCourses.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTabFilter('youtube')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabFilter === 'youtube'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <YoutubeIcon className={`w-3.5 h-3.5 ${activeTabFilter === 'youtube' ? 'text-white' : 'text-red-600'}`} />
              <span>YouTube Video Courses ({youtubeCourses.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabFilter('pathway')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTabFilter === 'pathway'
                  ? 'bg-[#1F4E5F] text-white shadow-sm shadow-teal-900/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sequenced Quizzes ({resources.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. Docker, SQL, React)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200/90 bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1F4E5F]/20 focus:border-[#1F4E5F]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Track Category Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Role Track:
          </span>
          {[
            { id: 'all', label: 'All Career Tracks' },
            { id: 'Software Developer', label: 'Software Developer' },
            { id: 'Data Analyst', label: 'Data Analyst' },
            { id: 'Embedded Systems', label: 'Embedded & IoT' }
          ].map((trk) => (
            <button
              key={trk.id}
              type="button"
              onClick={() => setSelectedTrack(trk.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedTrack === trk.id
                  ? 'bg-[#1F4E5F] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {trk.label}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. FEATURED YOUTUBE VIDEO COURSES SECTION                                  */}
      {/* ========================================================================= */}
      {(activeTabFilter === 'all' || activeTabFilter === 'youtube') && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                <YoutubeIcon className="w-4 h-4 text-white fill-current" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>YouTube Video Masterclasses</span>
                  <span className="text-xs font-mono font-bold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Plays Directly In-Site</span>
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Full-length courses, crash courses, and hands-on project walkthroughs
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400 font-mono hidden sm:inline">
              Showing {filteredYoutubeCourses.length} video courses
            </span>
          </div>

          {filteredYoutubeCourses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No YouTube courses found matching your query</p>
              <Button size="sm" variant="secondary" onClick={() => { setSearchQuery(''); setSelectedTrack('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredYoutubeCourses.map((course) => {
                // Find matching resource if it exists for quiz linking
                const matchingResource = resources.find(r => r.skill_id === course.skill_id);

                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Specular Sheen */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-500 opacity-80" />

                    <div>
                      {/* Video Thumbnail Preview with In-Site Play Overlay */}
                      <div 
                        onClick={() => handlePlayVideo(course)}
                        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group/thumb mb-3 shadow-xs"
                        title="Click to play in-site"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${course.video_id || extractYoutubeVideoId(course.url)}/hqdefault.jpg`}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-90 group-hover/thumb:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Center Glowing Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-115 group-hover/thumb:bg-red-600 transition-all duration-300">
                            <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                          </div>
                        </div>

                        {/* Bottom Duration Badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-[10px] font-mono font-bold text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>{course.duration}</span>
                        </div>

                        {/* In-Site Play Indicator */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600/90 text-[10px] font-bold text-white flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>In-Site Video</span>
                        </div>
                      </div>

                      {/* Course Meta Banner */}
                      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <YoutubeIcon className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                            {course.channel}
                          </span>
                          <span className="text-[10px] text-teal-600 font-bold" title="Verified Creator">✓</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {course.rating || '4.9 ★'}
                          </span>
                        </div>
                      </div>

                      {/* Title & Badge */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-200">
                            {course.badge || 'YouTube Course'}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {course.views}
                          </span>
                        </div>

                        <h3 
                          onClick={() => handlePlayVideo(course)}
                          className="text-sm font-black text-slate-900 group-hover:text-red-700 transition-colors leading-snug cursor-pointer"
                        >
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Key Topics Pills */}
                      {course.key_topics && (
                        <div className="flex flex-wrap gap-1.5 pt-3 mt-2">
                          {course.key_topics.slice(0, 3).map((topic, tIdx) => (
                            <span 
                              key={tIdx}
                              className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                      <button
                        type="button"
                        onClick={() => handlePlayVideo(course)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] group/btn cursor-pointer"
                      >
                        <Play className="w-4 h-4 text-white fill-current group-hover/btn:scale-110 transition-transform" />
                        <span>Play Video in NexStep</span>
                      </button>

                      {matchingResource && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenQuiz(matchingResource)}
                          iconLeft={HelpCircle}
                          className="w-full text-xs font-bold border-slate-200 hover:border-[#1F4E5F]"
                        >
                          Take Evaluation Quiz
                        </Button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. SEQUENCED PATHWAYS & RE-CHECK QUIZZES SECTION                          */}
      {/* ========================================================================= */}
      {(activeTabFilter === 'all' || activeTabFilter === 'pathway') && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1F4E5F] text-white flex items-center justify-center shadow-xs">
                <Layers className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Sequenced Learning Pathway & Verification Quizzes
                </h2>
                <p className="text-xs text-slate-500">
                  Step-by-step milestones. Pass each 3-question evaluation quiz to unlock the next milestone.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400 font-mono">
              {resources.filter(r => student.completed_quizzes?.includes(r.skill_id) || r.is_completed).length} / {resources.length} Completed
            </span>
          </div>

          <div className="relative space-y-6">
            {/* Vertical timeline connector guideline */}
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
                  {/* Specular top highlight */}
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

                        {/* YouTube Video Course Badge Strip */}
                        {res.youtube && (
                          <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/80 flex flex-wrap items-center justify-between gap-2 max-w-2xl shadow-xs">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                              </div>
                              <span className="font-bold text-slate-900">
                                {res.youtube.title}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-600 font-medium">{res.youtube.channel}</span>
                              <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-red-200 text-red-800">
                                {res.youtube.duration}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handlePlayVideo(res.youtube, res)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Play Video (In-Site)</span>
                            </button>
                          </div>
                        )}

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
                          {/* In-Site Video Play Button */}
                          {res.youtube && (
                            <button
                              type="button"
                              onClick={() => handlePlayVideo(res.youtube, res)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
                            >
                              <Play className="w-4 h-4 text-white fill-current group-hover:scale-110 transition-transform" />
                              <span>Watch Video (In-Site)</span>
                            </button>
                          )}

                          {/* Documentation / Tutorial Link */}
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <span>Open Free Tutorial</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          </a>

                          {/* Evaluation Quiz */}
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
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. IN-SITE YOUTUBE CINEMA VIDEO PLAYER MODAL                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(playingVideo)}
        onClose={handleCloseVideo}
        title={playingVideo ? `${playingVideo.title}` : 'Video Masterclass'}
        subtitle={playingVideo ? `${playingVideo.channel} • ${playingVideo.duration || ''} • In-Site Player` : ''}
        maxWidth="max-w-4xl"
      >
        {playingVideo && (
          <div className="space-y-4 pt-1">
            {/* 16:9 Widescreen Embedded Iframe Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
              {playingVideo.video_id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.video_id}?autoplay=1&rel=0&modestbranding=1`}
                  title={playingVideo.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Unable to load video stream
                </div>
              )}
            </div>

            {/* Video Metadata and In-Player Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <YoutubeIcon className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{playingVideo.channel}</span>
                      <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-1 rounded border border-teal-200" title="Verified Creator">✓ Verified</span>
                    </div>
                    {playingVideo.instructor && (
                      <p className="text-[11px] text-slate-500">Instructor: {playingVideo.instructor}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {playingVideo.duration && (
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {playingVideo.duration}
                    </span>
                  )}
                  {playingVideo.rating && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      {playingVideo.rating}
                    </span>
                  )}
                </div>
              </div>

              {playingVideo.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {playingVideo.description}
                </p>
              )}

              {playingVideo.key_topics && playingVideo.key_topics.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Key Topics Covered:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {playingVideo.key_topics.map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {(() => {
                    const matchingRes = resources.find(r => r.skill_id === playingVideo.skill_id);
                    if (!matchingRes) return null;
                    return (
                      <Button
                        variant="accent"
                        size="sm"
                        iconLeft={HelpCircle}
                        onClick={() => {
                          handleCloseVideo();
                          handleOpenQuiz(matchingRes);
                        }}
                        className="text-xs font-bold text-slate-950 shadow-accent w-full sm:w-auto"
                      >
                        Take Evaluation Quiz for This Skill
                      </Button>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {playingVideo.url && (
                    <a
                      href={playingVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 underline"
                    >
                      <span>Watch on YouTube instead</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCloseVideo}
                    className="text-xs font-bold"
                  >
                    Close Player
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 6. 3-QUESTION RE-CHECK QUIZ MODAL                                          */}
      {/* ========================================================================= */}
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

export default ResourcesPage;
