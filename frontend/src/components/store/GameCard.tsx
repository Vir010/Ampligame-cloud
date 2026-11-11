"use client";

import { useState, useEffect } from "react";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { getJSON } from "@/lib/storage";
import QuickViewModal from "./QuickViewModal";

export default function GameCard({
  game,
  onWishlistToggle,
}: {
  game: any;
  onWishlistToggle?: () => void;
}) {
  const [inWishlist, setInWishlist] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [mounted, setMounted] = useState(false);

  const gameId = game?.documentId ?? "";

  const imageUrl = game?.Cover?.url
    ? `http://127.0.0.1:1337${game.Cover.url}`
    : "/img/placeholder.png";

  const oldPrice = game?.oldPrice || null;
  const currentPrice = game?.Price || 0;

  const discount =
    oldPrice && oldPrice > currentPrice
      ? Math.round((1 - currentPrice / oldPrice) * 100)
      : null;

  const normalizedProduct = {
    id: gameId,
    title: game?.Title || "Без названия",
    price: `${currentPrice} ₽`,
    priceNum: currentPrice,
    description: game?.Description || "Описание отсутствует",
    developer: game?.developer || "Неизвестно",
    genre: game?.Genre || "Не указан",
    image: imageUrl,
  };

  useEffect(() => {
    setMounted(true);
    if (!gameId) return;
    setInWishlist(isInWishlist(gameId));
    const library = getJSON<any[]>("user_game_library", []);
    setPurchased(library.some((g) => g.id === gameId || g.id === game?.id));
  }, [gameId, game?.id]);

  if (!game || !game.documentId) {
    return (
      <div
        className="game-card"
        style={{ padding: "20px", textAlign: "center" }}
      >
        Ошибка загрузки
      </div>
    );
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const added = toggleWishlist(gameId);
    setInWishlist(added);
    if (onWishlistToggle) onWishlistToggle();
  };

  const handleClick = () => {
    if (!purchased) setShowQuickView(true);
  };

  return (
    <>
      {showQuickView && (
        <QuickViewModal
          gameId={gameId}
          product={normalizedProduct}
          onClose={() => setShowQuickView(false)}
        />
      )}

      <div
        className="game-card"
        onClick={handleClick}
        style={{
          cursor: purchased ? "default" : "pointer",
          position: "relative",
          opacity: purchased ? 0.8 : 1,
        }}
      >
        {discount && !purchased && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "#ff4444",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "8px",
              zIndex: 10,
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            -{discount}%
          </span>
        )}

        {purchased && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "#4caf50",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "8px",
              zIndex: 10,
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            В библиотеке
          </span>
        )}

        <button
          className={`wish-btn ${inWishlist ? "active" : ""}`}
          onClick={handleWishlist}
          style={{ zIndex: 10 }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <img src={imageUrl} alt={game.Title} />
        <h4>{game.Title}</h4>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "10px 0",
          }}
        >
          {discount && !purchased ? (
            <>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                {oldPrice} ₽
              </span>
              <span
                style={{
                  color: "#4caf50",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {currentPrice} ₽
              </span>
            </>
          ) : (
            <span className="price">{currentPrice} ₽</span>
          )}
        </div>

        <button
          className="sellgame2"
          disabled={purchased}
          onClick={(e) => {
            e.stopPropagation();
            if (!purchased) setShowQuickView(true);
          }}
          style={
            purchased
              ? { background: "#2a475e", color: "#66c0f4", cursor: "default" }
              : {}
          }
        >
          {purchased ? "Куплено" : "Купить"}
        </button>
      </div>
    </>
  );
}
