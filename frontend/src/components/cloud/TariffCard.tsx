"use client";

import { useState, useEffect } from "react";
import { startCloudSession, getActiveSession } from "@/lib/cloudApi";
import { showToast } from "@/lib/toast";

export default function TariffCard({ tariff, onPurchase }: { tariff: any; onPurchase?: () => void; }) {
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

  const featuresList = typeof tariff.features_list === "string" 
    ? tariff.features_list.split("\n").filter(Boolean) 
    : [];

  return (
    <div className={`tariff-card-new ${isCurrent ? 'is-active' : ''}`}>
      <h3>{tariff.Title}</h3>
      <ul>
        {featuresList.map((feature: string, idx: number) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
      <div className="tariff-price">
        {tariff.Price} ₽<span>/мес</span>
      </div>
      <button
        className="tariff-btn"
        onClick={handleBuy}
        disabled={isCurrent || loading}
      >
        {loading ? "Загрузка..." : isCurrent ? "Активен" : "Купить"}
      </button>
    </div>
  );
}
