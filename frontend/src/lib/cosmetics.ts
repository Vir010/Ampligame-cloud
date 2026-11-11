import { getJSON, setJSON, getItem, setItem } from './storage';
import { COSMETICS } from '@/data/cosmetics';

const OWNED_KEY = 'user_cosmetics';
const EQUIPPED_KEY = 'user_equipped_cosmetics';

export function getOwnedCosmetics(): string[] {
  return getJSON<string[]>(OWNED_KEY, []);
}

export function getEquippedCosmetics(): Record<string, string> {
  return getJSON<Record<string, string>>(EQUIPPED_KEY, {});
}

export function buyCosmetic(id: string, price: number): boolean {
  const points = parseInt(getItem('user_points') || '0');
  if (points < price) return false;
  setItem('user_points', String(points - price));
  const owned = getOwnedCosmetics();
  if (!owned.includes(id)) {
    owned.push(id);
    setJSON(OWNED_KEY, owned);
  }
  return true;
}

export function equipCosmetic(type: string, id: string): void {
  const equipped = getEquippedCosmetics();
  equipped[type] = id;
  setJSON(EQUIPPED_KEY, equipped);
  applyCosmetics();
}

export function applyCosmetics(): void {
  if (typeof document === 'undefined') return;

  const equipped = getEquippedCosmetics();
  console.log('[Cosmetics] Applying. Equipped:', equipped);

  const allFrames = ['frame-purple', 'frame-gold', 'frame-rainbow', 'frame-fire', 'frame-neon'];
  const allInvs = ['inv-gradient', 'inv-neon', 'inv-gold'];
  const allBgs = ['custom-bg-aurora', 'custom-bg-nebula', 'custom-bg-matrix'];
  
  // 1. Убираем старые классы со всех элементов
  [document.body, ...Array.from(document.querySelectorAll('.avatar-circle, .profile-avatar, .inventory-grid'))].forEach(el => {
    [...allFrames, ...allInvs, ...allBgs].forEach(c => el.classList.remove(c));
  });

  // 2. Сбрасываем все inline-стили фона
  document.body.style.background = '';
  document.body.style.backgroundImage = '';
  document.body.style.backgroundColor = '';
  document.body.style.backgroundSize = '';
  document.body.style.backgroundAttachment = '';
  document.body.style.animation = '';
  
  // 3. Применяем фон (и класс, и inline-стили)
  const bgId = equipped.backgrounds;
  if (bgId) {
    const bg = COSMETICS.backgrounds.find(b => b.id === bgId);
    if (bg && bg.css) {
      document.body.classList.add(bg.css);
      
      if (bg.css === 'custom-bg-matrix') {
        document.body.style.setProperty('background', 'linear-gradient(180deg, #000000, #001a00, #000000)', 'important');
        document.body.style.setProperty('background-image', 'linear-gradient(180deg, #000000, #001a00, #000000)', 'important');
        document.body.style.setProperty('background-color', '#000000', 'important');
        document.body.style.setProperty('background-size', 'cover', 'important');
        document.body.style.setProperty('background-attachment', 'fixed', 'important');
        document.body.style.setProperty('animation', 'none', 'important');
      } else if (bg.css === 'custom-bg-aurora') {
        document.body.style.setProperty('background', 'linear-gradient(135deg, #0a1a2a, #1a0a2a, #2a1a0a, #0a2a1a)', 'important');
        document.body.style.setProperty('background-image', 'linear-gradient(135deg, #0a1a2a, #1a0a2a, #2a1a0a, #0a2a1a)', 'important');
        document.body.style.setProperty('background-size', '400% 400%', 'important');
        document.body.style.setProperty('background-attachment', 'fixed', 'important');
        document.body.style.setProperty('animation', 'gradientShift 15s ease infinite', 'important');
      } else if (bg.css === 'custom-bg-nebula') {
        document.body.style.setProperty('background', 'radial-gradient(circle at 30% 40%, #8f3ed1, #1a0033, #0d001a)', 'important');
        document.body.style.setProperty('background-image', 'radial-gradient(circle at 30% 40%, #8f3ed1, #1a0033, #0d001a)', 'important');
        document.body.style.setProperty('background-size', 'cover', 'important');
        document.body.style.setProperty('background-attachment', 'fixed', 'important');
        document.body.style.setProperty('animation', 'none', 'important');
      }
      console.log('[Cosmetics] Inline styles forced for:', bg.css);
    }
  }
  
  // 4. Рамки
  const frameId = equipped.frames;
  if (frameId) {
    const frame = COSMETICS.frames.find(f => f.id === frameId);
    if (frame && frame.css) {
      document.querySelectorAll('.avatar-circle, .profile-avatar').forEach(el => el.classList.add(frame.css));
    }
  }
  
  // 5. Инвентарь
  const invId = equipped.inventory;
  if (invId) {
    const inv = COSMETICS.inventory.find(i => i.id === invId);
    if (inv && inv.css) {
      document.querySelectorAll('.inventory-grid').forEach(el => el.classList.add(inv.css));
    }
  }
}
