"use client";

import { useState, useEffect } from "react";
import { getJSON, setJSON } from "@/lib/storage";
import { showToast } from "@/lib/toast";

interface GroupCardProps {
  group: any;
}

export default function GroupCard({ group }: GroupCardProps) {
  const [isMember, setIsMember] = useState(false);

  const groupId = group.documentId;
  const title = group.category_title || "Без названия";
  const description = group.Description || "Описание отсутствует";
  const members = group.TopicsCount || "0";
  const posts = group.MessagesCount || "0";
  const topColor = "#8f3ed1";

  useEffect(() => {
    if (!groupId) return;
    const myGroups = getJSON<string[]>("user_groups", []);
    setIsMember(myGroups.includes(groupId));
  }, [groupId]);

  const handleJoin = () => {
    const myGroups = getJSON<string[]>("user_groups", []);
    if (!myGroups.includes(groupId)) {
      myGroups.push(groupId);
      setJSON("user_groups", myGroups);
      setIsMember(true);
      showToast(`Вы вступили в группу "${title}"`, "success");
    }
  };

  const handleLeave = () => {
    const myGroups = getJSON<string[]>("user_groups", []);
    const updated = myGroups.filter((id) => id !== groupId);
    setJSON("user_groups", updated);
    setIsMember(false);
    showToast(`Вы вышли из группы "${title}"`, "info");
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        borderRadius: "12px",
        padding: "20px",
        color: "#fff",
        borderTop: `4px solid ${topColor}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "220px",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>{title}</h3>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
          {description}
        </p>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              {members}
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>участников</div>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{posts}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>постов</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => showToast("Переход в группу (в разработке)", "info")}
          style={{
            flex: 1,
            padding: "10px",
            background: "#8f3ed1",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Открыть
        </button>

        {isMember ? (
          <button
            onClick={handleLeave}
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "1px solid #ff4444",
              borderRadius: "8px",
              color: "#ff4444",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Выйти
          </button>
        ) : (
          <button
            onClick={handleJoin}
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "1px solid #4caf50",
              borderRadius: "8px",
              color: "#4caf50",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Вступить
          </button>
        )}
      </div>
    </div>
  );
}
