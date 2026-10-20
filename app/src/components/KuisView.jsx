import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  BookOpen, 
  Filter, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import soalList from '../data/04_bank_soal.json';

export default function KuisView() {
  const [quizMode, setQuizMode] = useState('practice'); // 'practice' or 'exam'
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [examCount, setExamCount] = useState(15);
  
  // Practice Mode state: { [id_soal]: { selected: 'A', isCorrect: true, showExpl: true } }
  const [practiceAnswers, setPracticeAnswers] = useState({});

  // Exam Mode state
  const [examActive, setExamActive] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentExamIdx, setCurrentExamIdx] = useState(0);
  const [examAnswers, setExamAnswers] = useState({}); // { [idx]: 'A' }
  const [examFinished, setExamFinished] = useState(false);

  // Distinct Difficulties
  const difficulties = useMemo(() => {
    const set = new Set();
    soalList.forEach(s => { if (s.tingkat_kesulitan) set.add(s.tingkat_kesulitan); });
    return Array.from(set);
  }, []);

  // Filtered Soal for Practice
  const filteredSoal = useMemo(() => {
    return soalList.filter(s => {
      return filterDifficulty === 'ALL' || s.tingkat_kesulitan === filterDifficulty;
    });
  }, [filterDifficulty]);

  // Handle Practice Option Click
  const handlePracticeAnswer = (soal, optionKey) => {
    const isCorrect = optionKey.toUpperCase() === soal.jawaban_benar.toUpperCase();
    setPracticeAnswers(prev => ({
      ...prev,
      [soal.id_soal]: {
        selected: optionKey,
        isCorrect,
        showExpl: true
      }
    }));
  };

  // Start Exam Mode
  const startExam = () => {
    const shuffled = [...soalList].sort(() => 0.5 - Math.random()).slice(0, examCount);
    setExamQuestions(shuffled);
    setCurrentExamIdx(0);
    setExamAnswers({});
    setExamFinished(false);
    setExamActive(true);
  };

  // Score calculation for Exam
  const examScore = useMemo(() => {
    if (!examFinished) return { correct: 0, total: 0, pct: 0 };
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (examAnswers[idx] && examAnswers[idx].toUpperCase() === q.jawaban_benar.toUpperCase()) {
        correct++;
      }
    });
    return {
      correct,
      total: examQuestions.length,
      pct: Math.round((correct / examQuestions.length) * 100)
    };
  }, [examFinished, examQuestions, examAnswers]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4 border border-emerald-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
          <GraduationCap className="w-3.5 h-3.5" />
          Evaluasi Mandiri & Uji Kompetensi Gramatika (80 Soal)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Bank Soal Nahwu-Sharaf & Analisis HOTS
        </h1>
        <p className="text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
          Uji pemahaman kaidah sintaksis dan morfologi dengan variasi soal penalaran tinggi (HOTS), lengkap dengan kunci jawaban dan pembahasan analitis.
        </p>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => { setQuizMode('practice'); setExamActive(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition shadow-xs ${
              quizMode === 'practice'
                ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-300'
                : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            Mode Latihan Bebas (Feedback Langsung)
          </button>
          <button
            onClick={() => { setQuizMode('exam'); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition shadow-xs ${
              quizMode === 'exam'
                ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-300'
                : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            Mode Ujian Simulasi (Terukur)
          </button>
        </div>
      </div>

      {/* 1. PRACTICE MODE */}
      {quizMode === 'practice' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-slate-700 text-xs sm:text-sm">Filter Kesulitan:</span>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="ALL">Semua Kesulitan ({difficulties.length})</option>
                {difficulties.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Menampilkan <strong>{filteredSoal.length}</strong> soal</span>
              <button
                onClick={() => setPracticeAnswers({})}
                className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Jawaban
              </button>
            </div>
          </div>

          {/* Soal Cards */}
          <div className="space-y-6">
            {filteredSoal.map((soal, sIdx) => {
              const state = practiceAnswers[soal.id_soal];

              return (
                <div
                  key={soal.id_soal}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
                >
                  {/* Soal Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-amber-300">
                        {soal.id_soal}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {soal.id_bab}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      soal.tingkat_kesulitan?.toLowerCase().includes('sulit')
                        ? 'bg-rose-100 text-rose-800'
                        : soal.tingkat_kesulitan?.toLowerCase().includes('sedang')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {soal.tingkat_kesulitan}
                    </span>
                  </div>

                  {/* Pertanyaan */}
                  <p className="text-base font-bold text-slate-900 leading-relaxed">
                    {sIdx + 1}. {soal.pertanyaan}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {['A', 'B', 'C', 'D'].map(optKey => {
                      const optText = soal[`opsi_${optKey.toLowerCase()}`];
                      if (!optText) return null;

                      const isSelected = state?.selected === optKey;
                      const isCorrectKey = soal.jawaban_benar.toUpperCase() === optKey;

                      let btnStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700";
                      if (state) {
                        if (isCorrectKey) {
                          btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400";
                        } else if (isSelected && !state.isCorrect) {
                          btnStyle = "bg-rose-100 border-rose-300 text-rose-900 font-semibold";
                        } else {
                          btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={optKey}
                          disabled={!!state}
                          onClick={() => handlePracticeAnswer(soal, optKey)}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all duration-150 ${btnStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected
                              ? (state.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white')
                              : (state && isCorrectKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700')
                          }`}>
                            {optKey}
                          </span>
                          <span className="flex-1 font-medium leading-relaxed">{optText}</span>
                          {state && isCorrectKey && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                          {state && isSelected && !state.isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback & Pembahasan */}
                  {state && (
                    <div className={`p-4 rounded-xl border text-sm space-y-2 animate-in fade-in duration-150 ${
                      state.isCorrect 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                        : 'bg-rose-50 border-rose-200 text-slate-800'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5">
                        {state.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-800">Jawaban Benar! (Kunci: {soal.jawaban_benar})</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span className="text-rose-800">Jawaban Kurang Tepat. (Kunci Benar: {soal.jawaban_benar})</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                        <strong>Pembahasan Ilmiah:</strong> {soal.pembahasan}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. EXAM MODE */}
      {quizMode === 'exam' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {!examActive ? (
            <div className="text-center max-w-md mx-auto space-y-4 py-8">
              <Award className="w-16 h-16 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-extrabold text-slate-900">
                Simulasi Ujian Mandiri
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Uji kompetensi secara terukur tanpa melihat jawaban langsung. Hasil dan analisis lengkap akan ditampilkan setelah semua soal dijawab.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-600">Jumlah Soal:</span>
                {[10, 15, 25, 40].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setExamCount(cnt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      examCount === cnt 
                        ? 'bg-emerald-900 text-amber-300' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cnt} Soal
                  </button>
                ))}
              </div>

              <button
                onClick={startExam}
                className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold text-sm shadow-md transition"
              >
                Mulai Ujian Sekarang →
              </button>
            </div>
          ) : !examFinished ? (
            <div className="space-y-6">
              {/* Exam Progress Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Soal Ujian:</span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Nomor {currentExamIdx + 1} dari {examQuestions.length}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Yakin ingin menyelesaikan ujian sekarang?")) {
                      setExamFinished(true);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100"
                >
                  Akhiri Ujian
                </button>
              </div>

              {/* Current Question */}
              {examQuestions[currentExamIdx] && (
                <div className="space-y-4">
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {examQuestions[currentExamIdx].pertanyaan}
                  </p>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {['A', 'B', 'C', 'D'].map(optKey => {
                      const optText = examQuestions[currentExamIdx][`opsi_${optKey.toLowerCase()}`];
                      if (!optText) return null;
                      const isSelected = examAnswers[currentExamIdx] === optKey;

                      return (
                        <button
                          key={optKey}
                          onClick={() => setExamAnswers(prev => ({ ...prev, [currentExamIdx]: optKey }))}
                          className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition ${
                            isSelected
                              ? 'bg-amber-100 border-amber-400 text-emerald-950 font-bold ring-2 ring-amber-400'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-amber-500 text-emerald-950' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {optKey}
                          </span>
                          <span className="flex-1 font-medium">{optText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button
                      disabled={currentExamIdx === 0}
                      onClick={() => setCurrentExamIdx(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-40 text-xs font-bold"
                    >
                      ← Soal Sebelumnya
                    </button>

                    {currentExamIdx < examQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentExamIdx(prev => Math.min(examQuestions.length - 1, prev + 1))}
                        className="px-5 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold text-xs shadow-sm hover:bg-emerald-800"
                      >
                        Soal Berikutnya →
                      </button>
                    ) : (
                      <button
                        onClick={() => setExamFinished(true)}
                        className="px-6 py-2 rounded-xl bg-amber-500 text-emerald-950 font-extrabold text-xs shadow-md hover:bg-amber-600"
                      >
                        Kumpulkan Jawaban & Lihat Skor ✓
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Exam Results Review */
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-200 space-y-3">
                <Award className="w-16 h-16 text-amber-500 mx-auto" />
                <h3 className="text-2xl font-extrabold text-emerald-950">
                  Hasil Simulasi Ujian Anda
                </h3>
                <div className="text-4xl font-black text-emerald-900">
                  {examScore.pct}%
                </div>
                <p className="text-sm text-slate-600">
                  Menjawab benar <strong>{examScore.correct}</strong> dari total <strong>{examScore.total}</strong> soal.
                </p>
                <button
                  onClick={startExam}
                  className="px-4 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold text-xs shadow-sm hover:bg-emerald-800"
                >
                  Ulangi Ujian dengan Soal Baru ↺
                </button>
              </div>

              {/* Review Answers List */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 text-sm">Review Jawaban & Pembahasan:</h4>
                {examQuestions.map((q, idx) => {
                  const userAns = examAnswers[idx];
                  const isCorrect = userAns && userAns.toUpperCase() === q.jawaban_benar.toUpperCase();

                  return (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Soal {idx + 1}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Benar ✓' : `Salah (Jawaban: ${userAns || 'Kosong'} | Kunci: ${q.jawaban_benar})`}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900">{q.pertanyaan}</p>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <strong>Pembahasan:</strong> {q.pembahasan}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
