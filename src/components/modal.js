// ==========================================
// ReUz — Modal Component
// ==========================================

let modalRoot = null;

function ensureRoot() {
  if (!modalRoot) {
    modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }
  return modalRoot;
}

export function showModal({ title, content, footer, onClose, maxWidth = '520px' }) {
  const root = ensureRoot();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width: ${maxWidth}">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body"></div>
      ${footer ? '<div class="modal-footer"></div>' : ''}
    </div>
  `;

  const modalBody = overlay.querySelector('.modal-body');
  if (typeof content === 'string') {
    modalBody.innerHTML = content;
  } else if (content instanceof Element) {
    modalBody.appendChild(content);
  }

  if (footer) {
    const modalFooter = overlay.querySelector('.modal-footer');
    if (typeof footer === 'string') {
      modalFooter.innerHTML = footer;
    } else if (footer instanceof Element) {
      modalFooter.appendChild(footer);
    }
  }

  const close = () => {
    overlay.style.animation = 'fadeIn 200ms reverse forwards';
    setTimeout(() => {
      overlay.remove();
      if (onClose) onClose();
    }, 200);
  };

  overlay.querySelector('#modal-close-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  root.appendChild(overlay);

  return { close, overlay };
}

export function closeAllModals() {
  const root = ensureRoot();
  root.innerHTML = '';
}
