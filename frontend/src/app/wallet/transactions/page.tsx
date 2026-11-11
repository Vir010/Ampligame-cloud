'use client';

/**
 * История операций кошелька: пополнения, списания, покупки, возвраты.
 * Данные приходят из Strapi — журнал транзакций формируется на сервере.
 */

import { useEffect, useState } from 'react';
import { fetchTransactions, WalletTransaction, WalletError } from '@/lib/wallet';

const TYPE_LABEL: Record<WalletTransaction['type'], string> = {
  deposit: 'Пополнение',
  withdraw: 'Списание',
  purchase: 'Покупка',
  refund: 'Возврат',
};

const STATUS_LABEL: Record<WalletTransaction['status'], string> = {
  pending: 'В обработке',
  completed: 'Выполнена',
  failed: 'Отклонена',
  reversed: 'Отменена',
};

export default function TransactionsPage() {
  const [items, setItems] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions()
      .then(setItems)
      .catch((err) => setError(err instanceof WalletError ? err.message : 'Не удалось загрузить историю'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Загрузка...</div>;

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h2>История операций</h2>
        <p style={{ color: '#ff6b6b' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>История операций</h2>

      {items.length === 0 ? (
        <p style={{ opacity: 0.7 }}>Операций пока нет.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
              <th style={{ padding: 10 }}>Дата</th>
              <th style={{ padding: 10 }}>Тип</th>
              <th style={{ padding: 10 }}>Сумма</th>
              <th style={{ padding: 10 }}>Баланс после</th>
              <th style={{ padding: 10 }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 10 }}>{new Date(t.createdAt).toLocaleString('ru-RU')}</td>
                <td style={{ padding: 10 }}>{TYPE_LABEL[t.type] ?? t.type}</td>
                <td style={{ padding: 10, color: t.amount >= 0 ? '#4caf50' : '#ff6b6b' }}>
                  {t.amount >= 0 ? '+' : ''}
                  {t.amount} ₽
                </td>
                <td style={{ padding: 10 }}>{t.balanceAfter} ₽</td>
                <td style={{ padding: 10 }}>{STATUS_LABEL[t.status] ?? t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
