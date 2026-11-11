'use client';
import { useState, useEffect, useRef } from 'react';
import { stopCloudSession, getActiveSession, ActiveSession } from '@/lib/cloudApi';
import { showToast } from '@/lib/toast';

export default function SessionTimer({
  session: initialSession,
  onEnd,
}: {
  session: ActiveSession;
  onEnd: () => void;
}) {
  const [session, setSession] = useState<ActiveSession>(initialSession);
  const [secondsLeft, setSecondsLeft] = useState(initialSession.minutesLeft * 60);
  const [loading, setLoading] = useState(false);
  const autoEnded = useRef(false);

  // Один интервал — без пересоздания на каждом тике
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Синхронизация с сервером раз в 30 секунд
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const data = await getActiveSession();
        if (data?.session) {
          setSession(data.session);
          setSecondsLeft(data.session.minutesLeft * 60);
        } else {
          // Сессия закончилась на сервере — завершаем UI
          onEnd();
        }
      } catch {
        /* сетевые ошибки игнорируем, следующий тик попробует снова */
      }
    }, 30000);
    return () => clearInterval(id);
  }, [onEnd]);

  // Автозавершение при 0
  useEffect(() => {
    if (secondsLeft !== 0 || autoEnded.current) return;
    autoEnded.current = true;
    (async () => {
      try {
        await stopCloudSession();
        showToast('Время сессии истекло', 'info');
      } catch {
        /* уже могла быть закрыта */
      } finally {
        onEnd();
      }
    })();
  }, [secondsLeft, onEnd]);

  const handleStop = async () => {
    if (!confirm('Завершить сессию? Остаток средств будет возвращён.')) return;
    setLoading(true);
    try {
      const res = await stopCloudSession();
      if (res.refund > 0) {
        showToast(`Сессия завершена. Возвращено ${res.refund} ₽`, 'success');
      } else {
        showToast('Сессия завершена', 'success');
      }
      onEnd();
    } catch (err: any) {
      showToast(err.message || 'Ошибка', 'error');
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress =
    session.minutesTotal > 0
      ? ((session.minutesTotal * 60 - secondsLeft) / (session.minutesTotal * 60)) * 100
      : 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a0033, #0d001a)',
      border: '2px solid #8f3ed1',
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '30px',
      boxShadow: '0 0 40px rgba(143,62,209,0.4)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>Сессия активна</h3>
          {session.tariff && (
            <p style={{ margin: '5px 0 0', color: '#b4a8ff', fontSize: '14px' }}>
              Тариф: {session.tariff.Title}
            </p>
          )}
        </div>
        <button
          onClick={handleStop}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#ff4444',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: loading ? 'wait' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Завершение...' : 'Завершить сессию'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          fontSize: '56px',
          fontWeight: 900,
          color: secondsLeft < 300 ? '#ff4444' : '#b4a8ff',
          fontFamily: 'Courier New, monospace',
          textShadow: '0 0 20px rgba(143,62,209,0.6)',
        }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p style={{ color: '#888', fontSize: '13px', margin: '5px 0 0' }}>
          Осталось из {session.minutesTotal} минут
        </p>
      </div>

      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #8f3ed1, #a110ce)',
          transition: 'width 1s linear',
        }} />
      </div>
    </div>
  );
}
