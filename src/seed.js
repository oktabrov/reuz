// ==========================================
// ReUz — Seed Data (no-op, DB handles seeding)
// ==========================================

// Seed data is now handled by the backend database (server/db.js).
// This file is kept for backward compatibility with imports.

export function seedData() {
  // No-op — DB seeds on first run
}

export function getDemoAccounts() {
  return [
    { email: 'alice@demo.com', password: 'demo123', name: 'Alice Karimova', region: 'Tashkent' },
    { email: 'bob@demo.com', password: 'demo123', name: 'Bobur Umarov', region: 'Samarkand' },
    { email: 'carol@demo.com', password: 'demo123', name: 'Kamola Nazarova', region: 'Fergana' },
    { email: 'dima@demo.com', password: 'demo123', name: 'Dima Aliyev', region: 'Bukhara' },
    { email: 'elena@demo.com', password: 'demo123', name: 'Elena Rashidova', region: 'Namangan' }
  ];
}
