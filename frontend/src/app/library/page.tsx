'use client';
import { useState, useEffect, useCallback } from 'react';
import { getWishlist } from '@/lib/wishlist';
import { products } from '@/data/products';
import {
  getCards, getBadges, getCraftableGames, craftBadge, grantCardsForGame,
  pruneCards, hasBadgeForGame, SteamCard,
} from '@/lib/steamCards';
import { getLibrary, removeFromLibrary, buyCards, LibraryGame } from '@/lib/libraryApi';
import LibraryCard from '@/components/library/LibraryCard';
import SteamCardComp from '@/components/library/SteamCard';
import GameCard from '@/components/store/GameCard';
import EmptyState from '@/components/ui/EmptyState';
import { IconBadge, IconTrophy, IconCart, IconCheck, IconHammer } from '@/components/ui/Icons';
import { showToast } from '@/lib/toast';

const CARD_PRICE = 50;

function BadgeIcon({ gameTitle, gameImage }: { gameTitle: string; gameImage?: string }) {
  const letter = (gameTitle || '?').trim()[0]?.toUpperCase() || '?';
  if (gameImage) {
    return (
      <img src={gameImage} alt={gameTitle} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', border: '3px solid #ffaa00', boxShadow: '0 0 15px rgba(255,170,0,0.4)' }} />
    );
  }
  return (
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 10px', border: '3px solid #ffaa00', background: 'linear-gradient(135deg, #2a1b3d, #11061f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: '#ffaa00' }}>{letter}</div>
  );
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'games' | 'wishlist' | 'cards'>('games');
  const [games, setGames] = useState<LibraryGame[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cards, setCards] = useState<SteamCard[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buyingCard, setBuyingCard] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLibrary();
      const library = res.data || [];
      setGames(library);
      pruneCards(library.map((g: any) => String(g.id)));
    } catch {
      setGames([]);
    }
    setCards(getCards());
    setBadges(getBadges());
    setWishlist(getWishlist());
    setLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadData();
    window.addEventListener('libraryUpdated', loadData);
    window.addEventListener('cardsUpdated', loadData);
    return () => {
      window.removeEventListener('libraryUpdated', loadData);
      window.removeEventListener('cardsUpdated', loadData);
    };
  }, [loadData]);

  const handleRemoveGame = async (id: string) => {
    if (!confirm('Удалить игру из библиотеки?')) return;
    try {
      const res = await removeFromLibrary(id);
      setGames(res.library || []);
      showToast('Игра удалена из библиотеки', 'info');
      window.dispatchEvent(new Event('libraryUpdated'));
    } catch (err: any) {
      showToast(err.message || 'Ошибка удаления', 'error');
    }
  };

  const handleBuyCard = async (game: LibraryGame) => {
    if (buyingCard) return;
    if (hasBadgeForGame(game.id)) {
      showToast('Значок этой игры уже получен', 'info');
      return;
    }
    setBuyingCard(game.id);
    try {
      await buyCards({ count: 1, pricePerCard: CARD_PRICE });
      const granted = grantCardsForGame(game.id, game.title, game.image || undefined);
      if (granted > 0) showToast('Карточка куплена!', 'success');
      else showToast('Все карточки этой игры уже собраны', 'info');
      window.dispatchEvent(new Event('balanceUpdated'));
      setCards(getCards());
    } catch (err: any) {
      showToast(err.message || 'Ошибка покупки', 'error');
    } finally {
      setBuyingCard(null);
    }
  };

  const handleCraft = (gameId: string) => {
    if (hasBadgeForGame(gameId)) {
      showToast('Значок этой игры уже получен', 'info');
      return;
    }
    if (confirm('Скрафтить значок? 5 карточек этой игры будут потрачены.')) {
      if (craftBadge(gameId)) {
        showToast('Значок создан и добавлен в профиль!', 'success');
        loadData();
        window.dispatchEvent(new Event('cardsUpdated'));
      } else {
        showToast('Не удалось скрафтить значок', 'error');
      }
    }
  };

  if (!mounted) return null;

  const craftable = getCraftableGames();
  const cardsByGame = cards.reduce((acc: Record<string, SteamCard[]>, c) => {
    if (!acc[c.gameId]) acc[c.gameId] = [];
    acc[c.gameId].push(c);
    return acc;
  }, {});

  return (
    <div className="library-page" style={{ display: 'block', padding: '20px' }}>
      <div className="library-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('games')} style={{ padding: '10px 24px', cursor: 'pointer', background: activeTab === 'games' ? '#8f3ed1' : 'rgba(26,26,26,0.8)', color: '#fff', border: '1px solid #8f3ed1', borderRadius: '20px', fontWeight: 'bold' }}>
          Библиотека ({games.length})
        </button>
        <button onClick={() => setActiveTab('wishlist')} style={{ padding: '10px 24px', cursor: 'pointer', background: activeTab === 'wishlist' ? '#8f3ed1' : 'rgba(26,26,26,0.8)', color: '#fff', border: '1px solid #8f3ed1', borderRadius: '20px', fontWeight: 'bold' }}>
          Wishlist ({wishlist.length})
        </button>
        <button onClick={() => setActiveTab('cards')} style={{ padding: '10px 24px', cursor: 'pointer', background: activeTab === 'cards' ? '#8f3ed1' : 'rgba(26,26,26,0.8)', color: '#fff', border: '1px solid #8f3ed1', borderRadius: '20px', fontWeight: 'bold' }}>
          Карточки ({cards.length})
        </button>
      </div>

      {activeTab === 'games' && (
        <div>
          <h2 className="library-title">Моя библиотека</h2>
          {loading ? (
            <p style={{ color: '#888' }}>Загрузка...</p>
          ) : games.length === 0 ? (
            <EmptyState desc="В библиотеке пока нет игр." linkText="Перейти в магазин" linkHref="/store" />
          ) : (
            <div className="library-grid">
              {games.map((g) => (
                <LibraryCard key={g.id} game={g} onRemove={handleRemoveGame} />
              ))}
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
                return <GameCard key={`${gameId}_${i}`} gameId={gameId} product={product} />;
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'cards' && (
        <div>
          <h2 className="library-title">Карточки</h2>

          {games.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg, rgba(255,170,0,0.1), rgba(143,62,209,0.1))', border: '1px solid #ffaa00', borderRadius: '15px', padding: '20px', marginBottom: '25px' }}>
              <h3 style={{ color: '#ffaa00', margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconCart size={20} /> Купить карточку — {CARD_PRICE} ₽
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {games.map((g) => {
                  const gameCards = cards.filter((c) => String(c.gameId) === String(g.id));
                  const unique = new Set(gameCards.map((c) => c.index)).size;
                  const complete = unique >= 5;
                  const badgeAlready = hasBadgeForGame(g.id);
                  const disabled = complete || badgeAlready || buyingCard === g.id;

                  const statusText = badgeAlready
                    ? 'Значок уже получен'
                    : complete
                    ? 'Все 5 карточек собраны'
                    : `Собрано: ${unique} / 5`;

                  const statusColor = badgeAlready || complete ? '#4caf50' : '#888';
                  const showCheck = badgeAlready || complete;

                  const buttonText = buyingCard === g.id
                    ? '...'
                    : badgeAlready
                    ? 'Значок'
                    : complete
                    ? 'Готово'
                    : `Купить ${CARD_PRICE} ₽`;

                  const buttonBg = badgeAlready || complete ? '#555' : '#ffaa00';

                  return (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#222', padding: '12px 15px', borderRadius: '10px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        {g.image ? (
                          <img src={g.image} alt={g.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b4a8ff', fontWeight: 'bold' }}>
                            {(g.title || '?')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ color: '#fff', fontWeight: 'bold' }}>{g.title}</div>
                          <div style={{ color: statusColor, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {showCheck && <IconCheck size={12} />}
                            {statusText}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyCard(g)}
                        disabled={disabled}
                        style={{
                          padding: '8px 20px',
                          background: buttonBg,
                          border: 'none',
                          borderRadius: '8px',
                          color: badgeAlready || complete ? '#888' : '#000',
                          cursor: disabled ? 'default' : 'pointer',
                          fontWeight: 'bold',
                          opacity: buyingCard === g.id ? 0.6 : 1,
                        }}
                      >
                        {buttonText}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {craftable.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg, rgba(143,62,209,0.15), rgba(0,200,255,0.1))', border: '1px solid #8f3ed1', borderRadius: '15px', padding: '20px', marginBottom: '25px' }}>
              <h3 style={{ color: '#b4a8ff', margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconHammer size={20} /> Доступно для крафта
              </h3>
              {craftable.map((g) => (
                <div key={g.gameId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', padding: '12px 15px', borderRadius: '10px', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {g.gameImage && <img src={g.gameImage} alt={g.gameTitle} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffaa00' }} />}
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{g.gameTitle}</span>
                  </div>
                  <button onClick={() => handleCraft(g.gameId)} style={{ padding: '8px 20px', background: '#4caf50', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                    Скрафтить значок
                  </button>
                </div>
              ))}
            </div>
          )}

          {badges.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#b4a8ff', margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconBadge size={20} /> Значки
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                {badges.map((b, i) => (
                  <div key={`${b.id}_${i}`} style={{ background: 'linear-gradient(135deg, rgba(143,62,209,0.25), rgba(161,16,206,0.15))', border: '1px solid #8f3ed1', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                    <BadgeIcon gameTitle={b.gameTitle} gameImage={b.gameImage} />
                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{b.gameTitle}</div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '5px' }}>{b.craftedDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cards.length === 0 ? (
            <EmptyState desc={`У вас пока нет карточек. Купите карточку за ${CARD_PRICE} ₽ или игру в магазине (3 карточки в подарок).`} linkText="Перейти в магазин" linkHref="/store" />
          ) : (
            <div>
              <h3 style={{ color: '#b4a8ff', margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconTrophy size={20} /> Все ваши карточки
              </h3>
              {Object.entries(cardsByGame).map(([gameId, gameCards]) => {
                const uniqueIndices = new Set(gameCards.map((c) => c.index));
                return (
                  <div key={gameId} style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>{gameCards[0].gameTitle}</h4>
                      <span style={{ color: uniqueIndices.size >= 5 ? '#4caf50' : '#b4a8ff', fontWeight: 'bold', fontSize: '14px' }}>{uniqueIndices.size} / 5</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {gameCards.map((c, i) => (
                        <SteamCardComp key={`${c.id}_${i}`} gameTitle={c.gameTitle} index={c.index} image={c.gameImage} />
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
