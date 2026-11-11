"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchForumCategories } from "@/lib/strapi";
import { showToast } from "@/lib/toast";

export interface Topic {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: string;
  views: string;
  date: string;
}

export default function ForumsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: "",
    category: "general",
  });

  // Загрузка данных из Strapi (forum-categories)
  useEffect(() => {
    fetchForumCategories()
      .then((data) => {
        // Адаптируем данные Strapi под формат вашего Topic
        const adapted: Topic[] = data.map((item: any) => ({
          id: item.documentId,
          title: item.category_title || "Без названия",
          content: item.Description || "",
          author: item.Description?.replace("автор: ", "") || "Неизвестен",
          category: "general",
          replies: item.MessagesCount || "0",
          views: item.TopicsCount || "0",
          date: item.LastTime || "Недавно",
        }));
        setTopics(adapted);
      })
      .catch((err) => console.error("[forums] Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, []);

  // Создание темы (локально, без Strapi — так как это форма)
  const handleCreate = () => {
    if (!newTopic.title.trim()) return;
    const topic: Topic = {
      id: "t_" + Date.now(),
      title: newTopic.title.trim(),
      content: newTopic.content.trim() || "Без описания",
      author: "Вы",
      category: newTopic.category,
      replies: "0",
      views: "0",
      date: "Только что",
    };
    const updated = [topic, ...topics];
    setTopics(updated);
    setShowCreate(false);
    setNewTopic({ title: "", content: "", category: "general" });
    showToast("Тема создана!", "success");
  };

  const filtered = topics.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: "30px", color: "#fff" }}>Загрузка форумов...</div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1 style={{ color: "#fff", margin: 0 }}>Форумы</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Поиск по темам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "#fff",
              width: "250px",
            }}
          />
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "10px 20px",
              background: "#8f3ed1",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Новая тема
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.length === 0 ? (
          <p style={{ color: "#888" }}>Тем не найдено</p>
        ) : (
          filtered.map((t) => (
            <Link
              key={t.id}
              href={`/forums/${t.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  background: "#1a1a1a",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#8f3ed1";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#333";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(143,62,209,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8f3ed1",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 5px 0",
                      color: "#fff",
                      fontSize: "16px",
                    }}
                  >
                    {t.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    <span>Автор: {t.author}</span>
                    <span>💬 {t.replies}</span>
                    <span>👁 {t.views}</span>
                    <span>{t.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Модалка создания */}
      {showCreate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: "30px",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "500px",
              border: "1px solid #8f3ed1",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#fff" }}>Новая тема</h3>
            <input
              type="text"
              placeholder="Заголовок"
              value={newTopic.title}
              onChange={(e) =>
                setNewTopic({ ...newTopic, title: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#222",
                color: "#fff",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            />
            <select
              value={newTopic.category}
              onChange={(e) =>
                setNewTopic({ ...newTopic, category: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#222",
                color: "#fff",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            >
              <option value="general">Общие обсуждения</option>
              <option value="help">Помощь</option>
              <option value="esports">Киберспорт</option>
            </select>
            <textarea
              placeholder="Текст сообщения"
              value={newTopic.content}
              onChange={(e) =>
                setNewTopic({ ...newTopic, content: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#222",
                color: "#fff",
                marginBottom: "15px",
                minHeight: "100px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCreate}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#8f3ed1",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Создать
              </button>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#aaa",
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
