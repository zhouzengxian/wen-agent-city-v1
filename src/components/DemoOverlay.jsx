import { useState, useEffect, useRef } from 'react';
import useCityStore from '../store/useCityStore';
import { agents } from '../data/gameData';

const phaseNames = {
  aerial: '千星浮现 · 文渊城降临',
  descent: '十二坊亮灯 · 层峦叠嶂',
  philosophy: '第一度 · 庄子 ⇄ 德勒兹：块茎即逍遥游',
  web_rhizome: '第二度 · 德勒兹 ⇄ Kevin Kelly：失控即涌现',
  ai_emergence: '第三度 · Kelly ⇄ 黄仁勋：算力觉醒',
  art_hallucination: '第四度 · 黄仁勋 ⇄ Refik Anadol：机器的幻觉',
  philosophy_art: '第五度 · 达利 ⇄ 杜尚 ⇄ 鲍德里亚：何为艺术？',
  architecture_dream: '第六度 · 鲍德里亚 ⇄ 库哈斯 ⇄ 藤本壮介：从拟像到自然',
  east_root: '回归 · 庄子：天地有大美而不言',
  welcome: '墨池入驻 · 知识星河永续',
};

export default function DemoOverlay() {
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const demoDialogue = useCityStore((s) => s.demoDialogue);
  const demoPhase = useCityStore((s) => s.demoPhase);
  const endDemo = useCityStore((s) => s.endDemo);

  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!demoDialogue) {
      setDisplayedText(''); setCharIndex(0); return;
    }
    setCharIndex(0);
    timerRef.current = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= demoDialogue.text.length) { clearInterval(timerRef.current); return prev; }
        return prev + 1;
      });
    }, 45);
    return () => clearInterval(timerRef.current);
  }, [demoDialogue]);

  useEffect(() => {
    setDisplayedText((demoDialogue?.text || '').slice(0, charIndex));
  }, [charIndex, demoDialogue]);

  if (!demoPlaying) return null;

  const speaker = demoDialogue ? agents.find((a) => a.id === demoDialogue.speaker) : null;
  const phaseLabel = phaseNames[demoPhase] || '';

  return (
    <>
      {/* 场景标签 */}
      <div style={{
        position: 'fixed', top: '14px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 40, pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(10,8,20,0.75)',
          border: '1px solid rgba(201,169,110,0.35)',
          borderRadius: '20px',
          padding: '5px 18px',
          color: '#c9a96e',
          fontSize: '12px',
          fontFamily: '"Noto Serif SC", serif',
          letterSpacing: '0.08em',
          backdropFilter: 'blur(8px)',
        }}>
          {phaseLabel}
        </div>
      </div>

      {/* 对话气泡 */}
      {speaker && (
        <div style={{
          position: 'fixed', bottom: '110px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 40, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(20,12,35,0.96), rgba(10,8,25,0.96))',
          border: '1px solid rgba(201,169,110,0.5)',
          borderRadius: '14px', padding: '14px 20px',
          maxWidth: '500px', minWidth: '300px',
          color: '#f5e6ca', fontFamily: '"Noto Serif SC", serif', fontSize: '14px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(201,169,110,0.2)',
          animation: 'bubbleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{ fontSize: '12px', color: speaker.color, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>{speaker.emoji}</span>
            <span style={{ fontWeight: 600 }}>{speaker.name}</span>
            <span style={{ opacity: 0.5, fontSize: '10px' }}>· {speaker.title}</span>
          </div>
          <div style={{ lineHeight: 1.7, letterSpacing: '0.03em' }}>
            {displayedText}
            {charIndex < demoDialogue.text.length && (
              <span style={{
                display: 'inline-block', width: '2px', height: '15px',
                background: speaker.color, marginLeft: '2px',
                verticalAlign: 'text-bottom', animation: 'blink 0.8s infinite',
              }} />
            )}
          </div>
        </div>
      )}

      {/* 跳过按钮 */}
      <button
        onClick={endDemo}
        style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 40,
          background: 'rgba(20,12,35,0.8)',
          border: '1px solid rgba(201,169,110,0.4)',
          borderRadius: '8px', color: '#c9a96e',
          padding: '6px 16px', cursor: 'pointer',
          fontSize: '13px', fontFamily: '"Noto Serif SC", serif',
          backdropFilter: 'blur(8px)', transition: 'all 0.2s',
        }}
        onMouseOver={(e) => { e.target.style.background = 'rgba(201,169,110,0.2)'; e.target.style.borderColor = '#c9a96e'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(20,12,35,0.8)'; e.target.style.borderColor = 'rgba(201,169,110,0.4)'; }}
      >
        跳过 Demo ▸
      </button>
    </>
  );
}
