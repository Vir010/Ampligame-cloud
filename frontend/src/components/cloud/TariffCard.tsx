"use client";

import { useState, useEffect } from "react";
import { getItem, setItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";

interface TariffCardProps {
  tariff: any;
}

export default function TariffCard({ tariff }: TariffCardProps) {
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    const currentTariff = getItem("user_active_tariff");
    setIsCurrent(currentTariff === tariff.documentId);
  }, [tariff.documentId]);

  const handleBuy = () => {
    // Если этот тариф уже активен, ничего не делаем
    if (isCurrent) return;

    const balance = parseInt(getItem("user_balance") || "0");
    const price = parseInt(String(tariff.Price).replace(/[^\d]/g, ""));

    if (balance < price) {
      showToast(
        `Недостаточно средств. Нужно ещё ${price - balance} ₽`,
        "error"
      );
      return;
    }

    // Списываем деньги и активируем тариф
    setItem("user_balance", String(balance - price));
    setItem("user_active_tariff", tariff.documentId);

    setIsCurrent(true);
    showToast(`Тариф "${tariff.Title}" активирован!`, "success");

    // Перезагрузка для обновления баланса в шапке
    setTimeout(() => window.location.reload(), 1000);
  };

  // Берем строку из features_list и разбиваем на массив по переносу строки
  const rawFeatures = tariff.features_list || "";
  const featuresList =
    typeof rawFeatures === "string"
      ? rawFeatures.split("\n").filter(Boolean)
      : [];

  return (
    <div
      className="tariff-card"
      style={{
        background: "linear-gradient(180deg, #2a1b3d 0%, #11061f 100%)",
        borderRadius: "20px",
        padding: "30px",
        color: "#fff",
        // Убрали opacity: 0, чтобы карточки не пропадали
        border: isCurrent ? "2px solid #4caf50" : "1px solid #4a2c6d",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "350px", // Чтобы карточки были одинаковыми по высоте
      }}
    >
      <h3
        style={{ fontSize: "24px", margin: "0 0 20px 0", textAlign: "center" }}
      >
        {tariff.Title}
      </h3>

      <ul
        style={{
          flex: 1,
          paddingLeft: "20px",
          color: "#ccc",
          lineHeight: 1.8,
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        {featuresList.map((feature: string, idx: number) => (
          <li key={idx} style={{ marginBottom: "8px" }}>
            {feature}
          </li>
        ))}
      </ul>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        {tariff.Price} ₽
        <span style={{ fontSize: "16px", color: "#888", fontWeight: "normal" }}>
          /мес
        </span>
      </div>

      <button
        onClick={handleBuy}
        disabled={isCurrent}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          border: "none",
          background: isCurrent ? "#4caf50" : "#8f3ed1",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: isCurrent ? "default" : "pointer",
        }}
      >
        {isCurrent ? "Активен" : "Купить"}
      </button>
    </div>
  );
}
