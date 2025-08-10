// Small, friendly JS: nav toggle, form handling (local save), render saved messages, date in footer
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  navToggle.addEventListener('click', () => nav.classList.toggle('open'));

  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Form behaviour: save data to localStorage as a simulated "backend"
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const messagesList = document.getElementById('messages-list');
  const clearBtn = document.getElementById('clear-btn');

  function loadMessages(){
    const items = JSON.parse(localStorage.getItem('messages') || '[]');
    messagesList.innerHTML = '';
    if(items.length === 0){
      messagesList.innerHTML = '<li style="color:var(--muted)">Niciun mesaj.</li>';
      return;
    }
    items.slice().reverse().forEach(msg => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(msg.name)}</strong> (<em>${escapeHtml(msg.email)}</em>)<br>${escapeHtml(msg.message)}`;
      messagesList.appendChild(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if(!name || !email || !message){
      status.textContent = 'Completează toate câmpurile.';
      return;
    }

    // simulate saving (backend)
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push({name,email,message,ts:Date.now()});
    localStorage.setItem('messages', JSON.stringify(messages));

    status.textContent = 'Mesaj salvat local. (Simulare trimiteri)';
    form.reset();
    loadMessages();

    // small visual feedback
    setTimeout(()=> status.textContent = '', 3000);
  });

  clearBtn.addEventListener('click', () => {
    form.reset();
    status.textContent = 'Formular curățat.';
    setTimeout(()=> status.textContent = '', 2000);
  });

  // escape to avoid injection when inserting HTML
  function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  loadMessages();
});
