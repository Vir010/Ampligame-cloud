"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { addUserPoints, checkAchievements } from "@/lib/achievements";
import { grantCardsForGame } from "@/lib/steamCards";
import { showToast } from "@/lib/toast";
import { fetchLibrary, purchaseGame, purchaseReference } from "@/lib/wallet";

interface BuyButtonProps {
  gameId: string;
  title: string;
  price: string;
  image?: string;
}

export default function BuyButton({ gameId, title, price }: BuyButtonProps) {
  const [purchased, setPurchased] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMounted(true);

    fetchLibrary()
      .then((items) => {
        if (cancelled) return;
        const owned = items.some(
          (i) =>
            i.status !== "refunded" &&
            (i.game?.documentId === gameId || String(i.game?.id) === gameId)
        );
        setPurchased(owned);
      })
      .catch(() => {
        /* не авторизован — кнопка останется активной, ошибка придёт при покупке */
      });

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  const handleBuy = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        showToast("Войдите в аккаунт, чтобы купить игру", "error");
        return;
      }

      const result = await purchaseGame(gameId, purchaseReference(user.id, gameId));

      addUserPoints(50);
      checkAchievements();
      const grantedCards = grantCardsForGame(gameId, title);

      setPurchased(true);
      showToast(
        `Игра "${title}" куплена! Баланс: ${result.balance} ₽, +50 поинтов, +${grantedCards} карточек`,
        "success"
      );
    } catch (err: any) {
      const message = err?.message || "Не удалось выполнить покупку";
      if (err?.status === 400 && /недостаточно/i.test(message)) {
        showToast(`Недостаточно средств. ${message}`, "error");
      } else {
        showToast(message, "error");
      }
    } finally {
      setBusy(false);
    }
  };

  if (!mounted)
    return (
      <button className="product-buy-btn sellgame1" disabled>
        Загрузка...
      </button>
    );
  if (purchased)
    return (
      <button className="product-buy-btn sellgame1" disabled>
        Куплено
      </button>
    );

  return (
    <button className="product-buy-btn sellgame1" onClick={handleBuy} disabled={busy}>
      {busy ? "Обработка..." : "Купить"}
    </button>
  );
}
