"use client";

import { useState, useEffect } from "react";
import { startCloudSession, getActiveSession } from "@/lib/cloudApi";
import { showToast } from "@/lib/toast";

interface TariffCardProps {
  tariff: any;
  onPurchase?: () => void;
}

export default function TariffCard({ tariff, onPurchase }: TariffCardProps) {
  const [isCurrent, setIsCurrent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getActiveSession()
      .then((res) => {
        if (res?.session?.tariff?.Title === tariff.Title) setIsCurrent(true);
      })
      .catch(() => {});
  }, [tariff.Title]);

  const handleBuy = async () => {
    if (isCurrent || loading) return;
    setLoading(true);
    try {
      await startCloudSession(tariff.documentId);
      showToast(`Тариф "${tariff.Title}" активирован!`, "success");
      setIsCurrent(true);
      if (onPurchase) onPurchase();
    } catch (err: any) {
      showToast(err.message || "Ошибка покупки", "error");
    } finally {
      setLoading(false);
    }
  };

  const rawFeatures = tariff.features_list || "";
  const featuresList =
    typeof rawFeatures === "string" ? rawFeatures.split("\n").filter(Boolean) : [];

  return (
    <div
      className="tariff-card"
      style={{
        background: "linear-gradient(180deg, #2a1b3d 0%, #11061f 100%)",
        borderRadius: "20px",
        padding: "30px",
        color: "#fff",
        border: isCurrent ? "2px solid #4caf50" : "1px solid #4a2c6d",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "350px",
      }}
    >
      <h3 style={{ fontSize: "24px", margin: "0 0 20px 0", textAlign: "center" }}>{tariff.Title}</h3>
      <ul style={{ flex: 1, paddingLeft: "20px", color: "#ccc", lineHeight: 1.8, marginBottom: "20px", fontSize: "14px" }}>
        {featuresList.map((feature: string, idx: number) => (
          <li key={idx} style={{ marginBottom: "8px" }}>{feature}</li>
        ))}
      </ul>
      <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "15px", textAlign: "center" }}>
        {tariff.Price} ₽<span style={{ fontSize: "16px", color: "#888", fontWeight: "normal" }}>/мес</span>
      </div>
      <button
        onClick={handleBuy}
        disabled={isCurrent || loading}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          border: "none",
          background: isCurrent ? "#4caf50" : "#8f3ed1",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: isCurrent || loading ? "default" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Загрузка..." : isCurrent ? "Активен" : "Купить"}
      </button>
    </div>
  );
}
