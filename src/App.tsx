/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, Sparkles, X, Check, ChevronRight, Mail, RefreshCw, Undo2, Volume2, VolumeX } from 'lucide-react';

// Background music component using YouTube embed for audio
const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleVolume = () => {
    setIsMuted(!isMuted);
    // Note: YouTube doesn't support easy mute toggle via postMessage without API loaded, 
    // but we can simulate it or let the user handle volume. 
    // Here we'll just toggle the icon state as a proxy for the user's focus.
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <div className="hidden">
        {/* YouTube Embed for audio background - Using "UXQbgBWIxVyDimbn" as ID from link HqN54_GIJiU */}
        <iframe
          ref={iframeRef}
          width="100"
          height="100"
          src={`https://www.youtube.com/embed/HqN54_GIJiU?autoplay=1&loop=1&playlist=HqN54_GIJiU&controls=0`}
          title="Background Music"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-rose-100 text-rose-500 hover:text-rose-600 transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
      <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-rose-100">
        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest whitespace-nowrap">Music Playing</p>
      </div>
    </div>
  );
};

// Floating heart component for background
const FloatingHeart = ({ delay = 0 }: { delay?: number; [key: string]: any }) => {
  const [position] = useState(() => ({
    left: `${Math.random() * 100}%`,
    duration: 15 + Math.random() * 15,
    size: 15 + Math.random() * 30,
  }));

  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0, scale: 0.5 }}
      animate={{
        y: '-10vh',
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1.2, 0.5],
        rotate: [0, 45, -45, 0],
      }}
      transition={{
        duration: position.duration,
        repeat: Infinity,
        delay: delay,
        ease: 'linear',
      }}
      className="absolute text-rose-300/30 blur-[1px] pointer-events-none z-0"
      style={{
        left: position.left,
        width: position.size,
        height: position.size,
      }}
    >
      <Heart fill="currentColor" size={position.size} />
    </motion.div>
  );
};

type AppStep = 'passcode' | 'question' | 'denied' | 'envelope' | 'gallery' | 'thanks';

export default function App() {
  const [step, setStep] = useState<AppStep>('passcode');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  
  const CORRECT_PASSCODE = '20042568'; // 8-digit requirement
  const containerRef = useRef<HTMLDivElement>(null);

  // Images for the memory gallery
  const memoryImages = [
    { id: 1, url: 'https://i.postimg.cc/25XYzG41/9eacfe51-6beb-49b6-a330-38cb6fc6c61c.jpg' },
    { id: 2, url: 'https://i.postimg.cc/fWCKkP3s/c0adab6e-2729-4c0b-b41c-c4e97942ed4e.jpg' },
    { id: 3, url: 'https://i.postimg.cc/75VWcsPM/0d5fda8d-b87a-4dda-b7e7-eb21d3807b49.jpg' },
    { id: 4, url: 'https://i.postimg.cc/bvxckLhm/2a9e1dc1-fafe-4ad9-b922-ef32a2ea8f72.jpg' },
    { id: 5, url: 'https://i.postimg.cc/g26PkmBv/4622813c-d60d-426d-81cf-61c9a1a9973b.jpg' },
    { id: 6, url: 'https://i.postimg.cc/CKTpRXWk/4674b8c7-b5de-4f7a-88db-7b1f84110b27.jpg' },
    { id: 7, url: 'https://i.postimg.cc/wjsdTgbX/5f03ad5f-9bcd-4174-8217-ff9e1aa9ec95.jpg' },
    { id: 8, url: 'https://i.postimg.cc/ht7qPc3B/84c8cb52-77a9-41c5-996a-f5f8da356679.jpg' },
    { id: 9, url: 'https://i.postimg.cc/mrfWPJ0j/a9d67cc1-bdf4-4b29-8ee0-7909ee652304.jpg' },
    { id: 10, url: 'https://i.postimg.cc/FK5XY8Mt/d937f7bd-8d47-42ad-949d-a6ce2c023f47.jpg' }
  ].map(img => ({
    ...img,
    rotation: Math.random() * 10 - 5
  }));

  const handleKeyPress = (num: string) => {
    if (passcode.length < 8) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);
      if (newPasscode.length === 8) {
        if (newPasscode === CORRECT_PASSCODE) {
          setTimeout(() => {
            setStep('question');
            setPasscode('');
          }, 400);
        } else {
          setError(true);
          setTimeout(() => {
            setPasscode('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleClear = () => setPasscode('');

  const restartApp = () => {
    setStep('passcode');
    setPasscode('');
    setEnvelopeOpened(false);
    setError(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-[#FFF5F7] overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-rose-200"
      ref={containerRef}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,1)_0%,_rgba(255,182,193,0.15)_100%)] pointer-events-none" />
      {[...Array(15)].map((_, i) => (
        <FloatingHeart key={i} delay={i * 2} />
      ))}

      <AnimatePresence mode="wait">
        <BackgroundMusic />
        {/* STEP 1: 8-Digit Passcode */}
        {step === 'passcode' && (
          <motion.div
            key="passcode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-10 bg-white/80 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-white text-center max-w-[320px] w-full mx-4 max-h-[90vh] overflow-y-auto hide-scrollbar"
          >
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-rose-50 rounded-full text-rose-500 shadow-inner">
                <Heart size={28} fill="currentColor" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-rose-800 mb-1 font-serif">Unlock My Heart</h2>
            <p className="text-rose-400 text-[10px] mb-4 uppercase tracking-widest font-semibold">Enter 8-Digit Code</p>
            
            <div className="flex justify-center flex-wrap gap-1.5 mb-6 max-w-[240px] mx-auto">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={error ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                  className={`w-3 h-3 rounded-full border-2 border-rose-200 transition-all duration-300 ${passcode.length > i ? 'bg-rose-500 border-rose-500 scale-110' : 'bg-white/50'}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className="aspect-square rounded-xl bg-white hover:bg-rose-50 text-rose-800 font-bold text-lg shadow-sm transition-all active:scale-95 border border-rose-100 flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handleKeyPress('0')}
                className="aspect-square rounded-xl bg-white hover:bg-rose-50 text-rose-800 font-bold text-lg shadow-sm transition-all active:scale-95 border border-rose-100 flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handleClear}
                className="aspect-square rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-400 flex items-center justify-center transition-all active:scale-95"
              >
                <Undo2 size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Question */}
        {step === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 text-center max-w-sm w-full pt-8"
          >
            <motion.img 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              src="https://i.pinimg.com/originals/c2/cb/e1/c2cbe1195c5b11936dff31438e2bb3c9.gif" 
              className="w-48 h-48 mx-auto mb-6 drop-shadow-xl rounded-full border-4 border-white shadow-rose-200 shadow-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-3xl font-black text-rose-800 mb-8 font-serif uppercase tracking-tight">เธอรักเค้ามั้ยยยย? ❤️</h2>
            <div className="grid grid-cols-2 gap-4 px-8">
              <button
                onClick={() => setStep('envelope')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                รักมากก
              </button>
              <button
                onClick={() => setStep('denied')}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-100 transition-all active:scale-95"
              >
                รัก
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2.5: Denied Logic Loop */}
        {step === 'denied' && (
          <motion.div
            key="denied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 text-center max-w-sm w-full mx-4"
          >
            <motion.img 
              src="https://i.pinimg.com/originals/86/2e/8c/862e8c07cf761d7170fc8957b10dd04c.gif" 
              className="w-56 h-56 mx-auto mb-6 rounded-3xl border-4 border-white shadow-xl object-cover"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-2xl font-bold text-rose-700 mb-6 font-serif leading-tight px-4">
              เธอไม่รักเค้า งอลแล่ว 😭<br/>
              <span className="text-lg font-sans mt-2 block">เลือกใหม่เดี๋ยวนี้เลยนะ!</span>
            </h2>
            <button
              onClick={() => setStep('question')}
              className="bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 px-10 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
            >
              เลือกใหม่ <RefreshCw size={18} />
            </button>
          </motion.div>
        )}

        {/* STEP 3: Gift Envelope */}
        {step === 'envelope' && (
          <div className="z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="relative w-72 h-52 sm:w-80 sm:h-60 perspective-1000 cursor-pointer"
              onClick={() => setEnvelopeOpened(true)}
            >
              {!envelopeOpened ? (
                <motion.div 
                  className="absolute inset-0 bg-rose-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-rose-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail size={64} className="text-white" />
                  <div className="absolute -top-3 -right-3 bg-yellow-400 p-2 rounded-full text-rose-600 animate-bounce shadow-md">
                    <Sparkles size={18} />
                  </div>
                  <p className="absolute bottom-4 font-bold text-white text-sm tracking-widest italic">กดเพื่อเปิด</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ translateZ: -100, opacity: 0 }}
                  animate={{ translateZ: 0, opacity: 1 }}
                  className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-rose-100 w-full min-h-[260px] flex flex-col items-center justify-center text-center -mt-16 absolute"
                >
                  <Heart className="text-rose-500 mb-3 animate-pulse" fill="currentColor" size={24} />
                  <h3 className="text-2xl font-black text-rose-800 mb-3 font-serif italic">Surprise! 🎁</h3>
                  <p className="text-sm text-rose-600 leading-relaxed font-medium">
                    ขอบคุณที่อยู่ด้วยกันมาตลอด 365 วันนะเธอ! <br/>
                    เธอเป็นคนที่เข้ามาเปลี่ยนชีวีตเค้ามากเลย <br/>
                    ถ้าไม่มีเธอเค้าคงจะเหงามากๆ ไม่มีใครให้กวน <br/>
                    เค้ารักที่สุดในโลกเลย รักนะจุ๊ฟมั๊วฟ์ 💖
                  </p>
                  <Sparkles className="text-yellow-400 absolute top-3 left-3" />
                  <Sparkles className="text-yellow-400 absolute bottom-3 right-3" />
                </motion.div>
              )}
            </motion.div>

            {envelopeOpened && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setStep('gallery')}
                className="mt-12 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-all flex items-center justify-center active:scale-90"
              >
                <ChevronRight size={28} />
              </motion.button>
            )}
          </div>
        )}

        {/* STEP 4: Memory Wall Gallery */}
        {step === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 w-full h-full flex flex-col items-center overflow-hidden"
          >
            <div className="pt-8 pb-4 text-center">
              <h2 className="text-2xl font-black text-rose-800 mb-1 font-serif">Memory Wall 📸</h2>
              <p className="text-xs text-rose-500 italic font-medium">ทุกความทรงจำมีเธออยู่ตลอด 12 M...</p>
            </div>
            
            <div className="flex-1 overflow-y-auto w-full px-6 py-4 hide-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto pb-10">
                {memoryImages.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ rotate: 0, scale: 1.05, zIndex: 50 }}
                    style={{ rotate: `${img.rotation}deg` }}
                    className="bg-white p-2 pb-6 rounded-sm shadow-xl border border-gray-100"
                  >
                    <div className="aspect-square overflow-hidden mb-2">
                      <img 
                        src={img.url} 
                        alt="Memory"
                        className="w-full h-full object-cover grayscale-50"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={() => setStep('thanks')}
              className="mt-2 mb-8 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-all flex items-center justify-center active:scale-95"
            >
              <ChevronRight size={28} />
            </motion.button>
          </motion.div>
        )}

        {/* STEP 5: Thank You & Restart */}
        {step === 'thanks' && (
          <motion.div
            key="thanks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 text-center max-w-lg w-full px-4 h-full flex flex-col justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                filter: ["drop-shadow(0 0 0 rgba(244,63,94,0))", "drop-shadow(0 0 20px rgba(244,63,94,0.4))", "drop-shadow(0 0 0 rgba(244,63,94,0))"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8 inline-block"
            >
              <Heart size={80} fill="#f43f5e" className="text-rose-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-rose-600 mb-4 font-serif tracking-tighter">THANK U 4 luv me!</h1>
            <p className="text-lg text-rose-800 font-medium mb-12 leading-relaxed">
              ขอบคุณที่ร่วมเดินทางมาด้วยกันนะ <br/>
              ขอให้ทุกวันเป็นวันที่ดีของเราสองคนนะ
            </p>
            
            <button
              onClick={restartApp}
              className="bg-white/80 backdrop-blur-md border-2 border-rose-100 text-rose-500 font-bold py-4 px-10 rounded-2xl shadow-lg hover:bg-rose-50 transition-all flex items-center justify-center gap-3 mx-auto uppercase tracking-widest text-xs"
            >
              <RefreshCw size={18} /> ดูใหม่ อุอิอา
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@400;600;800;900&display=swap');
          
          .font-serif { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Inter', sans-serif; }
          .perspective-1000 { perspective: 1000px; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
}
