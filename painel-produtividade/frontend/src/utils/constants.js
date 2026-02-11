// Configurações da aplicação
export const APP_CONFIG = {
  APP_NAME: 'Painel de Produtividade',
  APP_VERSION: '1.0.0',
  
  // URLs
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Cores principais
  COLORS: {
    PRIMARY: '#2563eb',
    DARK: '#0f172a',
    LIGHT: '#f8fafc',
    CARD_DARK: '#1e293b',
  },

  // Meta diária (em minutos)
  DAILY_GOAL: 480, // 8 horas

  // Categorias de demandas
  CATEGORIES: [
    'Design',
    'Copy',
    'Tráfego Pago',
    'Automação',
    'Reunião',
    'Suporte',
    'Outro'
  ],

  // Status de demandas
  STATUS: [
    'Pendente',
    'Em andamento',
    'Finalizado'
  ],

  // Períodos para ranking
  PERIODS: [
    { value: 'semana', label: 'Semana' },
    { value: 'mês', label: 'Mês' },
    { value: 'ano', label: 'Ano' }
  ],

  // Paginação
  PAGINATION: {
    ITEMS_PER_PAGE: 10,
    MAX_PAGES: 10
  },

  // Timeouts
  TIMEOUT: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000
  }
};

// Cores por categoria
export const CATEGORY_COLORS = {
  'Design': '#a855f7',
  'Copy': '#3b82f6',
  'Tráfego Pago': '#ef4444',
  'Automação': '#10b981',
  'Reunião': '#f59e0b',
  'Suporte': '#ec4899',
  'Outro': '#6366f1'
};

// Ícones de status
export const STATUS_ICONS = {
  'Pendente': '⏳',
  'Em andamento': '⚙️',
  'Finalizado': '✓'
};
