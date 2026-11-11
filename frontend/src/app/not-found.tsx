import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '120px', margin: 0, background: 'linear-gradient(135deg, #8f3ed1, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '900' }}>404</h1>
      <h2 style={{ color: '#fff', marginBottom: '15px' }}>Страница не найдена</h2>
      <p style={{ color: '#888', marginBottom: '30px' }}>Возможно, она была удалена или вы ошиблись адресом</p>
      <Link href="/store" style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #8f3ed1, #a110ce)', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 5px 20px rgba(143,62,209,0.4)' }}>
        Вернуться в магазин
      </Link>
    </div>
  );
}
