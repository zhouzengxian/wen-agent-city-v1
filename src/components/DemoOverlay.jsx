import { useState, useEffect, useRef } from 'react';
import useCityStore from '../store/useCityStore';
import { agents } from '../data/gameData';
import { demoScript } from '../data/demoScript';

const phaseNames = {
  aerial: '苍穹俯瞰 · 粒子汇聚',
  descent: '城邦降临 · 六坊亮灯',
  workshop: '坊间漫游 · 匠作工坊',
  encounter: '跨界偶遇 · 蝶纹飞行',
  dialogue: 'Agent对话 · 跨域交流',
  trace: '人脉溯源 · 脉络显现',
  welcome: '新人入驻 · 墨池加入',
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
    }, 50);
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
        position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 40, pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(10,8,20,0.7)',
          border: '1px solid rgba(201,169,110,0.3)',
          borderRadius: '20px',
          padding: '4px 16px',
          color: '#c9a96e',
          fontSize: '11px',
          fontFamily: '"Noto Serif SC", serif',
          letterSpacing: '0.1em',
          backdropFilter: 'blur(8px)',
        }}>
          {phaseLabel}
        </div>
      </div>

      {/* 对话气泡 */}
      {speaker && (
        <div style={{
          position: 'fixed', bottom: '130px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 40, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(20,12,35,0.95), rgba(10,8,25,0.95))',
          border: '1px solid rgba(201,169,110,0.5)',
          borderRadius: '14px', padding: '14px 20px',
          maxWidth: '440px', minWidth: '280px',
          color: '#f5e6ca', fontFamily: '"Noto Serif SC", serif', fontSize: '15px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(201,169,110,0.2)',
          animation: 'bubbleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{ fontSize: '12px', color: speaker.color, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>{speaker.emoji}</span>
            <span style={{ fontWeight: 600 }}>{speaker.name}</span>
          </div>
          <div style={{ lineHeight: 1.7, letterSpacing: '0.03em' }}>
            {displayedText}
            {charIndex < demoDialogue.text.length && (
              <span style={{
                display: 'inline-block', width: '2px', height: '16px',
                background: speaker.color, marginLeft: '2px',
                verticalAlign: 'text-bottom', animation: 'blink 0.8s infinite',
              }} />
            )}
          </div>
        </div>
      )}

      {/* 人脉溯源标签 */}
      {demoPhase === 'trace' && (
        <div style={{
          position: 'fixed', bottom: '140px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 40, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(20,12,35,0.9), rgba(10,8,25,0.9))',
          border: '1px solid rgba(201,169,110,0.4)',
          borderRadius: '12px', padding: '8px 18px',
          color: '#f5e6ca', fontFamily: '"Noto Serif SC", serif', fontSize: '13px',
          letterSpacing: '0.05em', backdropFilter: 'blur(8px)',
          animation: 'bubbleIn 0.3s ease-out',
        }}>
          🌐 知识脉络追溯中…
        </div>
      )}

      {/* 新人入驻标签 */}
      {demoPhase === 'welcome' && (
        <div style={{
          position: 'fixed', bottom: '140px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 40, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(20,12,35,0.9), rgba(10,8,25,0.9))',
          border: '1px solid rgba(184,197,214,0.5)',
          borderRadius: '12px', padding: '8px 18px',
          color: '#d8e0f0', fontFamily: '"Noto Serif SC", serif', fontSize: '13px',
          letterSpacing: '0.05em', backdropFilter: 'blur(8px)',
          animation: 'bubbleIn 0.3s ease-out',
        }}>
          🌙 墨池入驻文渊城，城邦迎来新伙伴
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
