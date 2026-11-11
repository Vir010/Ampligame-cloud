'use client';
import { useState, useEffect } from 'react';
import { getJSON } from '@/lib/storage';
import { getWishlist } from '@/lib/wishlist';
import { products } from '@/data/products';
import { getCards, getBadges, getCraftableGames, craftBadge, SteamCard } from '@/lib/steamCards';
import LibraryCard from '@/components/library/LibraryCard';
import SteamCardComp from '@/components/library/SteamCard';
import GameCard from '@/components/store/GameCard';
import EmptyState from '@/components/ui/EmptyState';
import { showToast } from '@/lib/toast';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'games' | 'wishlist' | 'cards'>('games');
  const [games, setGames] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cards, setCards] = useState<SteamCard[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    // Дедуплицируем игры
    const rawGames = getJSON<any[]>('user_game_library', []);
    const uniqueGames = rawGames
      .filter((g, i, arr) => g && g.id && arr.findIndex(x => x && x.id === g.id) === i)
      .map(g => {
        // Если нет image, берем из products
        if (!g.image && products[g.id]) {
          return { ...g, image: products[g.id].image };
        }
        return g;
      });
    setGames(uniqueGames);

    // Wishlist уже дедуплицирован в getWishlist()
    setWishlist(getWishlist());

    // Карточки уже отфильтрованы в getCards()
    setCards(getCards());
    setBadges(getBadges());
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleRemoveGame = (id: string) => {
    const updated = games.filter(g => g.id !== id);
    setGames(updated);
    localStorage.setItem('user_game_library', JSON.stringify(updated));
    showToast('Игра удалена из библиотеки', 'info');
  };

  const handleCraft = (gameId: string) => {
    if (confirm('Скрафтить значок? 5 уникальных карточек этой игры будут потрачены.')) {
      if (craftBadge(gameId)) {
        showToast('Значок создан!', 'success');
        loadData();
      } else {
        showToast('Ошибка при крафте', 'error');
      }
    }
  };

  if (!mounted) return null;

  const craftable = getCraftableGames();

  // Группировка карточек
  const cardsByGame = cards.reduce((acc: Record<string, SteamCard[]>, c) => {
    if (!acc[c.gameId]) acc[c.gameId] = [];
    acc[c.gameId].push(c);
    return acc;
  }, {});

  return (
    <div className="library-page" style={{ display: 'block', padding: '20px' }}>
      <div className="library-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => { setActiveTab('games'); loadData(); }} style={{ padding: '10px 24px', cursor: 'pointer', background: activeTab === 'games' ? '#8f3ed1' : 'rgba(26,26,26,0.8)', color: '#fff', border: '1px solid #8f3ed1', borderRadius: '20px', fontWeight: 'bold' }}>
          Библиотека ({games.length})
        </button>
        <button onClick={() => { setActiveTab('wishlist'); loadData(); }} style={{ padding: '10px 24px', cursor: 'pointer', background: activeTab === 'wishlist' ? '#8f3ed1' : 'rgba(26,26,26,0.8)', color: '#fff', border: '1px solid #8f3ed1', borderRadius: '20px', fontWeight: 'bold' }}>
          Wishlist ({wishlist.length})
        </button>
        <button onClick={() => { setActiveTab('cards'); loadData(); }} style={{ padding: '10px 24px', cursor: 'pointer', background: activeTab === 'cards' ? '#8f3ed1' : 'rgba(26,26,26,0.8)', color: '#fff', border: '1px solid #8f3ed1', borderRadius: '20px', fontWeight: 'bold' }}>
          Карточки ({cards.length})
        </button>
      </div>

      {activeTab === 'games' && (
        <div>
          <h2 className="library-title">Моя библиотека</h2>
          {games.length === 0 ? (
            <EmptyState desc="В библиотеке пока нет игр." linkText="Перейти в магазин" linkHref="/store" />
          ) : (
            <div className="library-grid">
              {games.map((g, i) => <LibraryCard key={`${g.id}_${i}`} game={g} onRemove={handleRemoveGame} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          <h2 className="library-title">Список желаемого</h2>
          {wishlist.length === 0 ? (
            <EmptyState desc="Список желаемого пуст." linkText="Перейти в магазин" linkHref="/store" />
          ) : (
            <div className="games-grid">
              {wishlist.map((gameId, i) => {
                const product = products[gameId];
                if (!product) return null;
                return <GameCard key={`${gameId}_${i}`} gameId={gameId} product={product} onWishlistToggle={loadData} />;
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'cards' && (
        <div>
          <h2 className="library-title">Steam-карточки</h2>

          {craftable.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg, rgba(143,62,209,0.15), rgba(0,200,255,0.1))', border: '1px solid #8f3ed1', borderRadius: '15px', padding: '20px', marginBottom: '25px' }}>
              <h3 style={{ color: '#b4a8ff', margin: '0 0 15px 0', fontSize: '18px' }}>Доступно для крафта</h3>
              {craftable.map(g => (
                <div key={g.gameId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', padding: '12px 15px', borderRadius: '10px', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{g.gameTitle}</span>
                  <button onClick={() => handleCraft(g.gameId)} style={{ padding: '8px 20px', background: '#4caf50', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                    Скрафтить значок
                  </button>
                </div>
              ))}
            </div>
          )}

          {badges.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#b4a8ff', margin: '0 0 15px 0', fontSize: '18px' }}>Ваши значки</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {badges.map((b, i) => (
                  <div key={`${b.id}_${i}`} style={{ background: 'linear-gradient(135deg, rgba(143,62,209,0.25), rgba(161,16,206,0.15))', border: '1px solid #8f3ed1', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="#ffaa00" style={{ margin: '0 auto 10px' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{b.gameTitle}</div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '5px' }}>{b.craftedDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cards.length === 0 ? (
            <EmptyState desc="У вас пока нет карточек. Купите игру — получите 3 карточки!" linkText="Перейти в магазин" linkHref="/store" />
          ) : (
            <div>
              <h3 style={{ color: '#b4a8ff', margin: '0 0 15px 0', fontSize: '18px' }}>Все ваши карточки</h3>
              {Object.entries(cardsByGame).map(([gameId, gameCards]) => {
                const uniqueIndices = new Set(gameCards.map(c => c.index));
                return (
                  <div key={gameId} style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>{gameCards[0].gameTitle}</h4>
                      <span style={{ color: uniqueIndices.size >= 5 ? '#4caf50' : '#b4a8ff', fontWeight: 'bold', fontSize: '14px' }}>{uniqueIndices.size} / 5</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {gameCards.map((c, i) => (
                        <SteamCardComp key={`${c.id}_${i}`} gameTitle={c.gameTitle} index={c.index} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
