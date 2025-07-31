document.addEventListener('DOMContentLoaded', () => {
  const modalTriggers = document.querySelectorAll('.project-card[aria-haspopup="dialog"]');
  const modals = document.querySelectorAll('.modal');
  const body = document.body;

  modalTriggers.forEach(trigger => {
    const modalId = trigger.getAttribute('aria-controls');
    const modal = document.getElementById(modalId);

    const openModal = () => {
      modal.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
      modal.querySelector('.modal-close').focus();
    };

    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      trigger.focus();
    };

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });

    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });
});
