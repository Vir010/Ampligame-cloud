'use client';
import { useState, useEffect } from 'react';
import { getJSON, getItem, setItem } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { ACHIEVEMENTS_DEFINITIONS } from '@/data/achievements';
import PointsShop from '@/components/shop/PointsShop';
import { showToast } from '@/lib/toast';

const TABS = [
  { id: 'games', label: 'Игры' },
  { id: 'inventory', label: 'Инвентарь' },
  { id: 'screenshots', label: 'Скриншоты' },
  { id: 'videos', label: 'Видео' },
  { id: 'workshop', label: 'Мастерская' },
  { id: 'reviews', label: 'Обзоры' },
  { id: 'guides', label: 'Руководство' },
  { id: 'illustrations', label: 'Иллюстрации' },
];

const STATUS_LABELS: Record<string, string> = {
  online: 'В сети',
  away: 'Отошёл',
  dnd: 'Не беспокоить',
  invisible: 'Невидимка'
};

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('games');
  const [showShop, setShowShop] = useState(false);
  
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [status, setStatus] = useState('online');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const [games, setGames] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [workshop, setWorkshop] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [illustrations, setIllustrations] = useState<any[]>([]);
  const [unlockedAch, setUnlockedAch] = useState<string[]>([]);

  const [newItemName, setNewItemName] = useState('');
  const [videoForm, setVideoForm] = useState({ title: '', url: '' });
  const [workshopForm, setWorkshopForm] = useState({ title: '', url: '', desc: '' });
  const [guideForm, setGuideForm] = useState({ title: '', url: '', desc: '' });

  const loadData = () => {
    const rawGames = getJSON<any[]>('user_game_library', []);
    const uniqueGames = rawGames.filter((g, i, arr) => g && g.id && arr.findIndex(x => x && x.id === g.id) === i);
    setGames(uniqueGames);
    
    setInventory(getJSON('user_inventory', []));
    setScreenshots(getJSON('user_screenshots', []));
    setVideos(getJSON('user_videos', []));
    setWorkshop(getJSON('user_workshop', []));
    setReviews(getJSON('user_reviews', []));
    setGuides(getJSON('user_guides', []));
    setIllustrations(getJSON('user_illustrations', []));
    setUnlockedAch(getJSON('user_achievements', []));
    setBio(getItem('user_bio') || '');
    setStatus(getItem('user_status') || 'online');
  };

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentUser());
    loadData();
  }, []);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const updated = [...inventory, { name: newItemName.trim() }];
    setInventory(updated);
    setItem('user_inventory', JSON.stringify(updated));
    setNewItemName('');
    showToast('Предмет добавлен', 'success');
  };

  const handleRemoveItem = (idx: number) => {
    const updated = inventory.filter((_, i) => i !== idx);
    setInventory(updated);
    setItem('user_inventory', JSON.stringify(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'screenshots' | 'illustrations') => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: any) => {
      if (file.size > 2000000) {
        showToast('Файл слишком большой (макс 2MB)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        const current = getJSON<any[]>('user_' + type, []);
        current.push({ id: Date.now() + Math.random(), src: base64, date: new Date().toLocaleDateString('ru-RU') });
        setItem('user_' + type, JSON.stringify(current));
        if (type === 'screenshots') setScreenshots(current); else setIllustrations(current);
        showToast('Изображение загружено', 'success');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (idx: number, type: 'screenshots' | 'illustrations') => {
    const current = type === 'screenshots' ? screenshots : illustrations;
    const updated = current.filter((_, i) => i !== idx);
    setItem('user_' + type, JSON.stringify(updated));
    if (type === 'screenshots') setScreenshots(updated); else setIllustrations(updated);
  };

  const handleAddVideo = () => {
    if (!videoForm.title.trim() || !videoForm.url.trim()) return;
    const updated = [...videos, { title: videoForm.title.trim(), url: videoForm.url.trim(), date: new Date().toLocaleDateString('ru-RU') }];
    setVideos(updated);
    setItem('user_videos', JSON.stringify(updated));
    setVideoForm({ title: '', url: '' });
    showToast('Видео добавлено', 'success');
  };

  const handleRemoveVideo = (idx: number) => {
    const updated = videos.filter((_, i) => i !== idx);
    setVideos(updated);
    setItem('user_videos', JSON.stringify(updated));
  };

  const handleAddWorkshop = () => {
    if (!workshopForm.title.trim()) return;
    const updated = [...workshop, { ...workshopForm, date: new Date().toLocaleDateString('ru-RU') }];
    setWorkshop(updated);
    setItem('user_workshop', JSON.stringify(updated));
    setWorkshopForm({ title: '', url: '', desc: '' });
    showToast('Работа добавлена', 'success');
  };

  const handleRemoveWorkshop = (idx: number) => {
    const updated = workshop.filter((_, i) => i !== idx);
    setWorkshop(updated);
    setItem('user_workshop', JSON.stringify(updated));
  };

  const handleAddGuide = () => {
    if (!guideForm.title.trim()) return;
    const updated = [...guides, { ...guideForm, date: new Date().toLocaleDateString('ru-RU') }];
    setGuides(updated);
    setItem('user_guides', JSON.stringify(updated));
    setGuideForm({ title: '', url: '', desc: '' });
    showToast('Руководство добавлено', 'success');
  };

  const handleRemoveGuide = (idx: number) => {
    const updated = guides.filter((_, i) => i !== idx);
    setGuides(updated);
    setItem('user_guides', JSON.stringify(updated));
  };

  const handleSaveBio = () => {
    setItem('user_bio', bio);
    setIsEditingBio(false);
    showToast('Описание сохранено', 'success');
  };

  const handleStatusChange = (newStatus: string) => {
    setItem('user_status', newStatus);
    setStatus(newStatus);
    setShowStatusMenu(false);
    showToast(`Статус изменен: ${STATUS_LABELS[newStatus]}`, 'success');
  };

  if (!mounted || !user) return <div style={{ padding: '40px', color: '#fff' }}>Загрузка...</div>;

  const unlockedAchievements = ACHIEVEMENTS_DEFINITIONS.filter(a => unlockedAch.includes(a.id));

  return (
    <div className="profile-page" style={{ display: 'block', padding: '20px' }}>
      {showShop && <PointsShop onClose={() => { setShowShop(false); loadData(); }} />}
      
      <div className="profile-container" style={{ display: 'flex', gap: '40px', background: '#1a1a1a', padding: '30px', borderRadius: '20px', minHeight: '80vh' }}>
        
        <div className="profile-left" style={{ width: '300px', textAlign: 'center' }}>
          <div className="profile-avatar" style={{ margin: '0 auto 20px', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #8f3ed1' }}>
            <img src={user.avatar || '/img/default-avatar.svg'} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>{user.username}</h2>
          
          {/* Статус */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '15px' }}>
            <button 
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              style={{ background: '#222', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'online' ? '#4caf50' : status === 'dnd' ? '#ff4444' : status === 'away' ? '#ffaa00' : '#888' }}></span>
              {STATUS_LABELS[status]}
            </button>
            
            {showStatusMenu && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '5px', background: '#222', border: '1px solid #333', borderRadius: '10px', padding: '5px', zIndex: 10, minWidth: '150px' }}>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <button key={key} onClick={() => handleStatusChange(key)} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: '#ccc', textAlign: 'left', cursor: 'pointer', borderRadius: '5px', fontSize: '13px' }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Био */}
          <div style={{ marginBottom: '20px', background: '#222', padding: '10px', borderRadius: '10px' }}>
            {isEditingBio ? (
              <div>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Расскажите о себе..." style={{ width: '100%', padding: '8px', borderRadius: '5px', background: '#111', color: '#fff', border: '1px solid #8f3ed1', minHeight: '60px', marginBottom: '5px', fontSize: '13px' }} />
                <button onClick={handleSaveBio} style={{ width: '100%', padding: '6px', background: '#8f3ed1', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Сохранить</button>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: bio ? '#ccc' : '#888' }}>{bio || 'Описание отсутствует'}</p>
                <button onClick={() => setIsEditingBio(true)} style={{ background: 'none', border: 'none', color: '#8f3ed1', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>Редактировать</button>
              </div>
            )}
          </div>

          {/* Достижения */}
          <div style={{ background: '#222', padding: '15px', borderRadius: '15px', marginBottom: '20px', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#8f3ed1' }}>Значки <span style={{ color: '#b4a8ff' }}>{unlockedAch.length}</span></h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {unlockedAchievements.length === 0 ? (
                <span style={{ color: '#888', fontSize: '12px' }}>Пока нет достижений</span>
              ) : (
                unlockedAchievements.map(ach => (
                  <div 
                    key={ach.id} 
                    title={ach.title}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(143,62,209,0.4), rgba(161,16,206,0.3))', border: '1px solid #8f3ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b4a8ff' }}
                    dangerouslySetInnerHTML={{ __html: ach.svg.replace('width="22" height="22"', 'width="18" height="18"') }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Очки */}
          <div style={{ background: 'linear-gradient(135deg, rgba(255,170,0,0.2), rgba(255,102,0,0.1))', border: '1px solid rgba(255,170,0,0.5)', borderRadius: '15px', padding: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', background: '#ffaa00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>P</div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#ffcc80' }}>Очки</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffaa00' }}>{parseInt(getItem('user_points') || '0')}</div>
            </div>
            <button onClick={() => setShowShop(true)} style={{ padding: '8px 12px', background: '#ffaa00', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Магазин</button>
          </div>

          {/* Меню */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 15px', background: activeTab === tab.id ? '#8f3ed1' : 'transparent', border: '1px solid #8f3ed1', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left', fontSize: '13px' }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-right" style={{ flex: 1 }}>
          <h2 style={{ color: '#8f3ed1', borderBottom: '2px solid rgba(143,62,209,0.3)', paddingBottom: '10px', marginTop: 0 }}>
            {TABS.find(t => t.id === activeTab)?.label || 'Раздел'}
          </h2>

          {activeTab === 'games' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {games.length === 0 ? <p style={{ color: '#888' }}>Игр пока нет</p> : games.map(g => (
                <div key={g.id} style={{ display: 'flex', gap: '20px', background: '#222', padding: '15px', borderRadius: '10px', alignItems: 'center' }}>
                  <img src={g.image || '/img/default-avatar.svg'} alt={g.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div><h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{g.title}</h4><p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{g.purchaseDate}</p></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Название предмета" style={{ flex: 1, padding: '10px 15px', borderRadius: '10px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <button onClick={handleAddItem} style={{ padding: '10px 20px', background: '#8f3ed1', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Добавить</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {inventory.map((item, i) => (
                  <div key={i} style={{ background: '#222', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid #333', position: 'relative' }}>
                    {item.name}
                    <button onClick={() => handleRemoveItem(i)} style={{ position: 'absolute', top: 5, right: 5, background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '16px' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'screenshots' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ cursor: 'pointer', background: '#8f3ed1', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block' }}>
                  Загрузить скриншоты
                  <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'screenshots')} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {screenshots.map((img, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '100px' }}>
                    <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => handleRemoveMedia(i, 'screenshots')} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexDirection: 'column' }}>
                <input type="text" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} placeholder="Название видео" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <input type="text" value={videoForm.url} onChange={e => setVideoForm({...videoForm, url: e.target.value})} placeholder="YouTube URL" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <button onClick={handleAddVideo} style={{ padding: '10px', background: '#8f3ed1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Добавить</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {videos.map((v, i) => (
                  <div key={i} style={{ background: '#222', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <div><h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{v.title}</h4><a href={v.url} target="_blank" style={{ color: '#8f3ed1', fontSize: '12px' }}>{v.url}</a></div>
                    <button onClick={() => handleRemoveVideo(i)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '18px' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'workshop' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexDirection: 'column' }}>
                <input type="text" value={workshopForm.title} onChange={e => setWorkshopForm({...workshopForm, title: e.target.value})} placeholder="Название работы" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <input type="text" value={workshopForm.url} onChange={e => setWorkshopForm({...workshopForm, url: e.target.value})} placeholder="Ссылка на Steam Workshop" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <textarea value={workshopForm.desc} onChange={e => setWorkshopForm({...workshopForm, desc: e.target.value})} placeholder="Описание" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <button onClick={handleAddWorkshop} style={{ padding: '10px', background: '#8f3ed1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Добавить</button>
              </div>
              {workshop.map((w, i) => (
                <div key={i} style={{ background: '#222', padding: '15px', borderRadius: '10px', marginBottom: '10px', position: 'relative' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{w.title}</h4>
                  <a href={w.url} target="_blank" style={{ color: '#8f3ed1', fontSize: '12px' }}>{w.url}</a>
                  <p style={{ color: '#aaa', fontSize: '13px', marginTop: '5px' }}>{w.desc}</p>
                  <button onClick={() => handleRemoveWorkshop(i)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '18px' }}>×</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {reviews.length === 0 ? <p style={{ color: '#888' }}>Обзоров пока нет</p> : reviews.map((r, i) => (
                <div key={i} style={{ background: '#222', padding: '15px', borderRadius: '10px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>{r.gameTitle}</h4>
                  <p style={{ margin: 0, color: '#aaa' }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'guides' && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexDirection: 'column' }}>
                <input type="text" value={guideForm.title} onChange={e => setGuideForm({...guideForm, title: e.target.value})} placeholder="Название руководства" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <input type="text" value={guideForm.url} onChange={e => setGuideForm({...guideForm, url: e.target.value})} placeholder="Ссылка" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <textarea value={guideForm.desc} onChange={e => setGuideForm({...guideForm, desc: e.target.value})} placeholder="Краткое содержание" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }} />
                <button onClick={handleAddGuide} style={{ padding: '10px', background: '#8f3ed1', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Добавить</button>
              </div>
              {guides.map((g, i) => (
                <div key={i} style={{ background: '#222', padding: '15px', borderRadius: '10px', marginBottom: '10px', position: 'relative' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{g.title}</h4>
                  <a href={g.url} target="_blank" style={{ color: '#8f3ed1', fontSize: '12px' }}>{g.url}</a>
                  <p style={{ color: '#aaa', fontSize: '13px', marginTop: '5px' }}>{g.desc}</p>
                  <button onClick={() => handleRemoveGuide(i)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '18px' }}>×</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'illustrations' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ cursor: 'pointer', background: '#8f3ed1', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block' }}>
                  Загрузить иллюстрации
                  <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'illustrations')} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {illustrations.map((img, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '100px' }}>
                    <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => handleRemoveMedia(i, 'illustrations')} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
