import { useState, useRef } from 'react';
import useCityStore from '../store/useCityStore';
import { agentMoments, getTodayPosts, getAutoReply } from '../data/agentMoments';
import { agents } from '../data/gameData';

// ====== 手机主容器 ======
export default function PhoneApp() {
  const phoneOpen = useCityStore((s) => s.phoneOpen);
  const phoneScreen = useCityStore((s) => s.phoneScreen);
  const togglePhone = useCityStore((s) => s.togglePhone);
  const closePhone = useCityStore((s) => s.closePhone);
  const setPhoneScreen = useCityStore((s) => s.setPhoneScreen);

  if (!phoneOpen) {
    // 收起态：右侧悬浮图标
    return (
      <div onClick={togglePhone} style={{
        position: 'fixed', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 50,
        background: 'linear-gradient(135deg, #07C160, #06AD56)', borderRadius: '12px 0 0 12px',
        padding: '12px 6px', cursor: 'pointer', color: '#fff', fontSize: '18px',
        writingMode: 'vertical-rl', letterSpacing: '0.2em', fontFamily: '"Noto Serif SC",serif',
        boxShadow: '-2px 0 16px rgba(0,0,0,0.4)', transition: 'all 0.3s',
        userSelect: 'none',
      }}
        onMouseOver={(e) => { e.target.style.transform = 'translateY(-50%) scale(1.05)'; }}
        onMouseOut={(e) => { e.target.style.transform = 'translateY(-50%) scale(1)'; }}
      >
        朋 友 圈
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', right: '16px', top: '50%', transform: 'translateY(-50%)',
      zIndex: 50, display: 'flex', flexDirection: 'column',
    }}>
      {/* 手机外壳 */}
      <div style={{
        width: '340px', height: '620px',
        background: '#1a1a1a',
        borderRadius: '28px',
        border: '3px solid #333',
        padding: '8px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 2px #222',
        position: 'relative',
      }}>
        {/* 刘海 */}
        <div style={{
          position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
          width: '120px', height: '20px', background: '#111',
          borderRadius: '0 0 14px 14px', zIndex: 2,
        }} />
        {/* 状态栏 */}
        <div style={{
          height: '28px', background: '#1a1a1a', borderRadius: '20px 20px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 30px', color: '#888', fontSize: '10px', fontFamily: 'system-ui,sans-serif',
        }}>
          <span>9:41</span>
          <span>📶 🔋</span>
        </div>

        {/* 屏幕内容 */}
        <div style={{
          width: '100%', height: 'calc(100% - 28px - 44px)',
          background: '#EDEDED', overflow: 'hidden', borderRadius: '0 0 16px 16px',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* 微信标题栏 */}
          <div style={{
            background: '#EDEDED', padding: '8px 14px',
            borderBottom: '1px solid #d9d9d9',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontSize: '15px', fontWeight: 700, color: '#1a1a1a',
            fontFamily: 'system-ui,sans-serif',
          }}>
            {phoneScreen === 'moments' && '朋友圈'}
            {phoneScreen === 'contacts' && '通讯录'}
            {phoneScreen === 'profile' && '我'}
          </div>

          {/* 屏幕内容 */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {phoneScreen === 'moments' && <MomentsScreen />}
            {phoneScreen === 'contacts' && <ContactsScreen />}
            {phoneScreen === 'profile' && <ProfileScreen />}
          </div>
        </div>

        {/* 底部导航 */}
        <div style={{
          height: '44px', background: '#F7F7F7', borderRadius: '0 0 16px 16px',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          borderTop: '1px solid #d9d9d9', fontSize: '10px', fontFamily: 'system-ui,sans-serif',
        }}>
          <NavItem icon="💬" label="朋友圈" active={phoneScreen === 'moments'} onClick={() => setPhoneScreen('moments')} />
          <NavItem icon="👥" label="通讯录" active={phoneScreen === 'contacts'} onClick={() => setPhoneScreen('contacts')} />
          <NavItem icon="👤" label="我" active={phoneScreen === 'profile'} onClick={() => setPhoneScreen('profile')} />
        </div>
      </div>
      {/* 关闭按钮 */}
      <div onClick={closePhone} style={{
        alignSelf: 'center', marginTop: '6px', color: '#666', fontSize: '20px', cursor: 'pointer',
        transition: 'all 0.2s', userSelect: 'none',
      }}
        onMouseOver={(e) => { e.target.style.color = '#fff'; }}
        onMouseOut={(e) => { e.target.style.color = '#666'; }}
      >▼</div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
      cursor: 'pointer', color: active ? '#07C160' : '#999', transition: 'color 0.2s',
      userSelect: 'none',
    }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span style={{ fontSize: '9px' }}>{label}</span>
    </div>
  );
}

// ====== 朋友圈 ======
function MomentsScreen() {
  const userProfile = useCityStore((s) => s.userProfile);
  const friends = useCityStore((s) => s.friends);
  const toggleLike = useCityStore((s) => s.toggleLike);
  const likes = useCityStore((s) => s.likes);

  if (!userProfile) {
    return <LoginPrompt />;
  }

  if (friends.length === 0) {
    return <EmptyMoments />;
  }

  // 生成朋友圈Feed - 每人1-3条
  const feed = [];
  friends.forEach((agentId) => {
    const agentData = agentMoments[agentId];
    if (!agentData) return;
    const todayPosts = getTodayPosts(agentId);
    todayPosts.forEach((post) => {
      const likeKey = `${agentId}|${post.postIndex}`;
      feed.push({
        agentId, name: agentData.name, avatar: agentData.avatar, color: agentData.color,
        text: post.text, image: post.image, time: post.time,
        postIndex: post.postIndex,
        liked: !!likes[likeKey],
        likeKey,
      });
    });
  });
  feed.sort((a, b) => b.time.localeCompare(a.time));

  // 加上封面
  return (
    <div style={{ paddingBottom: '10px' }}>
      {/* 朋友圈封面 */}
      <div style={{
        height: '180px', background: 'linear-gradient(180deg, #1a2a3a 0%, #0a1a2a 50%, #EDEDED 90%)',
        position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '12px',
      }}>
        <div style={{
          position: 'absolute', bottom: '60px', right: '12px',
          color: '#f5e6ca', fontSize: '13px', fontFamily: '"Noto Serif SC",serif',
          opacity: 0.6,
        }}>
          文淵城
        </div>
        {/* 用户头像+名字 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #C9A96E, #8B5E3C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: '#fff',
          }}>
            {userProfile.avatar || '👤'}
          </div>
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'system-ui,sans-serif' }}>
            {userProfile.name}
          </div>
        </div>
      </div>

      {/* 动态列表 */}
      {feed.map((item) => (
        <MomentCard key={item.likeKey} item={item} onLike={() => toggleLike(item.agentId, item.postIndex)} />
      ))}
    </div>
  );
}

function MomentCard({ item, onLike }) {
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [agentReply, setAgentReply] = useState(null);
  const inputRef = useRef(null);

  const handleLike = () => {
    if (!item.liked) {
      setShowLikeAnim(true);
      setTimeout(() => setShowLikeAnim(false), 600);
    }
    onLike();
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    const reply = getAutoReply(item.agentId, replyText.trim());
    setAgentReply(reply);
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #e8e8e8',
      padding: '12px 14px', position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '4px',
          background: item.color, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '18px', flexShrink: 0,
        }}>
          {item.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: item.color, marginBottom: '4px', fontFamily: 'system-ui,sans-serif' }}>
            {item.name}
          </div>
          <div style={{ fontSize: '12px', color: '#333', lineHeight: 1.6, fontFamily: 'system-ui,sans-serif', wordBreak: 'break-word' }}>
            {item.text}
          </div>
          {/* 配图 */}
          <div style={{
            width: '100%', height: '56px', background: '#f5f5f5',
            borderRadius: '6px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '26px', marginTop: '8px',
          }}>
            {item.image}
          </div>
          {/* 底部 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ fontSize: '10px', color: '#aaa', fontFamily: 'system-ui,sans-serif' }}>
              今天 {item.time}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span onClick={(e) => { e.stopPropagation(); handleLike(); }} style={{
                cursor: 'pointer', fontSize: '15px', userSelect: 'none',
                transform: showLikeAnim ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.15s',
              }}>
                {item.liked ? '❤️' : '🤍'}
              </span>
              <span onClick={(e) => { e.stopPropagation(); setShowReply(!showReply); setAgentReply(null); }} style={{
                cursor: 'pointer', fontSize: '12px', color: '#999', userSelect: 'none',
                fontFamily: 'system-ui,sans-serif',
              }}>
                💬
              </span>
            </div>
          </div>

          {/* Agent回复 */}
          {agentReply && (
            <div style={{
              background: '#f0f0f0', borderRadius: '8px', padding: '8px 10px',
              marginTop: '8px', fontSize: '12px', color: '#555', lineHeight: 1.5,
              fontFamily: 'system-ui,sans-serif',
            }}>
              <span style={{ color: item.color, fontWeight: 600 }}>{item.name} 回复：</span>
              {agentReply}
            </div>
          )}

          {/* 回复输入框 */}
          {showReply && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
              <input
                ref={inputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                placeholder={`回复 ${item.name}...`}
                maxLength={50}
                autoFocus
                style={{
                  flex: 1, padding: '5px 8px', fontSize: '12px',
                  border: '1px solid #e0e0e0', borderRadius: '4px',
                  outline: 'none', fontFamily: 'system-ui,sans-serif',
                }}
              />
              <button onClick={handleReply} style={{
                padding: '5px 10px', fontSize: '11px', background: '#07C160',
                color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
                fontFamily: 'system-ui,sans-serif',
              }}>
                发送
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ====== 通讯录 ======
function ContactsScreen() {
  const userProfile = useCityStore((s) => s.userProfile);
  const friends = useCityStore((s) => s.friends);
  const addFriend = useCityStore((s) => s.addFriend);
  const removeFriend = useCityStore((s) => s.removeFriend);

  if (!userProfile) return <LoginPrompt />;

  return (
    <div>
      <div style={{ padding: '10px 14px', fontSize: '11px', color: '#999', fontFamily: 'system-ui,sans-serif' }}>
        已添加 {friends.length} 位好友 · 城邦共 {agents.length} 位居民
      </div>
      {agents.map((agent) => {
        const mom = agentMoments[agent.id];
        const isFr = friends.includes(agent.id);
        return (
          <div key={agent.id} style={{
            background: '#fff', borderBottom: '1px solid #ececec',
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '4px',
              background: agent.color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px', flexShrink: 0,
            }}>
              {agent.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#333', fontFamily: 'system-ui,sans-serif' }}>{agent.name}</div>
              <div style={{ fontSize: '10px', color: '#999', fontFamily: 'system-ui,sans-serif' }}>{agent.title}</div>
            </div>
            <button onClick={() => isFr ? removeFriend(agent.id) : addFriend(agent.id)} style={{
              border: isFr ? '1px solid #ddd' : '1px solid #07C160',
              background: isFr ? '#f5f5f5' : '#07C160',
              color: isFr ? '#999' : '#fff',
              borderRadius: '4px', padding: '3px 10px', fontSize: '11px',
              cursor: 'pointer', fontFamily: 'system-ui,sans-serif',
            }}>
              {isFr ? '已添加' : '+ 添加'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ====== 个人主页 ======
function ProfileScreen() {
  const userProfile = useCityStore((s) => s.userProfile);
  const friends = useCityStore((s) => s.friends);
  const logoutUser = useCityStore((s) => s.logoutUser);
  const [loginName, setLoginName] = useState('');
  const [loginAvatar, setLoginAvatar] = useState('👤');
  const loginUser = useCityStore((s) => s.loginUser);

  if (!userProfile) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏛️</div>
        <div style={{ fontSize: '14px', color: '#333', marginBottom: '20px', fontFamily: 'system-ui,sans-serif' }}>
          入驻文渊城，与古今智者为友
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
          {['👤','🧑‍💻','👩‍🎨','🧑‍🔬','👨‍🏫'].map((a) => (
            <span key={a} onClick={() => setLoginAvatar(a)} style={{
              fontSize: '24px', cursor: 'pointer', padding: '4px',
              borderRadius: '8px', background: loginAvatar === a ? '#e8e8e8' : 'transparent',
            }}>{a}</span>
          ))}
        </div>
        <input
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          placeholder="输入你的名字"
          maxLength={8}
          style={{
            width: '80%', padding: '8px 12px', fontSize: '13px', border: '1px solid #ddd',
            borderRadius: '6px', outline: 'none', fontFamily: 'system-ui,sans-serif', textAlign: 'center',
          }}
        />
        <button onClick={() => loginName.trim() && loginUser(loginName.trim(), loginAvatar)} style={{
          marginTop: '12px', width: '80%', padding: '8px', background: '#07C160',
          color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px',
          cursor: loginName.trim() ? 'pointer' : 'not-allowed',
          opacity: loginName.trim() ? 1 : 0.5, fontFamily: 'system-ui,sans-serif',
        }}>
          入驻文渊城
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 用户信息 */}
      <div style={{ background: '#fff', padding: '20px 14px', textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>{userProfile.avatar}</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#333', fontFamily: 'system-ui,sans-serif' }}>
          {userProfile.name}
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px', fontFamily: 'system-ui,sans-serif' }}>
          文渊城居民 · {friends.length} 位好友
        </div>
      </div>

      {/* 统计 */}
      <div style={{ background: '#fff', padding: '12px 14px', display: 'flex', textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#333' }}>{friends.length}</div>
          <div style={{ fontSize: '10px', color: '#999', fontFamily: 'system-ui,sans-serif' }}>好友</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#333' }}>{friends.length}</div>
          <div style={{ fontSize: '10px', color: '#999', fontFamily: 'system-ui,sans-serif' }}>今日动态</div>
        </div>
      </div>

      {/* 退出 */}
      <button onClick={logoutUser} style={{
        width: 'calc(100% - 28px)', margin: '10px 14px', padding: '10px',
        background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px',
        fontSize: '13px', color: '#ff4d4f', cursor: 'pointer', fontFamily: 'system-ui,sans-serif',
      }}>
        退出登录
      </button>
    </div>
  );
}

// ====== 辅助组件 ======
function LoginPrompt() {
  const setPhoneScreen = useCityStore((s) => s.setPhoneScreen);
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px', fontFamily: 'system-ui,sans-serif' }}>
        注册后查看城邦朋友圈
      </div>
      <button onClick={() => setPhoneScreen('profile')} style={{
        background: '#07C160', color: '#fff', border: 'none',
        borderRadius: '6px', padding: '8px 24px', fontSize: '13px', cursor: 'pointer',
        fontFamily: 'system-ui,sans-serif',
      }}>
        去注册
      </button>
    </div>
  );
}

function EmptyMoments() {
  const setPhoneScreen = useCityStore((s) => s.setPhoneScreen);
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px', fontFamily: 'system-ui,sans-serif' }}>
        还没有添加城邦好友<br />快去加几个Agent吧！
      </div>
      <button onClick={() => setPhoneScreen('contacts')} style={{
        background: '#07C160', color: '#fff', border: 'none',
        borderRadius: '6px', padding: '8px 24px', fontSize: '13px', cursor: 'pointer',
        fontFamily: 'system-ui,sans-serif',
      }}>
        去添加好友
      </button>
    </div>
  );
}
