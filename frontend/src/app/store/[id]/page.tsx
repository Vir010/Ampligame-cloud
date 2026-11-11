import { Metadata } from "next";
import { fetchFromStrapi } from "@/lib/strapi";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDescription from "@/components/store/ProductDescription";
import BuyButton from "@/components/store/BuyButton";
import ProductReviews from "@/components/store/ProductReviews";

function normalize(raw: any) {
  if (!raw) return null;
  const g = Array.isArray(raw) ? raw[0] : raw;
  if (!g) return null;

  return {
    id: g.documentId ?? g.id,
    title: g.Title || "Без названия",
    price: `${g.Price ?? 0} ₽`,
    priceNum: g.Price ?? 0,
    description: g.Description || "Описание отсутствует",
    developer: g.developer || "Неизвестно",
    genre: g.Genre || "Не указан",
    releaseDate: g.game_year ?? "—",
    image: g.Cover?.url
      ? `http://127.0.0.1:1337${g.Cover.url}`
      : "/placeholder.png",
    isSale: g.isSale,
    oldPrice: g.oldPrice,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let raw: any = null;
  try {
    raw = await fetchFromStrapi(`games/${id}`);
  } catch {}
  const product = normalize(raw);
  if (!product) return { title: "Игра не найдена | AMPLIGAME" };

  return {
    title: `${product.title} — купить в AMPLIGAME`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.substring(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let raw: any = null;
  try {
    raw = await fetchFromStrapi(`games/${id}`);
  } catch (e) {
    console.error("[game] Ошибка Strapi:", e);
  }

  const product = normalize(raw);
  if (!product) notFound();

  const discount =
    product.isSale && product.oldPrice && product.oldPrice > product.priceNum
      ? Math.round(
          ((product.oldPrice - product.priceNum) / product.oldPrice) * 100
        )
      : 0;

  return (
    <div className="product-page" style={{ padding: "20px" }}>
      <div
        className="product-container"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <Link
          href="/store"
          className="product-back-btn"
          style={{
            display: "inline-block",
            background: "#714197",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            marginBottom: "15px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Назад в магазин
        </Link>

        <div
          className="product-content"
          style={{
            display: "grid",
            gridTemplateColumns: "0.8fr 1.2fr",
            gap: "30px",
            background: "#1a1a1a",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <div className="product-image">
            <img
              src={product.image}
              alt={product.title}
              style={{ width: "100%", borderRadius: "15px" }}
            />
          </div>

          <div className="product-info">
            <h1
              style={{ fontSize: "32px", margin: "0 0 15px 0", color: "#fff" }}
            >
              {product.title}
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
                background: "rgba(0,0,0,0.3)",
                padding: "15px",
                borderRadius: "12px",
              }}
            >
              <span style={{ color: "#b4a8ff", fontSize: "14px" }}>
                Разработчик: {product.developer}
              </span>
              <span style={{ color: "#b4a8ff", fontSize: "14px" }}>
                Год: {product.releaseDate}
              </span>
              <span style={{ color: "#b4a8ff", fontSize: "14px" }}>
                Жанр: {product.genre}
              </span>
            </div>

            <ProductDescription text={product.description} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                background: "rgba(0,0,0,0.3)",
                padding: "15px",
                borderRadius: "12px",
                flexWrap: "wrap",
              }}
            >
              {discount > 0 ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      color: "#888",
                      textDecoration: "line-through",
                    }}
                  >
                    {product.oldPrice} ₽
                  </span>
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#4caf50",
                    }}
                  >
                    {product.price}
                  </span>
                  <span
                    style={{
                      background: "#ff4444",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    -{discount}%
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#8f3ed1",
                  }}
                >
                  {product.price}
                </span>
              )}

              <BuyButton
                gameId={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            </div>
          </div>
        </div>

        <ProductReviews gameId={product.id} gameTitle={product.title} />
      </div>
    </div>
  );
}
