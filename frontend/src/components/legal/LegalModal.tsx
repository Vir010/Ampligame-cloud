'use client';

export default function LegalModal({ type, onClose }: { type: string, onClose: () => void }) {
  const CONTENT: Record<string, { title: string, body: string }> = {
    faq: {
      title: "FAQ — Часто задаваемые вопросы",
      body: `<h4>Как купить игру?</h4><p>Выберите игру в магазине, нажмите «Купить» и следуйте инструкциям оплаты. После покупки игра появится в вашей библиотеке.</p>
             <h4>Как установить игру?</h4><p>Перейдите в библиотеку, нажмите на игру и выберите «Установить». Загрузится торрент-файл.</p>`
    },
    rules: {
      title: "Правила платформы",
      body: `<h4>1. Общие положения</h4><p>Платформа AMPLIGAME — это магазин цифровых игр и сообщество геймеров. Используя платформу, вы соглашаетесь с настоящими правилами.</p>
             <h4>2. Аккаунт</h4><p>Вы обязуетесь предоставлять достоверные данные и не передавать свой аккаунт третьим лицам.</p>
             <h4>3. Запрещено</h4><p>— Оскорблять других пользователей;<br>— Распространять вредоносное ПО;<br>— Публиковать контент, нарушающий законодательство.</p>`
    },
    privacy: {
      title: "Политика конфиденциальности",
      body: `<h4>1. Какие данные мы собираем</h4><p>Мы собираем: email, имя пользователя, историю покупок. Данные хранятся в защищённом виде.</p>
             <h4>2. Как используем</h4><p>Данные используются для: предоставления доступа к играм, персонализации рекомендаций, связи с вами.</p>`
    },
    terms: {
      title: "Условия использования",
      body: `<h4>1. Предмет соглашения</h4><p>Платформа предоставляет доступ к покупке цифровых копий игр и сопутствующим сервисам.</p>
             <h4>2. Лицензия</h4><p>При покупке игры вы получаете личную неисключительную лицензию на использование игры.</p>`
    },
    refund: {
      title: "Политика возврата",
      body: `<h4>1. Условия возврата</h4><p>Возврат возможен в течение <strong>14 дней</strong> с момента покупки, если игра <strong>не была установлена</strong>.</p>
             <h4>2. Как вернуть</h4><p>Напишите в поддержку с указанием: email, названия игры, даты покупки.</p>`
    }
  };

  const data = CONTENT[type] || CONTENT.faq;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1a1a1a', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid #8f3ed1', overflow: 'hidden' }}>
        <div style={{ background: '#8f3ed1', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>{data.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: '30px', overflowY: 'auto', color: '#ccc', lineHeight: 1.7, fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: data.body }} />
      </div>
    </div>
  );
}
