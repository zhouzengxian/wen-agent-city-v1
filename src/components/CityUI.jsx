import useCityStore from '../store/useCityStore';

export default function CityUI() {
  const selectedAgent = useCityStore((s) => s.selectedAgent);
  const deselectAgent = useCityStore((s) => s.deselectAgent);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px 28px',
      pointerEvents: 'none',
    }}>
      {/* 左侧标题区 */}
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
        {/* 装饰分隔线 */}
        <div style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, rgba(201,169,110,0.6), transparent)',
          marginTop: '10px',
        }} />
        <div style={{
          fontSize: '10px',
          color: 'rgba(201,169,110,0.35)',
          marginTop: '6px',
          letterSpacing: '0.1em',
        }}>
          点击 Agent 展开对话 · 拖拽旋转视角
        </div>
      </div>

      {/* 右侧当前选中信息 */}
      {selectedAgent && (
        <div style={{
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
          transition: 'all 0.3s',
        }}
          onClick={deselectAgent}
        >
          <span style={{
            fontSize: '32px',
            textShadow: `0 0 12px ${selectedAgent.color}`,
          }}>
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
          <div style={{
            fontSize: '11px',
            opacity: 0.4,
            marginLeft: '8px',
            whiteSpace: 'nowrap',
          }}>
            ✕ 关闭
          </div>
        </div>
      )}
    </div>
  );
}
