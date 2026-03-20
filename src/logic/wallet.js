// ==========================================
// ReUz — Virtual Wallet
// ==========================================

import { store } from '../store.js';

export function getWallet(userId) {
  let wallet = store.getById('wallets', userId);
  if (!wallet) {
    wallet = {
      id: userId,
      balance: 100.00, // starting demo balance
      pending: 0,
      transactions: []
    };
    store.add('wallets', wallet);
  }
  return wallet;
}

export function creditWallet(userId, amount, description, orderId = null) {
  const wallet = getWallet(userId);
  wallet.balance = Math.round((wallet.balance + amount) * 100) / 100;
  wallet.transactions.unshift({
    id: store.generateId(),
    type: 'credit',
    amount,
    description,
    orderId,
    timestamp: Date.now()
  });
  store.update('wallets', userId, wallet);
  return wallet;
}

export function debitWallet(userId, amount, description, orderId = null) {
  const wallet = getWallet(userId);
  wallet.balance = Math.round((wallet.balance - amount) * 100) / 100;
  wallet.transactions.unshift({
    id: store.generateId(),
    type: 'debit',
    amount,
    description,
    orderId,
    timestamp: Date.now()
  });
  store.update('wallets', userId, wallet);
  return wallet;
}

export function freezeFunds(userId, amount, description, orderId = null) {
  const wallet = getWallet(userId);
  wallet.pending = Math.round((wallet.pending + amount) * 100) / 100;
  wallet.transactions.unshift({
    id: store.generateId(),
    type: 'freeze',
    amount,
    description,
    orderId,
    timestamp: Date.now()
  });
  store.update('wallets', userId, wallet);
  return wallet;
}

export function releaseFunds(userId, amount, description, orderId = null) {
  const wallet = getWallet(userId);
  wallet.pending = Math.round(Math.max(0, wallet.pending - amount) * 100) / 100;
  wallet.balance = Math.round((wallet.balance + amount) * 100) / 100;
  wallet.transactions.unshift({
    id: store.generateId(),
    type: 'release',
    amount,
    description,
    orderId,
    timestamp: Date.now()
  });
  store.update('wallets', userId, wallet);
  return wallet;
}

export function refundToBalance(userId, amount, description, orderId = null) {
  return creditWallet(userId, amount, description, orderId);
}
