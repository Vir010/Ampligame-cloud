'use client';
import { useState, useEffect } from 'react';
import { getCurrentUser, User } from '@/lib/auth';
import { getItem, setItem } from '@/lib/storage';
import { showToast } from '@/lib/toast';
import { useLang } from '@/lib/i18n';

const TABS = [
  { id: 'account', label: 'Аккаунт' },
  { id: 'profile', label: 'Профиль' },
  { id: 'privacy', label: 'Приватность' },
  { id: 'notifications', label: 'Уведомления' },
  { id: 'language', label: 'Язык' },
  { id: 'theme', label: 'Тема' },
  { id: 'security', label: 'Безопасность' },
  { id: 'payments', label: 'Платежи' },
];

export default function SettingsPage() {
  const { lang, setLang } = useLang();
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState('default');
  
  // Настройки
  const [privacy, setPrivacy] = useState({
    showStatus: true,
    showLibrary: true,
    allowFriends: false,
  });
  const [notifications, setNotifications] = useState({
    messages: true,
    sales: true,
    newGames: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
  });

  useEffect(() => {
    setUser(getCurrentUser());
    setTheme(getItem('app_theme') || 'default');
    applyTheme(getItem('app_theme') || 'default');

    // Загружаем сохраненные настройки
    setPrivacy(getItem('user_settings_privacy') ? JSON.parse(getItem('user_settings_privacy')!) : { showStatus: true, showLibrary: true, allowFriends: false });
    setNotifications(getItem('user_settings_notifications') ? JSON.parse(getItem('user_settings_notifications')!) : { messages: true, sales: true, newGames: false });
    setSecurity(getItem('user_settings_security') ? JSON.parse(getItem('user_settings_security')!) : { twoFactor: false });
  }, []);

  const applyTheme = (t: string) => {
    document.body.className = t === 'default' ? '' : `theme-${t}`;
    setItem('app_theme', t);
    setTheme(t);
  };

  const handleSavePrivacy = () => {
    setItem('user_settings_privacy', JSON.stringify(privacy));
    showToast('Настройки приватности сохранены', 'success');
  };

  const handleSaveNotifications = () => {
    setItem('user_settings_notifications', JSON.stringify(notifications));
    showToast('Настройки уведомлений сохранены', 'success');
  };

  const handleSaveSecurity = () => {
    setItem('user_settings_security', JSON.stringify(security));
    showToast('Настройки безопасности сохранены', 'success');
  };

  const themes = [
    { id: 'default', name: 'Стандартная' },
    { id: 'light', name: 'Светлая' },
    { id: 'blue', name: 'Синяя' },
    { id: 'maroon', name: 'Бордовая' },
    { id: 'glass', name: 'Стекло' },
  ];

  return (
    <div style={{ padding: '30px', display: 'flex', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Меню */}
      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Настройки</h2>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px', textAlign: 'left',
              background: activeTab === tab.id ? '#8f3ed1' : 'transparent',
              border: 'none', color: activeTab === tab.id ? '#fff' : '#aaa',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div style={{ flex: 1, background: '#1a1a1a', padding: '30px', borderRadius: '15px', border: '1px solid #333' }}>
        
        {activeTab === 'account' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Аккаунт</h3>
            <p style={{ color: '#aaa' }}>Email: <strong style={{ color: '#fff' }}>{user?.email}</strong></p>
            <p style={{ color: '#aaa' }}>ID: <strong style={{ color: '#fff' }}>{user?.id}</strong></p>
            <p style={{ color: '#aaa' }}>Дата регистрации: <strong style={{ color: '#fff' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}</strong></p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Профиль</h3>
            <p style={{ color: '#888' }}>Изменить аватар и никнейм можно в самом профиле.</p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Приватность</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacy.showStatus} onChange={e => setPrivacy({...privacy, showStatus: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                Показывать мой онлайн-статус
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacy.showLibrary} onChange={e => setPrivacy({...privacy, showLibrary: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                Показывать мою библиотеку игр
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacy.allowFriends} onChange={e => setPrivacy({...privacy, allowFriends: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                Разрешить добавлять в друзья
              </label>
            </div>
            <button onClick={handleSavePrivacy} style={{ padding: '12px 24px', background: '#8f3ed1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Сохранить</button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Уведомления</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.messages} onChange={e => setNotifications({...notifications, messages: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                Уведомления о новых сообщениях
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.sales} onChange={e => setNotifications({...notifications, sales: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                Уведомления о скидках
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.newGames} onChange={e => setNotifications({...notifications, newGames: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                Уведомления о выходе новых игр
              </label>
            </div>
            <button onClick={handleSaveNotifications} style={{ padding: '12px 24px', background: '#8f3ed1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Сохранить</button>
          </div>
        )}

        {activeTab === 'language' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Язык / Language</h3>
            <select 
              value={lang} 
              onChange={(e) => { setLang(e.target.value as 'ru' | 'en'); showToast('Язык изменен', 'success'); }}
              style={{ width: '100%', maxWidth: '300px', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff', marginBottom: '15px' }}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
            <p style={{ color: '#888', fontSize: '13px' }}>Изменение языка вступит в силу сразу</p>
          </div>
        )}

        {activeTab === 'theme' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Тема оформления</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {themes.map(t => (
                <button key={t.id} onClick={() => applyTheme(t.id)} style={{ padding: '15px 20px', borderRadius: '10px', border: theme === t.id ? '2px solid #8f3ed1' : '2px solid #333', background: theme === t.id ? 'rgba(143,62,209,0.2)' : '#222', color: '#fff', cursor: 'pointer' }}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Безопасность</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input 
                type="checkbox" 
                id="2fa" 
                checked={security.twoFactor} 
                onChange={e => setSecurity({...security, twoFactor: e.target.checked})} 
                style={{ width: '18px', height: '18px' }} 
              />
              <label htmlFor="2fa" style={{ color: '#ccc', cursor: 'pointer' }}>Включить двухфакторную аутентификацию</label>
            </div>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>Последний вход: Сегодня, 14:35</p>
            <button onClick={handleSaveSecurity} style={{ padding: '12px 24px', background: '#8f3ed1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Сохранить</button>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Платежи</h3>
            <p style={{ color: '#aaa', marginBottom: '10px' }}>Способ оплаты по умолчанию</p>
            <input type="text" value="**** **** **** 1234" disabled style={{ width: '100%', maxWidth: '300px', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#888', marginBottom: '15px' }} />
            <button style={{ display: 'block', padding: '12px 24px', background: 'transparent', border: '1px solid #8f3ed1', color: '#8f3ed1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Добавить новый способ</button>
          </div>
        )}

      </div>
    </div>
  );
}
