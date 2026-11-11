"use client";
import { useRouter } from "next/navigation";

export default function QuickViewModal({
  gameId,
  product,
  onClose,
}: {
  gameId: string;
  product: any;
  onClose: () => void;
}) {
  const router = useRouter();

  const title = product?.title ?? "Без названия";
  const developer = product?.developer ?? "Неизвестно";
  const genre = product?.genre ?? "Не указан";
  const description = product?.description ?? "Описание отсутствует";
  const price = product?.price ?? "0 ₽";
  const image = product?.image ?? "/placeholder.png";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#1a1a1a",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "800px",
          border: "1px solid #8f3ed1",
          overflow: "hidden",
          display: "flex",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

        <div style={{ width: "40%", minWidth: "250px", padding: "30px" }}>
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "300px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ margin: "0 0 15px 0", color: "#fff", fontSize: "28px" }}>
            {title}
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "15px",
            }}
          >
            <span
              style={{
                background: "rgba(143,62,209,0.15)",
                color: "#b4a8ff",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            >
              Разработчик: {developer}
            </span>
            <span
              style={{
                background: "rgba(143,62,209,0.15)",
                color: "#b4a8ff",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            >
              Жанр: {genre}
            </span>
          </div>

          <p
            style={{
              color: "#aaa",
              fontSize: "14px",
              lineHeight: 1.6,
              marginBottom: "30px",
            }}
          >
            {String(description).substring(0, 200)}...
          </p>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #333",
              paddingTop: "20px",
            }}
          >
            <span
              style={{ fontSize: "24px", fontWeight: "bold", color: "#8f3ed1" }}
            >
              {price}
            </span>
            <button
              onClick={() => {
                onClose();
                router.push(`/store/${gameId}`);
              }}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #8f3ed1, #a110ce)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Подробнее{" "}
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
