import { useState, useEffect, useRef } from 'react';
import useCityStore from '../store/useCityStore';

export default function DialogueOverlay() {
  const dialogueVisible = useCityStore((s) => s.dialogueVisible);
  const dialogueText = useCityStore((s) => s.dialogueText);
  const selectedAgent = useCityStore((s) => s.selectedAgent);
  const bubblePosition = useCityStore((s) => s.bubblePosition);
  const deselectAgent = useCityStore((s) => s.deselectAgent);

  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const timerRef = useRef(null);

  // 流式打字效果
  useEffect(() => {
    if (!dialogueVisible || !dialogueText) {
      setDisplayedText('');
      setCharIndex(0);
      return;
    }
    setCharIndex(0);
    timerRef.current = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= dialogueText.length) {
          clearInterval(timerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 55);
    return () => clearInterval(timerRef.current);
  }, [dialogueVisible, dialogueText]);

  useEffect(() => {
    setDisplayedText(dialogueText.slice(0, charIndex));
  }, [charIndex, dialogueText]);

  if (!dialogueVisible || !selectedAgent) return null;

  return (
    <>
      {/* 半透明遮罩（点击关闭） */}
      <div
        onClick={deselectAgent}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 20,
          cursor: 'pointer',
        }}
      />

      {/* 对话气泡 */}
      <div
        style={{
          position: 'absolute',
          left: bubblePosition.x,
          top: bubblePosition.y,
          zIndex: 30,
          transform: 'translate(-50%, -130%)',
          background: 'linear-gradient(135deg, rgba(20,12,35,0.95), rgba(10,8,25,0.95))',
          border: '1px solid rgba(201,169,110,0.5)',
          borderRadius: '14px',
          padding: '14px 18px',
          color: '#f5e6ca',
          fontFamily: '"Noto Serif SC", serif',
          fontSize: '15px',
          maxWidth: '300px',
          minWidth: '200px',
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.6),
            0 0 24px rgba(201,169,110,0.2),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          animation: 'bubbleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 顶部装饰线 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '14px',
          right: '14px',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${selectedAgent.color}80, transparent)`,
        }} />

        {/* 说话者 */}
        <div style={{
          fontSize: '12px',
          color: selectedAgent.color,
          marginBottom: '8px',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '16px' }}>{selectedAgent.emoji}</span>
          <span style={{ fontWeight: 600 }}>{selectedAgent.name}</span>
          <span style={{ opacity: 0.5, fontSize: '10px' }}>· {selectedAgent.title}</span>
        </div>

        {/* 对话内容 */}
        <div style={{ lineHeight: 1.7, letterSpacing: '0.03em' }}>
          {displayedText}
          {charIndex < dialogueText.length && (
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '16px',
              background: selectedAgent.color,
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 0.8s infinite',
            }} />
          )}
        </div>

        {/* 底部三角 */}
        <div style={{
          position: 'absolute',
          bottom: '-7px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `8px solid rgba(20,12,35,0.95)`,
        }} />
      </div>

      {/* 底部信息面板 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        background: 'linear-gradient(135deg, rgba(12,8,30,0.94), rgba(8,5,22,0.94))',
        border: '1px solid rgba(201,169,110,0.4)',
        borderRadius: '14px',
        padding: '14px 22px',
        color: '#f5e6ca',
        fontSize: '13px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(201,169,110,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
      }}
        onClick={deselectAgent}
      >
        <span style={{
          fontSize: '28px',
          textShadow: `0 0 14px ${selectedAgent.color}`,
        }}>
          {selectedAgent.emoji}
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: selectedAgent.color, letterSpacing: '0.05em' }}>
            {selectedAgent.name}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.65, marginTop: '2px', lineHeight: 1.5 }}>
            {selectedAgent.description}
          </div>
        </div>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(180deg, transparent, rgba(201,169,110,0.3), transparent)',
          margin: '0 4px',
        }} />
        <div style={{ fontSize: '10px', opacity: 0.35, whiteSpace: 'nowrap' }}>
          点击空白处关闭
        </div>
      </div>
    </>
  );
}
