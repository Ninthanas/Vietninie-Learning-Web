// Single source of truth for navigation: 5 main areas (desktop header + mobile bottom bar).
export const NAV_ITEMS = [
  { to: '/', key: 'home', label: 'Trang chủ', icon: 'home', end: true },
  { to: '/vocabulary', key: 'vocabulary', label: 'Từ vựng', icon: 'book' },
  { to: '/grammar', key: 'grammar', label: 'Ngữ pháp', icon: 'lines' },
  { to: '/practice', key: 'practice', label: 'Luyện tập', icon: 'bolt', match: ['/practice', '/quiz', '/listening', '/conversation'] },
  { to: '/specialized', key: 'specialized', label: 'Chuyên ngành', icon: 'bag' }
];

export const SETTINGS_ITEM = { to: '/settings', key: 'settings', label: 'Cài đặt' };
export const PROGRESS_ITEM = { to: '/progress', key: 'progress', label: 'Tiến độ' };
