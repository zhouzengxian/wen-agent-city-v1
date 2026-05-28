import { useState, useMemo } from 'react';
import useCityStore from '../store/useCityStore';
import { districts, tier1Agents, tier2Agents, tier3Agents, agents, connections } from '../data/gameData';

export default function CityUI() {
  const selectedAgent = useCityStore((s) => s.selectedAgent);
  const deselectAgent = useCityStore((s) => s.deselectAgent);
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const startDemo = useCityStore((s) => s.startDemo);
  const [showDistrictPanel, setShowDistrictPanel] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 搜索过滤
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return agents.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [searchQuery]);

  // 当前选中坊区的Agent
  const districtAgents = useMemo(() => {
    if (!selectedDistrict) return [];
    return agents.filter(a => a.district === selectedDistrict && a.tier <= 2).slice(0, 20);
  }, [selectedDistrict]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '16px 24px', pointerEvents: 'none',
    }}>
      {/* 左侧标题区 */}
      <div>
        <h1 style={{
          fontFamily: '"Noto Serif SC", serif', fontSize: '28px',
          color: '#e8f0ff', textShadow: '0 0 30px rgba(136,153,204,0.6), 0 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '0.3em', margin: 0, fontWeight: 700,
        }}>
          文 渊 城
        </h1>
        <div style={{
          fontSize: '11px', color: 'rgba(136,153,204,0.5)',
          letterSpacing: '0.2em', marginTop: '4px',
        }}>
          人类知识星河 · 1000位思想者互联
        </div>
        <div style={{
          width: '140px', height: '1px',
          background: 'linear-gradient(90deg, rgba(136,153,204,0.6), transparent)',
          marginTop: '8px',
        }} />

        {/* Demo按钮 + 坊区切换 */}
        {!demoPlaying && (
          <div style={{ marginTop: '12px', pointerEvents: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={startDemo}
              style={{
                background: 'linear-gradient(135deg, rgba(136,153,204,0.25), rgba(136,153,204,0.1))',
                border: '1px solid rgba(136,153,204,0.5)', borderRadius: '8px',
                color: '#e8f0ff', padding: '7px 16px',
                cursor: 'pointer', fontSize: '12px',
                fontFamily: '"Noto Serif SC", serif',
                letterSpacing: '0.05em', backdropFilter: 'blur(8px)',
                transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '5px',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(136,153,204,0.4), rgba(136,153,204,0.2))';
                e.target.style.boxShadow = '0 0 20px rgba(136,153,204,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(136,153,204,0.25), rgba(136,153,204,0.1))';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '14px' }}>▶</span> 六度知识对话
            </button>

            <button
              onClick={() => setShowDistrictPanel(!showDistrictPanel)}
              style={{
                background: showDistrictPanel
                  ? 'linear-gradient(135deg, rgba(136,153,204,0.35), rgba(136,153,204,0.2))'
                  : 'linear-gradient(135deg, rgba(136,153,204,0.15), rgba(136,153,204,0.05))',
                border: '1px solid rgba(136,153,204,0.4)', borderRadius: '8px',
                color: '#c0cde0', padding: '7px 12px',
                cursor: 'pointer', fontSize: '11px',
                fontFamily: '"Noto Serif SC", serif',
                letterSpacing: '0.05em', backdropFilter: 'blur(8px)',
              }}
            >
              🗂️ 十二坊区
            </button>

            {/* 搜索框 */}
            <div style={{ position: 'relative' }}>
              <input
                placeholder="搜索思想者..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(10,8,20,0.7)', border: '1px solid rgba(136,153,204,0.3)',
                  borderRadius: '8px', color: '#e8f0ff', padding: '6px 12px',
                  fontSize: '11px', outline: 'none', width: '140px',
                  fontFamily: '"Noto Serif SC", serif',
                  backdropFilter: 'blur(8px)',
                }}
              />
              {/* 搜索结果下拉 */}
              {filteredAgents.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '4px',
                  background: 'rgba(10,8,20,0.95)', border: '1px solid rgba(136,153,204,0.3)',
                  borderRadius: '8px', padding: '6px 0', minWidth: '160px',
                  maxHeight: '320px', overflowY: 'auto', zIndex: 20,
                  backdropFilter: 'blur(12px)',
                }}>
                  {filteredAgents.map(a => (
                    <div key={a.id}
                      onClick={() => {
                        useCityStore.getState().selectedAgent = a;
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '5px 12px', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: '6px', fontSize: '11px',
                        color: '#d0d8e8',
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(136,153,204,0.2)'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      <span>{a.emoji}</span>
                      <span style={{ color: a.color }}>{a.name}</span>
                      <span style={{ opacity: 0.5, marginLeft: 'auto', fontSize: '10px' }}>{a.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <span style={{
              fontSize: '10px', color: 'rgba(136,153,204,0.3)',
              alignSelf: 'center',
            }}>
              单击星星 · 拖拽旋转
            </span>
          </div>
        )}

        {/* 坊区面板 */}
        {showDistrictPanel && !demoPlaying && (
          <div style={{
            marginTop: '8px',
            background: 'rgba(10,8,20,0.85)', border: '1px solid rgba(136,153,204,0.25)',
            borderRadius: '10px', pointerEvents: 'auto', maxWidth: '480px',
            backdropFilter: 'blur(12px)', display: 'flex', flexWrap: 'wrap', gap: '5px',
            padding: '10px',
          }}>
            {districts.map(d => (
              <div key={d.id}
                onClick={() => setSelectedDistrict(selectedDistrict === d.id ? null : d.id)}
                style={{
                  padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '11px', fontFamily: '"Noto Serif SC", serif',
                  color: '#d0d8e8', letterSpacing: '0.03em',
                  background: selectedDistrict === d.id
                    ? 'rgba(136,153,204,0.3)'
                    : 'rgba(136,153,204,0.08)',
                  border: `1px solid ${selectedDistrict === d.id ? d.color + '80' : 'transparent'}`,
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: d.color, display: 'inline-block',
                }} />
                {d.name}
              </div>
            ))}
          </div>
        )}

        {/* 选中坊区的Agent列表 */}
        {selectedDistrict && districtAgents.length > 0 && !demoPlaying && (
          <div style={{
            marginTop: '6px', padding: '8px', background: 'rgba(10,8,20,0.85)',
            border: '1px solid rgba(136,153,204,0.25)', borderRadius: '10px',
            pointerEvents: 'auto', maxHeight: '200px', overflowY: 'auto',
            backdropFilter: 'blur(12px)', maxWidth: '280px',
          }}>
            {districtAgents.map(a => (
              <div key={a.id}
                onClick={() => {
                  useCityStore.getState().selectAgent(a, { x: 0, y: 0 });
                }}
                style={{
                  padding: '3px 8px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: '5px', fontSize: '11px',
                  color: '#c0cde0', fontFamily: '"Noto Serif SC", serif',
                  borderRadius: '4px',
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(136,153,204,0.15)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                <span style={{ fontSize: '12px' }}>{a.emoji}</span>
                <span style={{ color: a.color, fontWeight: 600 }}>{a.name}</span>
                <span style={{ opacity: 0.5, fontSize: '10px', marginLeft: 'auto' }}>{a.title}</span>
                <span style={{
                  fontSize: '9px', opacity: 0.4,
                  background: a.tier === 1 ? 'rgba(200,150,50,0.3)' : 'rgba(136,153,204,0.15)',
                  padding: '1px 4px', borderRadius: '3px',
                }}>
                  {a.tier === 1 ? '英雄' : '精英'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        <div style={{
          marginTop: '8px', display: 'flex', gap: '12px',
          fontSize: '10px', color: 'rgba(136,153,204,0.35)',
          fontFamily: '"Noto Serif SC", serif',
        }}>
          <span>✦ {agents.length}位思想者</span>
          <span>✦ 12个坊区</span>
          <span>✦ {connections.length}条知识连线</span>
        </div>
      </div>

      {/* 右侧Agent信息卡片 */}
      {selectedAgent && !demoPlaying && (
        <div
          onClick={deselectAgent}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(10,8,20,0.9)',
            border: '1px solid rgba(201,169,110,0.4)',
            borderRadius: '12px', padding: '14px 20px',
            color: '#f5e6ca', backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(201,169,110,0.1)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
            maxWidth: '360px',
          }}
        >
          <span style={{ fontSize: '36px', textShadow: `0 0 14px ${selectedAgent.color}` }}>
            {selectedAgent.emoji}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: selectedAgent.color }}>
              {selectedAgent.name}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
              {selectedAgent.title}
            </div>
            {selectedAgent.tier && (
              <div style={{
                fontSize: '9px', opacity: 0.5, marginTop: '2px',
                background: selectedAgent.tier === 1 ? 'rgba(200,150,50,0.2)' : 'rgba(136,153,204,0.15)',
                padding: '1px 6px', borderRadius: '3px', display: 'inline-block',
              }}>
                {selectedAgent.tier === 1 ? '★ 英雄级' : selectedAgent.tier === 2 ? '精英级' : '繁星级'}
              </div>
            )}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.4, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            ✕ 关闭
          </div>
        </div>
      )}
    </div>
  );
}
