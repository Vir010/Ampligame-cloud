'use client';
import { useState } from 'react';
import { products } from '@/data/products';

export default function LibraryCard({ game, onRemove }: any) {
  const [installed, setInstalled] = useState(
    typeof window !== 'undefined' ? localStorage.getItem(`game_installed_${game.id}`) === 'true' : false
  );
  const [loading, setLoading] = useState(false);

  const cover = game.image || products[game.id]?.image || '/img/default-avatar.svg';

  const handleInstall = () => {
    if (installed) return;
    setLoading(true);

    // Имитация загрузки торрент-файла
    setTimeout(() => {
      // Создаем фейковый торрент-файл
      const torrentContent = `d8:announce13:http://ampligame.ru/announce4:infod6:length0e4:name${game.title.length}:${game.title}12:piece lengthi16384e6:pieces0:ee`;
      const blob = new Blob([torrentContent], { type: 'application/x-bittorrent' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${game.title.replace(/[^a-zA-Z0-9а-яА-Я]/g, '_')}.torrent`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setInstalled(true);
      setLoading(false);
      localStorage.setItem(`game_installed_${game.id}`, 'true');
      
      if (typeof window !== 'undefined') {
        // Тост через кастомное событие или напрямую
        alert(`Игра "${game.title}" установлена! Торрент-файл скачан.`);
      }
    }, 2000);
  };

  const handleRemove = () => {
    if (confirm(`Удалить "${game.title}" из библиотеки?`)) onRemove(game.id);
  };

  return (
    <div className={`library-card ${installed ? 'game-card-installed' : ''}`}>
      <div className="library-card-image-wrap">
        <img src={cover} alt={game.title} />
        <span className="library-status-badge">{installed ? 'Готова' : 'Доступна'}</span>
      </div>
      <div className="library-card-body">
        <h4>{game.title}</h4>
        <div className="library-card-info">
          <p><span>Куплена:</span> <strong>{game.purchaseDate || 'Недавно'}</strong></p>
        </div>
        <div className="library-card-buttons">
          <button 
            className={`library-install-btn ${installed ? 'installed' : ''}`} 
            onClick={handleInstall} 
            disabled={installed || loading}
          >
            {loading ? 'Загрузка...' : installed ? '✓ Установлено' : 'Установить'}
          </button>
          <button className="library-remove-btn" onClick={handleRemove}>Удалить</button>
        </div>
      </div>
    </div>
  );
}
