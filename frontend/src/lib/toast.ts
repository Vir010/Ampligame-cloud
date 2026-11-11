export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  if (typeof document === 'undefined') return;
  
  // Удаляем старые, чтобы не спамить
  const oldToasts = document.querySelectorAll('.custom-toast');
  if (oldToasts.length >= 3) {
    oldToasts[0].remove();
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 80px; right: 30px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#ff4444' : '#8f3ed1'};
    color: #fff; padding: 15px 25px; border-radius: 10px;
    z-index: 10000; font-weight: 600;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    font-family: 'Sora', sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
