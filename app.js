/* ======================================================
   EventHub — app.js
   Agenda de Eventos Independientes
   ====================================================== */

'use strict';

/* --------------------------------------------------
   CONSTANTS & DATA
   -------------------------------------------------- */
const STORAGE_KEY = 'eventhub_agenda_v1';

/**
 * Categorías con icono y color CSS variable.
 * El color coincide con las variables --cat-* del CSS.
 */
const CATEGORIES = [
  { id: 'Taller',      icon: '🛠️',  color: '#8b5cf6' },
  { id: 'Charla',      icon: '🎙️',  color: '#06b6d4' },
  { id: 'Recital',     icon: '🎸',  color: '#ec4899' },
  { id: 'Feria',       icon: '🛍️',  color: '#f59e0b' },
  { id: 'Muestra',     icon: '🖼️',  color: '#10b981' },
  { id: 'Meetup Tech', icon: '💻',  color: '#3b82f6' },
  { id: 'Gamer',       icon: '🎮',  color: '#ef4444' },
  { id: 'Cultural',    icon: '🎭',  color: '#a78bfa' },
];

/**
 * Generamos fechas relativas para que el proyecto siempre
 * tenga eventos pasados, de hoy y futuros,
 * sin importar cuándo se abra.
 */
function relDate(offsetDays, hour = 19, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Eventos de muestra */
const EVENTS_DATA = [
  // ——— PASADOS ———
  {
    id: 1,
    title: 'Taller de Cerámica Japonesa',
    description: 'Introducción a la técnica del Raku y barnizado con esmaltes naturales. Materiales incluidos.',
    category: 'Taller',
    location: 'Centro Cultural La Manzana, CABA',
    date: relDate(-30, 10),
    price: 3500,
    capacity: 12,
    organizer: 'Estudio Barro Vivo',
    tags: ['cerámica', 'arte', 'manual'],
  },
  {
    id: 2,
    title: 'Charla: Inteligencia Artificial y Creatividad',
    description: 'Exploramos cómo la IA está transformando el arte, la música y el diseño. Panel abierto con Q&A.',
    category: 'Charla',
    location: 'Espacio Cowork Palermo',
    date: relDate(-20, 18),
    price: 0,
    capacity: 80,
    organizer: 'AI Buenos Aires',
    tags: ['ia', 'tecnología', 'creatividad'],
  },
  {
    id: 3,
    title: 'Recital Acústico: La Raíz Folk',
    description: 'Noche de folk y canción de autor en un ambiente íntimo. Tres artistas en escena.',
    category: 'Recital',
    location: 'Bar El Candil, San Telmo',
    date: relDate(-10, 21),
    price: 2000,
    capacity: 60,
    organizer: 'Ciclo Raíces',
    tags: ['música', 'folk', 'acústico'],
  },
  {
    id: 4,
    title: 'Feria de Ilustración Independiente',
    description: 'Más de 40 ilustradores locales con sus obras originales, prints, fanzines y libros de artista.',
    category: 'Feria',
    location: 'Parque Centenario, CABA',
    date: relDate(-5, 11),
    price: 0,
    capacity: 500,
    organizer: 'Colectivo Pinceles',
    tags: ['ilustración', 'arte', 'feria'],
  },
  // ——— HOY ———
  {
    id: 5,
    title: 'Meetup: Rust & Performance Web',
    description: 'Charlas técnicas sobre WebAssembly, Rust en el backend y optimización de bundles en proyectos reales.',
    category: 'Meetup Tech',
    location: 'Mercado de las Pulgas, Colegiales',
    date: relDate(0, 18, 30),
    price: 0,
    capacity: 120,
    organizer: 'RustAR Community',
    tags: ['rust', 'web', 'performance', 'dev'],
  },
  {
    id: 6,
    title: 'Torneo de Street Fighter 6 · Abierto',
    description: 'Torneo amateur abierto al público. Se puede competir o ir sólo a mirar y pasarla bien.',
    category: 'Gamer',
    location: 'Arcade Republica, Microcentro',
    date: relDate(0, 15),
    price: 1500,
    capacity: 64,
    organizer: 'FightClub BA',
    tags: ['fighting game', 'torneo', 'sf6'],
  },
  // ——— PRÓXIMOS ———
  {
    id: 7,
    title: 'Taller de Fotografía Nocturna',
    description: 'Salida fotográfica por el puerto. Aprendé a manejar largas exposiciones, light painting y astrofotografía.',
    category: 'Taller',
    location: 'Puerto Madero, CABA',
    date: relDate(3, 20),
    price: 4200,
    capacity: 16,
    organizer: 'Foto Nocturna BA',
    tags: ['fotografía', 'nocturna', 'light painting'],
  },
  {
    id: 8,
    title: 'Muestra: Distopías Posibles',
    description: 'Exposición colectiva de 8 artistas visuales que exploran futuros alternativos a través del collage y la instalación.',
    category: 'Muestra',
    location: 'Galería Voltaire, Villa Crespo',
    date: relDate(5, 17),
    price: 0,
    capacity: 200,
    organizer: 'Galería Voltaire',
    tags: ['arte', 'muestra', 'instalación'],
  },
  {
    id: 9,
    title: 'Charla: Diseño Sin Clientes Tóxicos',
    description: 'Estrategias reales para poner límites, cobrar lo que valés y elegir los proyectos que amás.',
    category: 'Charla',
    location: 'Centro Cultural San Martín',
    date: relDate(7, 19),
    price: 1200,
    capacity: 100,
    organizer: 'Freelance Argentina',
    tags: ['diseño', 'freelance', 'negocios'],
  },
  {
    id: 10,
    title: 'Recital: Electrofolk con Orquesta',
    description: 'Una velada única donde la electrónica se fusiona con una pequeña orquesta de cámara en vivo.',
    category: 'Recital',
    location: 'Teatro Coliseo, CABA',
    date: relDate(10, 20, 30),
    price: 8500,
    capacity: 800,
    organizer: 'Orquesta Expandida',
    tags: ['electrónica', 'orquesta', 'fusión'],
  },
  {
    id: 11,
    title: 'Feria de Emprendedores Creativos',
    description: 'Más de 80 emprendimientos de moda, decoración, gastronomía y productos artesanales.',
    category: 'Feria',
    location: 'La Rural, Palermo',
    date: relDate(14, 10),
    price: 0,
    capacity: 2000,
    organizer: 'Mercado Creativo AR',
    tags: ['emprendimiento', 'feria', 'artesanal'],
  },
  {
    id: 12,
    title: 'Game Jam 48h: Tema Libre',
    description: 'Hackaton de videojuegos presencial. Formá equipos el viernes y presentá tu juego el domingo.',
    category: 'Gamer',
    location: 'Hub Tecnológico Ciudad',
    date: relDate(17, 9),
    price: 0,
    capacity: 150,
    organizer: 'GameDev Argentina',
    tags: ['game jam', 'desarrollo', 'indie'],
  },
  {
    id: 13,
    title: 'Meetup UX: Design Systems a Escala',
    description: 'Casos reales de empresas argentinas que escalaron sus design systems. Lightning talks + workshop.',
    category: 'Meetup Tech',
    location: 'Google Campus, CABA',
    date: relDate(20, 18),
    price: 0,
    capacity: 200,
    organizer: 'UX Argentina',
    tags: ['ux', 'design system', 'figma'],
  },
  {
    id: 14,
    title: 'Festival Cultural del Barrio Sur',
    description: 'Tres días de música, teatro callejero, talleres y gastronomía en el corazón del barrio.',
    category: 'Cultural',
    location: 'Plazoleta Cnel. Olazábal',
    date: relDate(25, 12),
    price: 0,
    capacity: 1000,
    organizer: 'Vecinos del Sur',
    tags: ['festival', 'cultura', 'comunidad'],
  },
  {
    id: 15,
    title: 'Taller de Serigrafía y Estampado',
    description: 'Aprendé la técnica artesanal del screen printing para estampar remeras, telas y papel.',
    category: 'Taller',
    location: 'El Estudio, Floresta',
    date: relDate(30, 14),
    price: 5000,
    capacity: 10,
    organizer: 'Tinta Rebelde',
    tags: ['serigrafía', 'estampado', 'artesanal'],
  },
  {
    id: 16,
    title: 'Muestra Fotográfica: Barrios en Cambio',
    description: 'Registro visual de las transformaciones urbanas porteñas en los últimos 10 años.',
    category: 'Muestra',
    location: 'Centro Cultural Recoleta',
    date: relDate(35, 11),
    price: 0,
    capacity: 300,
    organizer: 'Colectivo Lente Urbano',
    tags: ['fotografía', 'urbano', 'documental'],
  },
];

/* --------------------------------------------------
   STATE
   -------------------------------------------------- */
const state = {
  savedEventIds: [],          // IDs guardados en localStorage
  activeCategory: 'all',     // chip seleccionado en /eventos
  filters: {
    search:  '',
    estado:  'all',
    precio:  'all',
    fecha:   '',
  },
  sort: 'date-asc',
  currentModalId: null,
};

/* --------------------------------------------------
   UTILS: DATE / STATUS
   -------------------------------------------------- */

/**
 * Determina si un evento es 'past', 'today' o 'future'
 * relativo a la fecha y hora locales actuales.
 */
function getEventStatus(isoDate) {
  const now   = new Date();
  const event = new Date(isoDate);

  // "Hoy" = mismo día calendario (independientemente de la hora)
  const todayStr = now.toDateString();
  const eventStr = event.toDateString();

  if (eventStr === todayStr) return 'today';
  if (event < now)           return 'past';
  return 'future';
}

const STATUS_LABELS = {
  past:   '✅ Finalizado',
  today:  '🔥 ¡Hoy!',
  future: '⏳ Próximo',
};

const STATUS_EMOJI = {
  past:   '✅',
  today:  '🔥',
  future: '⏳',
};

/**
 * Formatea una fecha ISO a texto legible en español.
 */
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-AR', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('es-AR', {
    hour:   '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-AR', {
    day:   '2-digit',
    month: 'short',
  });
}

function formatPrice(price) {
  if (price === 0) return 'Entrada libre';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);
}

function getMonthAbbr(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
}

function getDayNum(isoDate) {
  return new Date(isoDate).getDate();
}

/* --------------------------------------------------
   UTILS: CATEGORY ICON
   -------------------------------------------------- */
function getCatIcon(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  return cat ? cat.icon : '📅';
}

/* --------------------------------------------------
   LOCAL STORAGE
   -------------------------------------------------- */
function loadSaved() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    state.savedEventIds = data ? JSON.parse(data) : [];
  } catch {
    state.savedEventIds = [];
  }
}

function persistSaved() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedEventIds));
}

function isEventSaved(id) {
  return state.savedEventIds.includes(id);
}

function toggleSaveEvent(id) {
  if (isEventSaved(id)) {
    state.savedEventIds = state.savedEventIds.filter(sid => sid !== id);
    persistSaved();
    updateBadge();
    updateAllSaveButtons(id);
    showToast(`Evento eliminado de tu agenda`, 'remove');
    if (document.getElementById('page-agenda').classList.contains('active')) {
      renderAgenda();
    }
    return false;
  } else {
    state.savedEventIds.push(id);
    persistSaved();
    updateBadge();
    updateAllSaveButtons(id);
    showToast(`Evento añadido a tu agenda 📌`, 'success');
    return true;
  }
}

/* --------------------------------------------------
   BADGE
   -------------------------------------------------- */
function updateBadge() {
  const badge = document.getElementById('agenda-badge');
  const count = state.savedEventIds.length;
  badge.textContent = count;
  badge.classList.add('bump');
  badge.addEventListener('animationend', () => badge.classList.remove('bump'), { once: true });
}

/* --------------------------------------------------
   TOAST
   -------------------------------------------------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast__icon" aria-hidden="true">${type === 'success' ? '✅' : '🗑️'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2800);
}

/* --------------------------------------------------
   UPDATE SAVE BUTTONS (sync across pages)
   -------------------------------------------------- */
function updateAllSaveButtons(id) {
  document.querySelectorAll(`[data-save-id="${id}"]`).forEach(btn => {
    const saved = isEventSaved(id);
    btn.classList.toggle('saved', saved);
    btn.setAttribute('aria-label', saved ? 'Quitar de mi agenda' : 'Guardar en mi agenda');
    btn.title = saved ? 'Quitar de mi agenda' : 'Guardar en mi agenda';
  });
}

/* --------------------------------------------------
   EVENT CARD HTML BUILDER
   -------------------------------------------------- */
function buildEventCard(event) {
  const status = getEventStatus(event.date);
  const saved  = isEventSaved(event.id);
  const isFree = event.price === 0;

  return `
    <article
      class="event-card status--${status}"
      data-cat="${event.category}"
      data-id="${event.id}"
      aria-label="${event.title}"
    >
      <div class="event-card__status-bar" aria-hidden="true"></div>

      <header class="event-card__header">
        <span class="event-card__cat-badge" data-cat="${event.category}" aria-label="Categoría: ${event.category}">
          <span aria-hidden="true">${getCatIcon(event.category)}</span>
          ${event.category}
        </span>
        <span class="event-card__status-badge status-badge--${status}" aria-label="Estado: ${STATUS_LABELS[status]}">
          <span aria-hidden="true">${STATUS_EMOJI[status]}</span>
          ${STATUS_LABELS[status]}
        </span>
      </header>

      <div class="event-card__body">
        <h3 class="event-card__title">${event.title}</h3>
        <p class="event-card__description">${event.description}</p>

        <dl class="event-card__meta">
          <div class="event-card__meta-item">
            <span class="event-card__meta-icon" aria-hidden="true">📅</span>
            <dt class="sr-only">Fecha</dt>
            <dd>${formatDate(event.date)}</dd>
          </div>
          <div class="event-card__meta-item">
            <span class="event-card__meta-icon" aria-hidden="true">🕐</span>
            <dt class="sr-only">Hora</dt>
            <dd>${formatTime(event.date)}</dd>
          </div>
          <div class="event-card__meta-item">
            <span class="event-card__meta-icon" aria-hidden="true">📍</span>
            <dt class="sr-only">Lugar</dt>
            <dd>${event.location}</dd>
          </div>
          <div class="event-card__meta-item">
            <span class="event-card__meta-icon" aria-hidden="true">👥</span>
            <dt class="sr-only">Capacidad</dt>
            <dd>${event.capacity} personas</dd>
          </div>
        </dl>
      </div>

      <footer class="event-card__footer">
        <span class="event-card__price ${isFree ? 'event-card__price--free' : ''}"
              aria-label="Precio: ${formatPrice(event.price)}">
          ${formatPrice(event.price)}
        </span>
        <div class="event-card__actions">
          <button
            class="btn-icon ${saved ? 'saved' : ''}"
            data-save-id="${event.id}"
            aria-label="${saved ? 'Quitar de mi agenda' : 'Guardar en mi agenda'}"
            title="${saved ? 'Quitar de mi agenda' : 'Guardar en mi agenda'}"
          >${saved ? '📌' : '🔖'}</button>
          <button
            class="btn--detail"
            data-modal-id="${event.id}"
            aria-label="Ver detalles de ${event.title}"
          >Ver detalle</button>
        </div>
      </footer>
    </article>
  `;
}

/* --------------------------------------------------
   AGENDA ITEM HTML BUILDER
   -------------------------------------------------- */
function buildAgendaItem(event) {
  const status = getEventStatus(event.date);
  const isFree = event.price === 0;

  return `
    <div class="agenda-item status--${status}" data-id="${event.id}" data-cat="${event.category}"
         aria-label="${event.title}">

      <div class="agenda-item__date-col" aria-label="Fecha: ${formatDate(event.date)}">
        <span class="agenda-item__day" aria-hidden="true">${getDayNum(event.date)}</span>
        <span class="agenda-item__month" aria-hidden="true">${getMonthAbbr(event.date)}</span>
      </div>

      <div class="agenda-item__body">
        <h3 class="agenda-item__title">${event.title}</h3>
        <dl class="agenda-item__meta">
          <div class="agenda-item__meta-item">
            <span aria-hidden="true">${getCatIcon(event.category)}</span>
            <dt class="sr-only">Categoría</dt>
            <dd>${event.category}</dd>
          </div>
          <div class="agenda-item__meta-item">
            <span aria-hidden="true">🕐</span>
            <dt class="sr-only">Hora</dt>
            <dd>${formatTime(event.date)}</dd>
          </div>
          <div class="agenda-item__meta-item">
            <span aria-hidden="true">📍</span>
            <dt class="sr-only">Lugar</dt>
            <dd>${event.location}</dd>
          </div>
          <div class="agenda-item__meta-item">
            <span aria-hidden="true">💰</span>
            <dt class="sr-only">Precio</dt>
            <dd>${formatPrice(event.price)}</dd>
          </div>
        </dl>
      </div>

      <div class="agenda-item__actions">
        <button
          class="btn-icon saved"
          data-save-id="${event.id}"
          aria-label="Quitar de mi agenda"
          title="Quitar de mi agenda"
        >📌</button>
        <button
          class="btn--detail"
          data-modal-id="${event.id}"
          aria-label="Ver detalles de ${event.title}"
        >Detalle</button>
      </div>
    </div>
  `;
}

/* --------------------------------------------------
   RENDER: HOME PAGE
   -------------------------------------------------- */
function renderHome() {
  // Stats
  const total    = EVENTS_DATA.length;
  const upcoming = EVENTS_DATA.filter(e => getEventStatus(e.date) === 'future').length;
  const todayEvt = EVENTS_DATA.filter(e => getEventStatus(e.date) === 'today').length;
  const free     = EVENTS_DATA.filter(e => e.price === 0).length;

  document.getElementById('stat-total').textContent    = total;
  document.getElementById('stat-upcoming').textContent = upcoming;
  document.getElementById('stat-today').textContent    = todayEvt;
  document.getElementById('stat-free').textContent     = free;

  // Floating cards (3 random upcoming / today events)
  const floatPool = EVENTS_DATA
    .filter(e => getEventStatus(e.date) !== 'past')
    .slice(0, 3);

  ['float-card-1', 'float-card-2', 'float-card-3'].forEach((id, i) => {
    const card = document.getElementById(id);
    const ev   = floatPool[i];
    if (!ev) { card.style.display = 'none'; return; }
    card.querySelector('.float-card__cat').textContent  = `${getCatIcon(ev.category)} ${ev.category}`;
    card.querySelector('.float-card__cat').style.color  = CATEGORIES.find(c => c.id === ev.category)?.color || '#7c3aed';
    card.querySelector('.float-card__name').textContent = ev.title;
    card.querySelector('.float-card__meta').textContent = `${formatDateShort(ev.date)} · ${formatTime(ev.date)}`;
  });

  // Category grid
  const catGrid = document.getElementById('categories-grid');
  catGrid.innerHTML = CATEGORIES.map(cat => {
    const count = EVENTS_DATA.filter(e => e.category === cat.id).length;
    return `
      <div class="category-card" data-cat="${cat.id}" role="listitem"
           style="--cat-clr:${cat.color}"
           tabindex="0"
           aria-label="${cat.id}: ${count} evento${count !== 1 ? 's' : ''}"
      >
        <span class="category-card__icon" aria-hidden="true">${cat.icon}</span>
        <p class="category-card__name">${cat.id}</p>
        <p style="font-size:.72rem;color:#64748b;margin-top:.25rem;">${count} evento${count !== 1 ? 's' : ''}</p>
      </div>
    `;
  }).join('');

  // Featured events: next 6 upcoming (or today)
  const featured = EVENTS_DATA
    .filter(e => getEventStatus(e.date) !== 'past')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  const featuredGrid = document.getElementById('featured-grid');
  featuredGrid.innerHTML = featured.map(ev => buildEventCard(ev)).join('');
}

/* --------------------------------------------------
   RENDER: EVENTS PAGE
   -------------------------------------------------- */
function getFilteredEvents() {
  let list = [...EVENTS_DATA];

  // Search
  if (state.filters.search) {
    const q = state.filters.search.toLowerCase();
    list = list.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      (e.tags && e.tags.some(t => t.includes(q)))
    );
  }

  // Estado
  if (state.filters.estado !== 'all') {
    list = list.filter(e => getEventStatus(e.date) === state.filters.estado);
  }

  // Precio
  if (state.filters.precio === 'free') list = list.filter(e => e.price === 0);
  if (state.filters.precio === 'paid') list = list.filter(e => e.price > 0);

  // Fecha desde
  if (state.filters.fecha) {
    const from = new Date(state.filters.fecha);
    from.setHours(0,0,0,0);
    list = list.filter(e => new Date(e.date) >= from);
  }

  // Categoría
  if (state.activeCategory !== 'all') {
    list = list.filter(e => e.category === state.activeCategory);
  }

  // Sort
  switch (state.sort) {
    case 'date-asc':   list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
    case 'date-desc':  list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name-asc':   list.sort((a, b) => a.title.localeCompare(b.title)); break;
  }

  return list;
}

function renderEventsPage() {
  const list = getFilteredEvents();

  // Results count
  document.getElementById('results-num').textContent = list.length;

  const grid = document.getElementById('events-grid');
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" role="status">
        <p class="empty-state__icon" aria-hidden="true">🔍</p>
        <p class="empty-state__title">Sin resultados</p>
        <p class="empty-state__text">Intentá con otros filtros o explorá todas las categorías.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(ev => buildEventCard(ev)).join('');
}

function renderCategoryChips() {
  const container = document.getElementById('category-chips');
  const allChip = `
    <button class="chip ${state.activeCategory === 'all' ? 'active' : ''}"
            data-cat="all" aria-pressed="${state.activeCategory === 'all'}">
      🌐 Todos
    </button>
  `;
  const catChips = CATEGORIES.map(cat => `
    <button class="chip ${state.activeCategory === cat.id ? 'active' : ''}"
            data-cat="${cat.id}"
            style="--cat-clr:${cat.color}"
            aria-pressed="${state.activeCategory === cat.id}">
      ${cat.icon} ${cat.id}
    </button>
  `).join('');
  container.innerHTML = allChip + catChips;
}

/* --------------------------------------------------
   RENDER: AGENDA PAGE
   -------------------------------------------------- */
function renderAgenda() {
  const container = document.getElementById('timeline-container');

  if (state.savedEventIds.length === 0) {
    container.innerHTML = `
      <div class="agenda-empty" role="status">
        <p class="agenda-empty__icon" aria-hidden="true">📭</p>
        <h2 class="agenda-empty__title">Tu agenda está vacía</h2>
        <p class="agenda-empty__text">
          Explorá los eventos disponibles y guardá los que más te interesen con el botón 🔖.
        </p>
        <button class="btn btn--primary" id="agenda-cta-events" data-page="page-eventos">
          <span aria-hidden="true">🎪</span>
          Explorar eventos
        </button>
      </div>
    `;
    updateAgendaStats([], [], []);
    return;
  }

  const savedEvents = EVENTS_DATA.filter(e => state.savedEventIds.includes(e.id));

  const past   = savedEvents.filter(e => getEventStatus(e.date) === 'past')
                            .sort((a, b) => new Date(b.date) - new Date(a.date));
  const today  = savedEvents.filter(e => getEventStatus(e.date) === 'today')
                            .sort((a, b) => new Date(a.date) - new Date(b.date));
  const future = savedEvents.filter(e => getEventStatus(e.date) === 'future')
                            .sort((a, b) => new Date(a.date) - new Date(b.date));

  updateAgendaStats(future, today, past);

  let html = '';

  if (today.length > 0) {
    html += buildTimelineGroup('today', '🔥 Hoy', today);
  }
  if (future.length > 0) {
    html += buildTimelineGroup('future', '⏳ Próximos', future);
  }
  if (past.length > 0) {
    html += buildTimelineGroup('past', '✅ Pasados', past);
  }

  container.innerHTML = html;
}

function buildTimelineGroup(status, label, events) {
  return `
    <div class="timeline__group">
      <div class="timeline__group-title" aria-label="Sección: ${label}">
        <span class="timeline__group-label label--${status}">${label}</span>
        <div class="timeline__group-line" aria-hidden="true"></div>
      </div>
      <div class="timeline-cards" role="list">
        ${events.map(e => buildAgendaItem(e)).join('')}
      </div>
    </div>
  `;
}

function updateAgendaStats(future, today, past) {
  document.getElementById('ag-stat-future').textContent = future.length;
  document.getElementById('ag-stat-today').textContent  = today.length;
  document.getElementById('ag-stat-past').textContent   = past.length;
}

/* --------------------------------------------------
   MODAL
   -------------------------------------------------- */
function openModal(eventId) {
  const event = EVENTS_DATA.find(e => e.id === eventId);
  if (!event) return;

  state.currentModalId = eventId;
  const status = getEventStatus(event.date);
  const saved  = isEventSaved(event.id);
  const isFree = event.price === 0;

  document.getElementById('modal-title').textContent = event.title;

  const stripMessages = {
    past:   '✅ Este evento ya finalizó',
    today:  '🔥 ¡Este evento es HOY!',
    future: `⏳ Faltan ${getDaysUntil(event.date)} día(s) para este evento`,
  };

  document.getElementById('modal-body').innerHTML = `
    <div class="modal__status-strip modal__strip--${status}" role="status">
      ${stripMessages[status]}
    </div>

    <p class="modal__desc">${event.description}</p>

    <div class="modal__info-grid">
      <div class="modal__info-item">
        <span class="modal__info-label">Categoría</span>
        <span class="modal__info-value">${getCatIcon(event.category)} ${event.category}</span>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-label">Precio</span>
        <span class="modal__info-value" style="${isFree ? 'color:var(--clr-future)' : ''}">${formatPrice(event.price)}</span>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-label">Fecha</span>
        <span class="modal__info-value">${formatDate(event.date)}</span>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-label">Horario</span>
        <span class="modal__info-value">${formatTime(event.date)}</span>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-label">Lugar</span>
        <span class="modal__info-value">${event.location}</span>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-label">Capacidad</span>
        <span class="modal__info-value">${event.capacity} personas</span>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-label">Organizador</span>
        <span class="modal__info-value">${event.organizer}</span>
      </div>
      ${event.tags && event.tags.length ? `
      <div class="modal__info-item">
        <span class="modal__info-label">Tags</span>
        <span class="modal__info-value">${event.tags.map(t => `#${t}`).join(' ')}</span>
      </div>` : ''}
    </div>
  `;

  document.getElementById('modal-footer').innerHTML = `
    <button
      class="btn ${saved ? 'btn--outline' : 'btn--primary'}"
      id="modal-save-btn"
      aria-label="${saved ? 'Quitar de mi agenda' : 'Guardar en mi agenda'}"
    >
      <span aria-hidden="true">${saved ? '📌' : '🔖'}</span>
      ${saved ? 'Quitar de agenda' : 'Guardar en agenda'}
    </button>
    <button class="btn btn--outline" id="modal-close-footer">Cerrar</button>
  `;

  document.getElementById('modal-save-btn').addEventListener('click', () => {
    toggleSaveEvent(eventId);
    // Re-render modal footer button
    const nowSaved = isEventSaved(eventId);
    const btn = document.getElementById('modal-save-btn');
    if (btn) {
      btn.innerHTML = `<span aria-hidden="true">${nowSaved ? '📌' : '🔖'}</span>${nowSaved ? 'Quitar de agenda' : 'Guardar en agenda'}`;
      btn.className = `btn ${nowSaved ? 'btn--outline' : 'btn--primary'}`;
    }
    if (document.getElementById('page-agenda').classList.contains('active')) renderAgenda();
  });

  document.getElementById('modal-close-footer').addEventListener('click', closeModal);

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  state.currentModalId = null;
}

function getDaysUntil(isoDate) {
  const now   = new Date();
  now.setHours(0,0,0,0);
  const event = new Date(isoDate);
  event.setHours(0,0,0,0);
  return Math.max(0, Math.round((event - now) / 86400000));
}

/* --------------------------------------------------
   NAVIGATION (SPA)
   -------------------------------------------------- */
function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav__link').forEach(l => {
    l.classList.remove('active');
    l.removeAttribute('aria-current');
  });

  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');

  // Activate nav link
  const targetLink = document.querySelector(`.nav__link[data-page="${pageId}"]`);
  if (targetLink) {
    targetLink.classList.add('active');
    targetLink.setAttribute('aria-current', 'page');
  }

  // Render content
  if (pageId === 'page-inicio')   renderHome();
  if (pageId === 'page-eventos') { renderCategoryChips(); renderEventsPage(); }
  if (pageId === 'page-agenda')   renderAgenda();

  // Close mobile menu
  closeMobileMenu();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeMobileMenu() {
  const links = document.getElementById('nav-links');
  const ham   = document.getElementById('hamburger');
  links.classList.remove('open');
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
}

/* --------------------------------------------------
   EVENT DELEGATION
   -------------------------------------------------- */
document.addEventListener('click', e => {

  // Nav links (SPA)
  const navLink = e.target.closest('[data-page]');
  if (navLink) {
    e.preventDefault();
    navigateTo(navLink.dataset.page);
    return;
  }

  // Save buttons (🔖)
  const saveBtn = e.target.closest('[data-save-id]');
  if (saveBtn) {
    const id = parseInt(saveBtn.dataset.saveId, 10);
    toggleSaveEvent(id);
    // Update icon on the clicked button
    const saved = isEventSaved(id);
    saveBtn.textContent = saved ? '📌' : '🔖';
    saveBtn.classList.toggle('saved', saved);
    // Re-render active page grid
    if (document.getElementById('page-eventos').classList.contains('active')) renderEventsPage();
    if (document.getElementById('page-agenda').classList.contains('active')) renderAgenda();
    return;
  }

  // Modal open (detail buttons)
  const detailBtn = e.target.closest('[data-modal-id]');
  if (detailBtn) {
    const id = parseInt(detailBtn.dataset.modalId, 10);
    openModal(id);
    return;
  }

  // Modal close button
  if (e.target.closest('#modal-close')) { closeModal(); return; }

  // Modal overlay backdrop
  if (e.target === document.getElementById('modal-overlay')) { closeModal(); return; }

  // Category cards on home
  const catCard = e.target.closest('.category-card');
  if (catCard) {
    state.activeCategory = catCard.dataset.cat;
    navigateTo('page-eventos');
    return;
  }

  // Category chips on events page
  const chip = e.target.closest('.chip[data-cat]');
  if (chip) {
    state.activeCategory = chip.dataset.cat;
    renderCategoryChips();
    renderEventsPage();
    return;
  }

  // Reset filters
  if (e.target.closest('#reset-filters')) {
    state.filters = { search: '', estado: 'all', precio: 'all', fecha: '' };
    state.activeCategory = 'all';
    state.sort = 'date-asc';
    document.getElementById('filter-search').value  = '';
    document.getElementById('filter-estado').value  = 'all';
    document.getElementById('filter-precio').value  = 'all';
    document.getElementById('filter-fecha').value   = '';
    document.getElementById('sort-select').value    = 'date-asc';
    renderCategoryChips();
    renderEventsPage();
    return;
  }

  // Clear agenda
  if (e.target.closest('#clear-agenda')) {
    if (state.savedEventIds.length === 0) return;
    if (confirm('¿Seguro que querés limpiar toda tu agenda?')) {
      state.savedEventIds = [];
      persistSaved();
      updateBadge();
      renderAgenda();
      showToast('Agenda limpiada', 'remove');
    }
    return;
  }

  // Hamburger
  if (e.target.closest('#hamburger')) {
    const links = document.getElementById('nav-links');
    const ham   = document.getElementById('hamburger');
    const isOpen = links.classList.toggle('open');
    ham.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', String(isOpen));
    return;
  }

});

/* --------------------------------------------------
   KEYBOARD: close modal on Escape
   -------------------------------------------------- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('modal-overlay').classList.contains('open')) {
      closeModal();
    } else {
      closeMobileMenu();
    }
  }
});

/* --------------------------------------------------
   FILTER LISTENERS
   -------------------------------------------------- */
document.getElementById('filter-search').addEventListener('input', e => {
  state.filters.search = e.target.value.trim();
  renderEventsPage();
});

document.getElementById('filter-estado').addEventListener('change', e => {
  state.filters.estado = e.target.value;
  renderEventsPage();
});

document.getElementById('filter-precio').addEventListener('change', e => {
  state.filters.precio = e.target.value;
  renderEventsPage();
});

document.getElementById('filter-fecha').addEventListener('change', e => {
  state.filters.fecha = e.target.value;
  renderEventsPage();
});

document.getElementById('sort-select').addEventListener('change', e => {
  state.sort = e.target.value;
  renderEventsPage();
});

/* --------------------------------------------------
   NAV scroll effect
   -------------------------------------------------- */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* --------------------------------------------------
   CATEGORY CARD keyboard a11y
   -------------------------------------------------- */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const catCard = e.target.closest('.category-card');
    if (catCard) {
      e.preventDefault();
      state.activeCategory = catCard.dataset.cat;
      navigateTo('page-eventos');
    }
  }
});

/* --------------------------------------------------
   INIT
   -------------------------------------------------- */
function init() {
  loadSaved();
  updateBadge();
  navigateTo('page-inicio');
}

init();
