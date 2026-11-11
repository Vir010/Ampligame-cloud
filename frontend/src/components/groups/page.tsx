"use client";

import { useEffect, useState } from "react";
import { fetchGroups } from "@/lib/strapi";
import GroupCard from "@/components/groups/GroupCard";
import { showToast } from "@/lib/toast";

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my" | "popular">("my");

  useEffect(() => {
    console.log("[groups] useEffect start");
    fetchGroups()
      .then((data) => {
        console.log("[groups] raw data =", data);
        setGroups(data);
      })
      .catch((err) => console.error("[groups] fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  console.log(
    "[groups] render, loading =",
    loading,
    "groups.length =",
    groups.length
  );

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#fff", margin: 0 }}>Группы и сообщества</h1>
        <button
          onClick={() => showToast("Создание группы (в разработке)", "info")}
          style={{
            background: "#8f3ed1",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + Создать группу
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("my")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: activeTab === "my" ? "#8f3ed1" : "#1a1a1a",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Мои группы ({groups.length})
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: activeTab === "popular" ? "#8f3ed1" : "#1a1a1a",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Популярные
        </button>
      </div>

      {loading && <p style={{ color: "#aaa" }}>Загрузка групп...</p>}

      {!loading && groups.length === 0 && (
        <p style={{ color: "#aaa" }}>Групп пока нет.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {groups.map((group) => (
          <GroupCard key={group.documentId} group={group} />
        ))}
      </div>
    </div>
  );
}
