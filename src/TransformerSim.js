import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Activity, Sun, Wind } from "lucide-react";

const TransformerSim = () => {
  const [stage, setStage] = useState(0); // 0, 1, 2 代表三個不同場景

  // 自動轉換場景，方便你錄影 (每 8 秒換一次，總共約 24 秒一 Loop)
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 場景文字描述
  const stagesInfo = [
    {
      title: "PHASE 1: PRIMARY EXCITATION",
      desc: "交流電進入初級線圈，產生變動磁場。",
      color: "text-blue-400",
    },
    {
      title: "PHASE 2: MAGNETIC COUPLING",
      desc: "磁通量穿過鐵芯，將能量無形傳遞。",
      color: "text-purple-400",
    },
    {
      title: "PHASE 3: INDUCED OUTPUT",
      desc: "次級線圈感應出電壓，完成電力轉換。",
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="bg-[#05080a] p-10 rounded-[3rem] border-4 border-white/5 shadow-2xl text-white max-w-5xl mx-auto overflow-hidden relative">
      {/* 頂部進度條 (似影片 Playback) */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden"
          >
            {stage === i && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-full bg-blue-500"
              />
            )}
            {stage > i && <div className="h-full w-full bg-blue-900" />}
          </div>
        ))}
      </div>

      {/* 動態標題區 */}
      <div className="h-20 mb-10 text-center">
        <motion.h2
          key={stage}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-2xl font-black tracking-tighter ${stagesInfo[stage].color}`}
        >
          {stagesInfo[stage].title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 text-sm italic"
        >
          {stagesInfo[stage].desc}
        </motion.p>
      </div>

      {/* 主動畫區 */}
      <div className="relative h-80 flex items-center justify-center bg-gradient-to-b from-transparent to-blue-900/10 rounded-3xl border border-white/5">
        <AnimatePresence mode="wait">
          {/* 場景 1: 強調初級線圈 (Primary) */}
          {stage === 0 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex items-center gap-10"
            >
              <div className="relative">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.1,
                    }}
                    className="w-40 h-4 border-2 border-blue-500 rounded-full mb-2 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                ))}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-mono text-blue-500">
                  AC INPUT WAVE
                </div>
              </div>
              <Activity className="text-blue-500 animate-pulse" size={48} />
            </motion.div>
          )}

          {/* 場景 2: 強調磁場核心 (Core & Flux) */}
          {stage === 1 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative w-full flex justify-center"
            >
              <div className="w-64 h-64 border-8 border-slate-800 rounded-3xl flex items-center justify-center">
                {/* 磁力線動畫 */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4 / (i + 1),
                      ease: "linear",
                    }}
                    className="absolute inset-0 border-2 border-dashed border-purple-500/40 rounded-full"
                    style={{ margin: i * 20 }}
                  />
                ))}
                <div className="bg-purple-500/20 p-6 rounded-full blur-2xl animate-pulse" />
                <span className="text-purple-400 font-black text-xl z-10">
                  CORE FLUX
                </span>
              </div>
            </motion.div>
          )}

          {/* 場景 3: 強調輸出與負載 (Secondary & Bulb) */}
          {stage === 2 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px #fbbf24",
                      "0 0 100px #fbbf24",
                      "0 0 20px #fbbf24",
                    ],
                    filter: ["brightness(1)", "brightness(2)", "brightness(1)"],
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="bg-yellow-400 p-8 rounded-full mb-6"
                >
                  <Sun size={64} className="text-black" />
                </motion.div>
                {/* 射出的能量粒子 */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      x: [0, i % 2 === 0 ? 150 : -150],
                      y: [0, i % 2 === 0 ? 150 : -150],
                      opacity: [1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.1,
                    }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                  />
                ))}
              </div>
              <h3 className="text-3xl font-black text-yellow-500 tracking-widest uppercase">
                Max Efficiency
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部數據顯示面板 (似專業錄影設備) */}
      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase">Frequency</p>
          <p className="text-xl font-mono">50.00 Hz</p>
        </div>
        <div className="text-center border-x border-white/10">
          <p className="text-[10px] text-slate-500 uppercase">Status</p>
          <p className="text-xl font-mono text-green-500">
            ● {stage === 2 ? "LOADED" : "PROCESSING"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase">Timecode</p>
          <p className="text-xl font-mono">
            00:00:{stage * 8 < 10 ? `0${stage * 8}` : stage * 8}
          </p>
        </div>
      </div>

      {/* 背景裝飾 (Cyberpunk 感覺) */}
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Wind className="animate-spin" size={64} />
      </div>
    </div>
  );
};

export default TransformerSim;
