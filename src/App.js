import React, { useState, useEffect } from "react";
import {
  Zap,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Settings,
  RefreshCw,
  XCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const generateData = () =>
  Array.from({ length: 20 }, (_, i) => ({ time: i, value: 220 }));

const SOP_QUESTIONS = [
  {
    id: 1,
    question: "當變壓器電壓超過 240kV 警戒線，首要安全程序是什麼？",
    options: [
      {
        text: "立即切換至備用匯流排 (Bus B) 分擔負荷",
        correct: true,
        reason: "正確。及時分流能有效防止單一設備因過熱燒毀。",
      },
      {
        text: "手動調高冷卻系統頻率",
        correct: false,
        reason: "錯誤。單純調高冷卻無法解決根本的電力過載物理壓力。",
      },
      {
        text: "切斷非核心區域的所有民用電力",
        correct: false,
        reason: "錯誤。應優先嘗試分流，大規模停電是最後手段。",
      },
    ],
  },
  {
    id: 2,
    question: "若報告過載後電壓持續攀升，應執行哪項緊急操作？",
    options: [
      {
        text: "執行緊急隔離指令 (Emergency Isolation)",
        correct: true,
        reason: "正確。在設備損毀前實施物理隔離是標準保護程序。",
      },
      {
        text: "等待中央調度室遠端自動重置",
        correct: false,
        reason: "錯誤。本地過載可能導致通訊延遲，必須即時介入。",
      },
      {
        text: "增加無功功率補償",
        correct: false,
        reason: "錯誤。這對解決變壓器過熱過載無直接幫助。",
      },
    ],
  },
];

const App = () => {
  const [status, setStatus] = useState("NORMAL");
  const [voltage, setVoltage] = useState(220);
  const [data, setData] = useState(generateData());
  const [level, setLevel] = useState(1);
  const [isAutoRising, setIsAutoRising] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  // 核心流程狀態
  const [hasReported, setHasReported] = useState(false); // 是否已點擊報告
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // --- 電壓攀升邏輯 ---
  useEffect(() => {
    let interval;
    if (isAutoRising && !isFailed && !isCorrect) {
      interval = setInterval(() => {
        setVoltage((prev) => {
          // 根據難度提升速度
          const baseRise = status === "NORMAL" ? 3 + level * 2 : 6 + level * 4;
          const noise = (Math.random() - 0.2) * (level * 8);
          let nextVal = prev + baseRise + noise;

          // 自動判定為 CRITICAL (進入警戒)
          if (status === "NORMAL" && nextVal > 240) {
            setStatus("CRITICAL");
          }

          // 如果不處理，超過 380 就爆炸
          if (nextVal > 380) {
            setIsFailed(true);
            return 400;
          }

          setData((prevData) => [
            ...prevData.slice(1),
            { time: Date.now(), value: nextVal },
          ]);
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAutoRising, isFailed, status, level, isCorrect]);

  // --- 處理報告 ---
  const handleReport = () => {
    setHasReported(true);
    // 報告後才顯示問題
    setCurrentQuestion(
      SOP_QUESTIONS[Math.floor(Math.random() * SOP_QUESTIONS.length)]
    );
  };

  // --- 處理答題 ---
  const handleOptionClick = (option) => {
    setSelectedOption(option.text);
    setFeedback(option.reason);
    setIsCorrect(option.correct);
  };

  // --- 最終 Reset ---
  const handleReset = () => {
    if (isCorrect) {
      setStatus("NORMAL");
      setVoltage(220);
      setIsCorrect(false);
      setHasReported(false);
      setSelectedOption(null);
      setFeedback("");
      setIsAutoRising(false);
      setData(generateData());
      setCurrentQuestion(null);
    }
  };

  // --- 開始模擬 ---
  const startSim = (lv) => {
    setLevel(lv);
    setVoltage(220);
    setStatus("NORMAL");
    setIsFailed(false);
    setIsAutoRising(true); // 開始後按鈕會變灰
    setHasReported(false);
    setIsCorrect(false);
    setData(generateData());
  };

  return (
    <div
      className={`min-h-screen font-sans p-6 transition-all duration-700 ${
        isFailed
          ? "bg-red-950"
          : status === "CRITICAL"
          ? "bg-[#150a0a]"
          : "bg-[#0a0f18]"
      }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 max-w-7xl mx-auto text-white">
        <div className="flex items-center gap-3">
          <div className="bg-[#ff6b00] p-2 rounded-lg shadow-lg shadow-orange-900/40">
            <Zap size={20} fill="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              CLP GRID-MASTER
            </h1>
            <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase font-medium">
              Digital Training System
            </p>
          </div>
        </div>
        <div
          className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${
            status === "NORMAL"
              ? "border-blue-500 text-blue-400 bg-blue-500/5"
              : "border-red-500 text-red-400 bg-red-500/10 animate-pulse"
          }`}
        >
          {status === "NORMAL" ? "System Stable" : "Voltage Overload"}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* 左側：數據與圖表 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161b26] p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">
                  Live Telemetry
                </p>
                <h2 className="text-slate-300 text-sm font-bold flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" /> SUBSTATION
                  A-1
                </h2>
              </div>
              <div className="text-right">
                <span
                  className={`text-5xl font-mono font-black tracking-tighter ${
                    status === "NORMAL" ? "text-blue-400" : "text-red-500"
                  }`}
                >
                  {voltage.toFixed(1)}
                  <span className="text-lg ml-1 opacity-40">kV</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff05"
                    vertical={false}
                  />
                  <ReferenceLine
                    y={240}
                    stroke="#ef4444"
                    strokeDasharray="8 4"
                    label={{
                      value: "CRITICAL LIMIT",
                      fill: "#ef4444",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  />
                  <YAxis domain={[180, 420]} hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={status === "NORMAL" ? "#3b82f6" : "#ef4444"}
                    strokeWidth={4}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 視覺化組件 */}
          <div className="bg-[#161b26] p-6 rounded-2xl border border-white/5 flex justify-between items-center px-12">
            <div className="text-center opacity-40">
              <div className="w-12 h-12 bg-slate-800 rounded-xl mb-2" />
              <p className="text-[10px] text-white">GEN-01</p>
            </div>
            <div className="flex-1 h-1 mx-4 bg-slate-800/50 relative">
              {isAutoRising && (
                <motion.div
                  animate={{ x: [-20, 300] }}
                  transition={{
                    repeat: Infinity,
                    duration: status === "NORMAL" ? 2 : 0.4,
                    ease: "linear",
                  }}
                  className={`absolute inset-0 w-24 h-full ${
                    status === "NORMAL" ? "bg-blue-500/40" : "bg-red-500"
                  } blur-md`}
                />
              )}
            </div>
            <div
              className={`p-5 rounded-2xl border-2 transition-colors ${
                status === "NORMAL"
                  ? "border-slate-800"
                  : "border-red-500 bg-red-500/5"
              }`}
            >
              <Settings
                size={32}
                className={
                  status === "NORMAL"
                    ? "text-slate-700"
                    : "text-red-500 animate-spin"
                }
              />
            </div>
            <div className="flex-1 h-1 mx-4 bg-slate-800/50" />
            <div className="text-center opacity-40">
              <div className="w-12 h-12 bg-slate-800 rounded-xl mb-2" />
              <p className="text-[10px] text-white">GRID-01</p>
            </div>
          </div>
        </div>

        {/* 右側：交互操作台 */}
        <div className="space-y-6">
          <div className="bg-[#161b26] p-6 rounded-3xl border border-white/5 min-h-[500px] flex flex-col shadow-2xl relative">
            {/* 難度與啟動區 */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-500 mb-4 tracking-widest uppercase flex items-center gap-2">
                <CheckCircle2 size={14} /> Training Setup
              </h3>
              <div className="flex gap-2 p-1 bg-slate-900 rounded-xl mb-4 border border-white/5">
                {[1, 2, 3].map((lv) => (
                  <button
                    key={lv}
                    disabled={isAutoRising}
                    onClick={() => setLevel(lv)}
                    className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                      level === lv
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:text-slate-400 disabled:opacity-30"
                    }`}
                  >
                    LV {lv}
                  </button>
                ))}
              </div>
              <button
                onClick={() => startSim(level)}
                disabled={isAutoRising}
                className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                  isAutoRising
                    ? "bg-slate-800 text-slate-600 border border-white/5 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40"
                }`}
              >
                {isAutoRising ? (
                  "SIMULATION RUNNING..."
                ) : (
                  <>
                    <Zap size={18} fill="white" /> START SESSION
                  </>
                )}
              </button>
            </div>

            <hr className="border-white/5 mb-8" />

            {/* 核心 SOP 互動區 */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {status === "CRITICAL" ? (
                  <motion.div
                    key="critical"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* 第一步：報告按鈕 */}
                    {!hasReported ? (
                      <div className="text-center py-6 bg-red-500/5 border border-red-500/20 rounded-2xl animate-pulse">
                        <AlertTriangle
                          size={32}
                          className="text-red-500 mx-auto mb-3"
                        />
                        <p className="text-red-400 text-xs font-bold mb-4 uppercase">
                          Overload Detected!
                        </p>
                        <button
                          onClick={handleReport}
                          className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-black text-xs tracking-widest shadow-lg shadow-red-900/40"
                        >
                          REPORT OVERLOAD
                        </button>
                      </div>
                    ) : (
                      /* 第二步：選擇題 */
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <FileText size={14} />{" "}
                          <span className="text-[10px] font-bold uppercase">
                            Emergency SOP Quiz
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white leading-relaxed bg-slate-900 p-4 rounded-xl border border-white/5">
                          {currentQuestion?.question}
                        </p>
                        <div className="space-y-2">
                          {currentQuestion?.options.map((opt, i) => (
                            <button
                              key={i}
                              disabled={isCorrect}
                              onClick={() => handleOptionClick(opt)}
                              className={`w-full text-left p-4 rounded-xl text-[11px] transition-all border ${
                                selectedOption === opt.text
                                  ? opt.correct
                                    ? "bg-green-500/20 border-green-500 text-green-400"
                                    : "bg-red-500/20 border-red-500 text-red-400"
                                  : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500"
                              }`}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>

                        {/* 回饋原因 */}
                        {feedback && (
                          <div
                            className={`p-4 rounded-xl text-[10px] font-medium leading-relaxed border ${
                              isCorrect
                                ? "bg-green-500/5 text-green-400 border-green-500/20"
                                : "bg-red-500/5 text-red-400 border-red-500/20"
                            }`}
                          >
                            {feedback}
                          </div>
                        )}

                        {/* 第三步：Reset */}
                        <button
                          onClick={handleReset}
                          disabled={!isCorrect}
                          className={`w-full py-4 mt-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                            isCorrect
                              ? "bg-green-600 hover:bg-green-500 text-white shadow-xl shadow-green-900/40 animate-bounce"
                              : "bg-slate-800 text-slate-600 cursor-not-allowed"
                          }`}
                        >
                          <RefreshCw
                            size={16}
                            className={isCorrect ? "animate-spin" : ""}
                          />{" "}
                          COMPLETE EMERGENCY RESET
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
                    <CheckCircle2 size={40} className="text-blue-500 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      System Awaiting Simulation
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* 失敗覆蓋層 */}
      <AnimatePresence>
        {isFailed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <div className="bg-[#1a0505] border-2 border-red-600/30 p-12 rounded-[40px] max-w-sm text-center shadow-[0_0_100px_rgba(239,68,68,0.2)]">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">
                GRID DESTRUCTION
              </h2>
              <p className="text-slate-500 text-xs mb-8 leading-relaxed italic">
                "決策遲緩或 SOP 錯誤導致變壓器永久損壞。"
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-white text-black rounded-2xl font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
              >
                Reinitialize System
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
