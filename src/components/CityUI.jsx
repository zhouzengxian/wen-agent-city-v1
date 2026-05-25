import useCityStore from '../store/useCityStore';

export default function CityUI() {
  const selectedAgent = useCityStore((s) => s.selectedAgent);
  const deselectAgent = useCityStore((s) => s.deselectAgent);
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const startDemo = useCityStore((s) => s.startDemo);
  const endDemo = useCityStore((s) => s.endDemo);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      zIndex: 10,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px 28px',
      pointerEvents: 'none',
    }}>
      {/* 左侧标题 */}
      <div>
        <h1 style={{
          fontFamily: '"Noto Serif SC", serif',
          fontSize: '26px',
          color: '#f5e6ca',
          textShadow: '0 0 30px rgba(201,169,110,0.6), 0 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '0.3em',
          margin: 0,
          fontWeight: 700,
        }}>
          文 渊 城
        </h1>
        <div style={{
          fontSize: '11px',
          color: 'rgba(201,169,110,0.5)',
          letterSpacing: '0.25em',
          marginTop: '4px',
        }}>
          万物智能体互联 · 知识城邦
        </div>
        <div style={{
          width: '120px', height: '1px',
          background: 'linear-gradient(90deg, rgba(201,169,110,0.6), transparent)',
          marginTop: '10px',
        }} />

        {!demoPlaying && (
          <div style={{ marginTop: '14px', pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
            <button
              onClick={startDemo}
              style={{
                background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.1))',
                border: '1px solid rgba(201,169,110,0.5)',
                borderRadius: '8px',
                color: '#f5e6ca',
                padding: '8px 20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: '"Noto Serif SC", serif',
                letterSpacing: '0.05em',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(201,169,110,0.4), rgba(201,169,110,0.2))';
                e.target.style.boxShadow = '0 0 20px rgba(201,169,110,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.1))';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '16px' }}>▶</span> 播放 Demo
            </button>
            <span style={{
              fontSize: '10px',
              color: 'rgba(201,169,110,0.35)',
              alignSelf: 'center',
            }}>
              点击Agent展开对话 · 拖拽旋转视角
            </span>
          </div>
        )}
      </div>

      {/* 右侧信息 */}
      {selectedAgent && !demoPlaying && (
        <div
          onClick={deselectAgent}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(10,8,20,0.88)',
            border: '1px solid rgba(201,169,110,0.4)',
            borderRadius: '10px',
            padding: '12px 18px',
            color: '#f5e6ca',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 16px rgba(201,169,110,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '32px', textShadow: `0 0 12px ${selectedAgent.color}` }}>
            {selectedAgent.emoji}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: selectedAgent.color }}>
              {selectedAgent.name}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
              {selectedAgent.title}
            </div>
          </div>
          <div style={{ fontSize: '11px', opacity: 0.4, marginLeft: '8px', whiteSpace: 'nowrap' }}>
            ✕ 关闭
          </div>
        </div>
      )}
    </div>
  );
}
