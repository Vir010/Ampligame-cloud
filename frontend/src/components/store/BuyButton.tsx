"use client";

import { useState, useEffect } from "react";
import { getJSON, setJSON, getItem, setItem } from "@/lib/storage";
import { addUserPoints, checkAchievements } from "@/lib/achievements";
import { grantCardsForGame } from "@/lib/steamCards";
import { showToast } from "@/lib/toast";

interface BuyButtonProps {
  gameId: string;
  title: string;
  price: string;
  image?: string;
}

export default function BuyButton({
  gameId,
  title,
  price,
  image,
}: BuyButtonProps) {
  const [purchased, setPurchased] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const library = getJSON<Array<{ id: string }>>("user_game_library", []);
    setPurchased(library.some((g) => g.id === gameId));
  }, [gameId]);

  const handleBuy = () => {
    const balance = parseInt(getItem("user_balance") || "1000");
    const priceNum = parseInt(price.replace(/[^\d]/g, ""));

    if (balance < priceNum) {
      showToast(
        `Недостаточно средств. Нужно ещё ${priceNum - balance} ₽`,
        "error"
      );
      return;
    }

    const library = getJSON<Array<any>>("user_game_library", []);
    if (library.some((g) => g.id === gameId)) {
      showToast("Игра уже куплена", "info");
      return;
    }

    setItem("user_balance", String(balance - priceNum));

    library.push({
      id: gameId,
      title,
      price,
      image: image || "/placeholder.png",
      purchaseDate: new Date().toLocaleDateString("ru-RU"),
    });
    setJSON("user_game_library", library);

    addUserPoints(50);
    checkAchievements();
    const grantedCards = grantCardsForGame(gameId, title);

    setPurchased(true);
    showToast(
      `Игра "${title}" куплена! +50 очков, +${grantedCards} карточек`,
      "success"
    );
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
    <button className="product-buy-btn sellgame1" onClick={handleBuy}>
      Купить
    </button>
  );
}
