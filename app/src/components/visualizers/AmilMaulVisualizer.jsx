import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2,
  Info,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

export default function AmilMaulVisualizer() {
  const circuits = [
    {
      id: 'CIRC-01',
      title: '1. Rangkaian Pengaruh Inna (إِنَّ وَأَخَوَاتُهَا)',
      sentence: 'إِنَّ اللَّهَ غَفُورٌ',
      translation: 'Sesungguhnya Allah Maha Pengampun.',
      nodes: [
        {
          id: 'node-1',
          word: 'إِنَّ',
          role: 'Amil (Pemicu Utama)',
          type: 'amil',
          color: 'from-amber-500 to-amber-700',
          desc: 'Huruf Tawkid wa Nashab yang berfungsi memancarkan daya nashab ke isimnya dan rafa\' ke khabarnya.'
        },
        {
          id: 'node-2',
          word: 'اللَّهَ',
          role: 'Ma\'mul 1 (Isim Inna)',
          type: 'mamul_manshub',
          color: 'from-sky-600 to-blue-700',
          desc: 'Dipaksa oleh Inna menjadi berstatus Manshub dengan harakat Fathah (ـَ).'
        },
        {
          id: 'node-3',
          word: 'غَفُورٌ',
          role: 'Ma\'mul 2 (Khabar Inna)',
          type: 'mamul_marfu',
          color: 'from-emerald-600 to-teal-700',
          desc: 'Dipengaruhi oleh Inna menjadi berstatus Marfu\' dengan harakat Dhommah (ـٌ).'
        }
      ],
      connections: [
        { from: 'node-1', to: 'node-2', label: 'Daya Nashab (Fathah)', color: 'text-sky-500 border-sky-400' },
        { from: 'node-1', to: 'node-3', label: 'Daya Rafa\' (Dhommah)', color: 'text-emerald-500 border-emerald-400' }
      ]
    },
    {
      id: 'CIRC-02',
      title: '2. Rangkaian Pengaruh Kaana (كَانَ وَأَخَوَاتُهَا)',
      sentence: 'كَانَ اللَّهُ عَلِيمًا',
      translation: 'Allah adalah Maha Mengetahui.',
      nodes: [
        {
          id: 'node-1',
          word: 'كَانَ',
          role: 'Amil (Pemicu Utama)',
          type: 'amil',
          color: 'from-amber-500 to-amber-700',
          desc: 'Fi\'il Madhi Naqish yang memancarkan daya rafa\' ke isimnya dan nashab ke khabarnya.'
        },
        {
          id: 'node-2',
          word: 'اللَّهُ',
          role: 'Ma\'mul 1 (Isim Kaana)',
          type: 'mamul_marfu',
          color: 'from-emerald-600 to-teal-700',
          desc: 'Dipengaruhi oleh Kaana menjadi berstatus Marfu\' dengan harakat Dhommah (ـُ).'
        },
        {
          id: 'node-3',
          word: 'عَلِيمًا',
          role: 'Ma\'mul 2 (Khabar Kaana)',
          type: 'mamul_manshub',
          color: 'from-sky-600 to-blue-700',
          desc: 'Dipaksa oleh Kaana menjadi berstatus Manshub dengan harakat Fathah (ـً).'
        }
      ],
      connections: [
        { from: 'node-1', to: 'node-2', label: 'Daya Rafa\' (Dhommah)', color: 'text-emerald-500 border-emerald-400' },
        { from: 'node-1', to: 'node-3', label: 'Daya Nashab (Fathah)', color: 'text-sky-500 border-sky-400' }
      ]
    },
    {
      id: 'CIRC-03',
      title: '3. Sirkuit Rantai Ganda: Huruf Jazm + Fi\'il Muta\'addi',
      sentence: 'لَمْ يَكْتُبْ زَيْدٌ الرِّسَالَةَ',
      translation: 'Zaid tidak menulis surat itu.',
      nodes: [
        {
          id: 'node-1',
          word: 'لَمْ',
          role: 'Amil Tingkat 1 (Huruf Jazm)',
          type: 'amil',
          color: 'from-rose-600 to-red-800',
          desc: 'Menembakkan daya jazm (sukun) ke kata kerja mudhari\' di depannya.'
        },
        {
          id: 'node-2',
          word: 'يَكْتُبْ',
          role: 'Ma\'mul Lam SEKALIGUS Amil Tingkat 2',
          type: 'hybrid',
          color: 'from-amber-600 to-orange-700',
          desc: 'Menjadi korban sukun dari Lam, tetapi sekaligus bertindak sebagai Amil yang mengangkat Zaid dan menashabkan Ar-Risalah!'
        },
        {
          id: 'node-3',
          word: 'زَيْدٌ',
          role: 'Ma\'mul Fa\'il (Subjek)',
          type: 'mamul_marfu',
          color: 'from-emerald-600 to-teal-700',
          desc: 'Dirafa\'kan (Dhommah) oleh kata kerja Yaktub sebagai pelakunya.'
        },
        {
          id: 'node-4',
          word: 'الرِّسَالَةَ',
          role: 'Ma\'mul Maf\'ul Bih (Objek)',
          type: 'mamul_manshub',
          color: 'from-sky-600 to-blue-700',
          desc: 'Dinasabkan (Fathah) oleh kata kerja Yaktub sebagai korbannya.'
        }
      ],
      connections: [
        { from: 'node-1', to: 'node-2', label: 'Daya Jazm (Sukun)', color: 'text-rose-400 border-rose-400' },
        { from: 'node-2', to: 'node-3', label: 'Daya Rafa\' Fa\'il (Dhommah)', color: 'text-emerald-400 border-emerald-400' },
        { from: 'node-2', to: 'node-4', label: 'Daya Nashab Objek (Fathah)', color: 'text-sky-400 border-sky-400' }
      ]
    }
  ];

  const [activeCircuitIdx, setActiveCircuitIdx] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const curr = circuits[activeCircuitIdx];
  const activeNode = curr.nodes.find(n => n.id === selectedNodeId) || curr.nodes[0];

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Nazhariyyatul 'Amil (Teori Sirkuit Sebab-Akibat Nahwu)
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            ⚡ Visualizer Medan Gaya: 'Amil, Ma'mul & Atsar
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Bahasa Arab bekerja seperti sirkuit listrik yang sangat teratur! Kata Pemicu ('Amil) memancarkan tegangan hukum ke kata target (Ma'mul), menghasilkan percikan harakat (Atsar).
          </p>
        </div>

        {/* Circuit Tabs */}
        <div className="flex flex-wrap gap-2">
          {circuits.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCircuitIdx(idx);
                setSelectedNodeId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeCircuitIdx === idx
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Sirkuit {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Circuit Board */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6 relative overflow-hidden">
        
        {/* Sentence Display Banner */}
        <div className="text-center space-y-1">
          <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">{curr.title}</span>
          <p className="font-arabic text-3xl sm:text-4xl font-extrabold text-white py-1">{curr.sentence}</p>
          <p className="text-xs text-slate-400 italic">"{curr.translation}"</p>
        </div>

        {/* Interactive Node Chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
          {curr.nodes.map((node) => {
            const isSelected = (selectedNodeId === node.id) || (!selectedNodeId && node.type === 'amil');
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`relative px-5 py-4 rounded-2xl bg-gradient-to-br ${node.color} text-white transition-all duration-200 transform flex flex-col items-center gap-1 min-w-[130px] border shadow-lg ${
                  isSelected
                    ? 'ring-4 ring-amber-300 scale-105 border-white'
                    : 'border-white/20 opacity-80 hover:opacity-100 hover:scale-102'
                }`}
              >
                <span className="font-arabic text-3xl font-extrabold">{node.word}</span>
                <span className="text-[11px] font-sans font-extrabold bg-black/30 px-2 py-0.5 rounded-full mt-1">
                  {node.role}
                </span>
                {isSelected && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-black font-extrabold">
                    ⚡
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Force Rays / Connection Indicators */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pancaran Garis Medan Gaya Sintaksis:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {curr.connections.map((conn, cIdx) => (
              <div key={cIdx} className={`p-2.5 rounded-lg border bg-slate-900/60 flex items-center gap-2 ${conn.color}`}>
                <span className="text-amber-400 font-mono font-bold">⚡</span>
                <span className="font-semibold text-slate-200">{conn.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Detail Diagnostic Card */}
        {activeNode && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-arabic text-xl font-bold text-amber-300">{activeNode.word}</span>
                <span className="text-xs bg-black/40 text-white font-extrabold px-2 py-0.5 rounded">
                  {activeNode.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeNode.desc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
