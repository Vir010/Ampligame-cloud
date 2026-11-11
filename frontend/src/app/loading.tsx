export default function Loading() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', minHeight: '80vh', justifyContent: 'center' }}>
      <div style={{
        width: '60px', height: '60px', borderRadius: '50%',
        border: '4px solid rgba(143, 62, 209, 0.2)',
        borderTopColor: '#8f3ed1',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{ color: '#8f3ed1', fontWeight: 'bold' }}>Загрузка...</p>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { to { transform: rotate(360deg); } }' }} />
    </div>
  );
}
