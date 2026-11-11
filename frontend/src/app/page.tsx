import { fetchFromStrapi } from "@/lib/strapi";
import GameGrid from "@/components/store/GameGrid";
import MyLibraryPreview from "@/components/store/MyLibraryPreview";
import SwiperBanner from "@/components/store/SwiperBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let games: any[] = [];

  try {
    const result = await fetchFromStrapi("games");
    const raw = Array.isArray(result) ? result : result?.data ?? [];

    games = raw.map((g: any) => ({
      ...g,
      id: g.documentId ?? g.id,
      title: g.Title || "Без названия",
      price: g.Price ?? 0,
      description: g.Description || "Описание отсутствует",
      developer: g.developer || "Неизвестно",
      genre: g.Genre || "Не указан",
      image: g.Cover?.url
        ? `http://127.0.0.1:1337${g.Cover.url}`
        : "/placeholder.png",
    }));

    console.log("[home] games.length =", games.length);
  } catch (error) {
    console.error("[home] Ошибка Strapi:", error);
  }

  return (
    <main>
      {/* Карусель (ваш SwiperBanner) */}
      <SwiperBanner />

      {/* Мои игры (купленные) */}
      <MyLibraryPreview />

      {/* Популярные игры из Strapi */}
      <section className="store-content">
        <h2 className="store-games-title">Популярные игры</h2>
        <GameGrid games={games} searchQuery="" />
      </section>
    </main>
  );
}
