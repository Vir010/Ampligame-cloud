"use client";

import GameCard from "./GameCard";

export default function GameGrid({
  games,
  searchQuery,
}: {
  games: any[];
  searchQuery: string;
}) {
  if (!games || !Array.isArray(games)) {
    return <p style={{ color: "red" }}>Ошибка: данные не загружены</p>;
  }

  let filteredGames = games;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredGames = filteredGames.filter(
      (game) =>
        (game.title && game.title.toLowerCase().includes(q)) ||
        (game.genre && game.genre.toLowerCase().includes(q)) ||
        (game.developer && game.developer.toLowerCase().includes(q))
    );
  }

  if (filteredGames.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
        <p>Ничего не найдено{searchQuery ? ` по запросу "${searchQuery}"` : ""}</p>
      </div>
    );
  }

  return (
    <div className="games-grid">
      {filteredGames.map((game) => (
        <GameCard key={game.documentId || game.id} game={game} />
      ))}
    </div>
  );
}
