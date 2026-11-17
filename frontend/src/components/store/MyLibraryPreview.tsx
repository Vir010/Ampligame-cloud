"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLibrary, LibraryGame } from "@/lib/libraryApi";

export default function MyLibraryPreview() {
  const [games, setGames] = useState<LibraryGame[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const res = await getLibrary();
        setGames(res.data || []);
      } catch {
        setGames([]);
      }
    };
    load();
    window.addEventListener('libraryUpdated', load);
    return () => window.removeEventListener('libraryUpdated', load);
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
          <Link key={g.id} href={`/store/${g.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 10 }}>
              <img
                src={g.image || "/img/default-avatar.svg"}
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
