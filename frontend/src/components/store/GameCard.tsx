'use client';
import { useState } from 'react';
import { buyGame } from '@/lib/libraryApi';
import { grantCardsForGame } from '@/lib/steamCards';
import { showToast } from '@/lib/toast';

export default function GameCard(props: any) {
  const [loading, setLoading] = useState(false);
  const [owned, setOwned] = useState(false);

  const game = props.game || props.product || {};
  const id = String(game.documentId || game.id || props.gameId || '');
  const title = game.title || game.Title || 'Без названия';

  const rawPrice = game.price ?? game.Price ?? 0;
  const price = typeof rawPrice === 'number'
    ? rawPrice
    : Number(String(rawPrice).replace(/\D/g, '')) || 0;

  const image = game.image || (game.Cover?.url ? `http://127.0.0.1:1337${game.Cover.url}` : '');

  const handleBuy = async () => {
    if (loading || owned) return;
    if (!id) {
      showToast('У игры нет id — проверь публикацию в Strapi', 'error');
      return;
    }
    setLoading(true);
    try {
      await buyGame({ id, title, price, image });
      // Бонус: 3 карточки с обложкой игры
      const granted = grantCardsForGame(id, title, image || undefined);
      showToast(`Игра куплена! Бонус: ${granted} карточек`, 'success');
      setOwned(true);
      window.dispatchEvent(new Event('balanceUpdated'));
      window.dispatchEvent(new Event('libraryUpdated'));
      window.dispatchEvent(new Event('cardsUpdated'));
    } catch (err: any) {
      showToast(err.message || 'Ошибка покупки', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-card">
      <img src={image || '/img/default-avatar.svg'} alt={title} />
      <h4>{title}</h4>
      <span className="price">{price} ₽</span>
      <button className="sellgame2" onClick={handleBuy} disabled={loading || owned}>
        {loading ? 'Покупка...' : owned ? '✓ Куплено' : 'Купить'}
      </button>
    </div>
  );
}
