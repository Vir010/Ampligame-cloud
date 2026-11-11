export interface Cosmetic {
  id: string;
  name: string;
  price: number;
  css: string;
}

export interface CosmeticsData {
  frames: Cosmetic[];
  backgrounds: Cosmetic[];
  inventory: Cosmetic[];
}

export const COSMETICS: CosmeticsData = {
    frames: [
      { id: 'frame_default', name: 'По умолчанию', price: 0, css: '' },
      { id: 'frame_purple', name: 'Фиолетовое кольцо', price: 50, css: 'frame-purple' },
      { id: 'frame_gold', name: 'Золотое кольцо', price: 100, css: 'frame-gold' },
      { id: 'frame_rainbow', name: 'Радужное', price: 200, css: 'frame-rainbow' },
      { id: 'frame_fire', name: 'Огненное', price: 300, css: 'frame-fire' },
      { id: 'frame_neon', name: 'Неоновое', price: 250, css: 'frame-neon' }
    ],
    backgrounds: [
      { id: 'bg_default', name: 'Стандартный', price: 0, css: '' },
      { id: 'bg_aurora', name: 'Северное сияние', price: 150, css: 'custom-bg-aurora' },
      { id: 'bg_nebula', name: 'Туманность', price: 250, css: 'custom-bg-nebula' },
      { id: 'bg_matrix', name: 'Матрица', price: 200, css: 'custom-bg-matrix' }
    ],
    inventory: [
      { id: 'inv_default', name: 'Стандарт', price: 0, css: '' },
      { id: 'inv_gradient', name: 'Градиент', price: 100, css: 'inv-gradient' },
      { id: 'inv_neon', name: 'Неон', price: 150, css: 'inv-neon' },
      { id: 'inv_gold', name: 'Золото', price: 200, css: 'inv-gold' }
    ]
  };
