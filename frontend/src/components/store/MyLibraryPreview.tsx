"use client";

import { useEffect, useState } from "react";
import { getJSON } from "@/lib/storage";
import Link from "next/link";

export default function MyLibraryPreview() {
  const [games, setGames] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = getJSON<any[]>("user_game_library", []);

    // 1. Оставляем только записи с id
    // 2. Убираем дубликаты по id
    const unique = raw
      .filter((g) => g && g.id)
      .filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i);

    setGames(unique);
  }, []);

  if (!mounted) return null;
  if (games.length === 0) return null;

  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ color: "#fff" }}>Мои игры</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {games.map((g) => (
          <Link
            key={g.id}
            href={`/store/${g.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{ background: "#1a1a1a", borderRadius: 12, padding: 10 }}
            >
              <img
                src={g.image || "/placeholder.png"}
                alt={g.title || "Игра"}
                style={{ width: "100%", borderRadius: 8 }}
              />
              <p style={{ color: "#fff", margin: "8px 0 0" }}>
                {g.title || "Без названия"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
