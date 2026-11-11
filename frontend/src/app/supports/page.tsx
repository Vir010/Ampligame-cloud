"use client";

import { useState, useEffect } from "react";
import {
  fetchFaqs,
  fetchContacts,
  fetchUsefulLinks,
  fetchRequirements,
} from "@/lib/strapi";

export default function SupportPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchFaqs().catch((e) => {
        console.error("FAQ:", e);
        return [];
      }),
      fetchContacts().catch((e) => {
        console.error("Contacts:", e);
        return [];
      }),
      fetchUsefulLinks().catch((e) => {
        console.error("Links:", e);
        return [];
      }),
      fetchRequirements().catch((e) => {
        console.error("Requirements:", e);
        return [];
      }),
    ]).then(([f, c, l, r]) => {
      setFaqs(f);
      setContacts(c);
      setLinks(l);
      setRequirements(r);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={{ padding: "30px", color: "#fff" }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "32px",
        }}
      >
        Центр поддержки
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px",
        }}
      >
        {/* 1. ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ (FAQ) */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "20px",
            padding: "25px",
            border: "1px solid #2a2a2a",
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginTop: 0,
              borderBottom: "2px solid #8f3ed1",
              paddingBottom: "10px",
              display: "inline-block",
            }}
          >
            Часто задаваемые вопросы
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {faqs.length === 0 && (
              <p style={{ color: "#aaa" }}>Вопросов пока нет</p>
            )}
            {faqs.map((faq) => (
              <div
                key={faq.documentId}
                style={{
                  background: "#222",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() =>
                    setOpenFaq(
                      openFaq === faq.documentId ? null : faq.documentId
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  {/* Берем поле question (как в вашем JSON) */}
                  {faq.question || faq.Question || "Вопрос без названия"}
                  <span style={{ color: "#8f3ed1", fontSize: "20px" }}>
                    {openFaq === faq.documentId ? "−" : "+"}
                  </span>
                </button>
                {openFaq === faq.documentId && (
                  <div
                    style={{
                      padding: "0 15px 15px",
                      color: "#aaa",
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {/* Берем поле answer (как в вашем JSON) */}
                    {faq.answer || faq.Answer || "Ответ отсутствует"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. СВЯЗАТЬСЯ С НАМИ (CONTACTS) */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "20px",
            padding: "25px",
            border: "1px solid #2a2a2a",
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginTop: 0,
              borderBottom: "2px solid #8f3ed1",
              paddingBottom: "10px",
              display: "inline-block",
            }}
          >
            Связаться с нами
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {contacts.length === 0 && (
              <p style={{ color: "#aaa" }}>Контактов пока нет</p>
            )}
            {contacts.map((contact) => (
              <div
                key={contact.documentId}
                style={{
                  background: "#222",
                  padding: "15px",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  {/* Универсальный поиск названия */}
                  <div style={{ color: "#fff", fontWeight: "bold" }}>
                    {contact.Title ||
                      contact.title ||
                      contact.Name ||
                      contact.name ||
                      "Контакт"}
                  </div>
                  {/* Универсальный поиск описания */}
                  <div style={{ color: "#aaa", fontSize: "13px" }}>
                    {contact.Description ||
                      contact.description ||
                      contact.Value ||
                      contact.value ||
                      ""}
                  </div>
                </div>
                {/* Кнопка, если есть ссылка */}
                {(contact.Link ||
                  contact.link ||
                  contact.Url ||
                  contact.url) && (
                  <a
                    href={
                      contact.Link || contact.link || contact.Url || contact.url
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "8px 16px",
                      background: "#8f3ed1",
                      color: "#fff",
                      borderRadius: "20px",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    {contact.ButtonText || contact.buttonText || "Перейти"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. СИСТЕМНЫЕ ТРЕБОВАНИЯ (REQUIREMENTS) */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "20px",
            padding: "25px",
            border: "1px solid #2a2a2a",
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginTop: 0,
              borderBottom: "2px solid #8f3ed1",
              paddingBottom: "10px",
              display: "inline-block",
            }}
          >
            Системные требования
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {requirements.length === 0 && (
              <p style={{ color: "#aaa" }}>Требований пока нет</p>
            )}
            {requirements.map((req) => (
              <div
                key={req.documentId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px dashed #333",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ color: "#8f3ed1", fontWeight: "bold" }}>
                  •{" "}
                  {req.Title || req.title || req.Name || req.name || "Параметр"}
                </span>
                <span style={{ color: "#fff" }}>
                  {req.Value ||
                    req.value ||
                    req.Description ||
                    req.description ||
                    ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ПОЛЕЗНЫЕ ССЫЛКИ (USEFUL LINKS) */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "20px",
            padding: "25px",
            border: "1px solid #2a2a2a",
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginTop: 0,
              borderBottom: "2px solid #8f3ed1",
              paddingBottom: "10px",
              display: "inline-block",
            }}
          >
            Полезные ссылки
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {links.length === 0 && (
              <p style={{ color: "#aaa" }}>Ссылок пока нет</p>
            )}
            {links.map((link) => (
              <a
                key={link.documentId}
                href={link.Url || link.url || link.Link || link.link || "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#b4a8ff",
                  textDecoration: "none",
                  fontSize: "15px",
                }}
              >
                {link.Title || link.title || link.Name || link.name || "Ссылка"}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
