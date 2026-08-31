// State
let currentFilter = 'all';
let currentSearch = '';
let torrents = [];
let isLoggedIn = false;
const ADMIN_PASSWORD = 'admin123';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    checkAdminStatus();
    loadTorrents();
});

// Load torrents from data/torrents.json (remote or local)
async function loadTorrents() {
    try {
        // Intentar cargar desde data/torrents.json (funciona en ambos: local y GitHub Pages)
        const response = await fetch('data/torrents.json');
        if (response.ok) {
            const data = await response.json();
            torrents = Array.isArray(data) ? data : [];
        } else {
            // Si no existe data/torrents.json, cargar desde localStorage
            loadFromLocalStorage();
        }
    } catch (error) {
        console.log('Usando localStorage como fallback');
        loadFromLocalStorage();
    }
    
    render();
}

// Load torrents from localStorage (fallback)
function loadFromLocalStorage() {
    const stored = localStorage.getItem('mcu-torrents');
    if (stored) {
        try {
            torrents = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading torrents:', e);
            torrents = [];
        }
    } else {
        torrents = [];
    }
}

// Save torrents to localStorage
function saveTorrents() {
    localStorage.setItem('mcu-torrents', JSON.stringify(torrents));
}

// Theme Toggle
function initTheme() {
    const theme = localStorage.getItem('mcu-torrents-theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcon();
    }

    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const newTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('mcu-torrents-theme', newTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    const isLight = document.body.classList.contains('light-mode');
    icon.textContent = isLight ? '☀️' : '🌙';
}

// Event Listeners
function initEventListeners() {
    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            render();
        });
    });

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        render();
    });

    // Admin Button
    document.getElementById('admin-btn').addEventListener('click', () => {
        openAdminModal();
    });

    // Close Admin Modal
    document.getElementById('close-admin-modal').addEventListener('click', () => {
        document.getElementById('admin-modal').close();
    });

    // Admin Form
    document.getElementById('add-torrent-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTorrent();
    });

    // Admin Login Form
    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleAdminLogin();
    });

    // Cancel Login
    document.getElementById('cancel-login').addEventListener('click', () => {
        document.getElementById('admin-login-modal').close();
    });

    // Logout Button
    document.getElementById('logout-btn').addEventListener('click', () => {
        handleLogout();
    });
}

// Admin Authentication
function checkAdminStatus() {
    isLoggedIn = sessionStorage.getItem('mcu-admin-session') === 'true';
    updateAdminUI();
}

function handleAdminLogin() {
    const password = document.getElementById('admin-password').value;
    
    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        sessionStorage.setItem('mcu-admin-session', 'true');
        document.getElementById('admin-login-modal').close();
        document.getElementById('admin-password').value = '';
        openAdminPanel();
        updateAdminUI();
    } else {
        alert('❌ Contraseña incorrecta');
        document.getElementById('admin-password').value = '';
    }
}

function handleLogout() {
    isLoggedIn = false;
    sessionStorage.removeItem('mcu-admin-session');
    document.getElementById('admin-modal').close();
    updateAdminUI();
    alert('✓ Sesión cerrada');
}

function updateAdminUI() {
    const logoutBtn = document.getElementById('logout-btn');
    if (isLoggedIn) {
        logoutBtn.style.display = 'block';
    } else {
        logoutBtn.style.display = 'none';
    }
}

// Open Admin (with login check)
function openAdminModal() {
    if (!isLoggedIn) {
        document.getElementById('admin-login-modal').showModal();
    } else {
        openAdminPanel();
    }
}

function openAdminPanel() {
    document.getElementById('admin-modal').showModal();
    renderAdminList();
}

// Add Torrent from Form
function addTorrent() {
    const title = document.getElementById('torrent-title').value.trim();
    const type = document.getElementById('torrent-type').value;
    const year = document.getElementById('torrent-year').value;
    const quality = document.getElementById('torrent-quality').value;
    const magnet = document.getElementById('torrent-magnet').value.trim();
    const poster = document.getElementById('torrent-poster').value.trim();
    const description = document.getElementById('torrent-description').value.trim();

    if (!title || !type || !magnet) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    const torrent = {
        id: Date.now(),
        title,
        type,
        year: year || new Date().getFullYear().toString(),
        quality: quality || '720p',
        magnet,
        poster: poster || 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(title),
        description: description || 'Sin descripción disponible',
        added: new Date().toLocaleString()
    };

    torrents.unshift(torrent);
    saveTorrents();

    // Clear form
    document.getElementById('add-torrent-form').reset();

    // Update list
    renderAdminList();
    render();

    alert('✓ Torrent agregado exitosamente');
}

// Delete Torrent
function deleteTorrent(id) {
    if (confirm('¿Eliminar este torrent?')) {
        torrents = torrents.filter(t => t.id !== id);
        saveTorrents();
        renderAdminList();
        render();
    }
}

// Render Admin List
function renderAdminList() {
    const container = document.getElementById('torrents-list');
    container.innerHTML = '';

    if (torrents.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--dark-text-secondary);">No hay torrents registrados</p>';
        return;
    }

    torrents.forEach(torrent => {
        const item = document.createElement('div');
        item.className = 'torrent-item';
        item.innerHTML = `
            <div class="torrent-item-title">
                <strong>${torrent.title}</strong>
                <br />
                <small>${torrent.type} • ${torrent.year} • ${torrent.quality}</small>
            </div>
            <div class="torrent-item-actions">
                <button onclick="deleteTorrent(${torrent.id})">Eliminar</button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Filter Torrents
function getFilteredTorrents() {
    let filtered = torrents;

    // Filter by type
    if (currentFilter !== 'all') {
        filtered = filtered.filter(t => t.type === currentFilter);
    }

    // Filter by search
    if (currentSearch) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(currentSearch) ||
            t.description.toLowerCase().includes(currentSearch)
        );
    }

    return filtered;
}

// Render Main Grid
function render() {
    const filtered = getFilteredTorrents();
    const grid = document.getElementById('torrents-grid');
    const empty = document.getElementById('empty-state');

    if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    grid.innerHTML = '';

    filtered.forEach(torrent => {
        const card = createTorrentCard(torrent);
        grid.appendChild(card);
    });
}

// Create Torrent Card
function createTorrentCard(torrent) {
    const template = document.getElementById('torrent-card-template');
    const card = template.content.cloneNode(true);

    // Fill card data
    card.querySelector('.poster-img').src = torrent.poster;
    card.querySelector('.poster-img').alt = torrent.title;
    card.querySelector('.quality-badge').textContent = torrent.quality;
    card.querySelector('.card-title').textContent = torrent.title;
    card.querySelector('.card-meta').textContent = `${torrent.type.toUpperCase()} • ${torrent.year}`;
    card.querySelector('.card-description').textContent = torrent.description;

    // Magnet Button
    const magnetBtn = card.querySelector('.btn-magnet');
    magnetBtn.addEventListener('click', () => {
        window.location.href = torrent.magnet;
    });

    // Download Button
    const downloadBtn = card.querySelector('.btn-download');
    downloadBtn.addEventListener('click', () => {
        // Create torrent file download (simulated)
        const link = document.createElement('a');
        link.href = `data:text/plain,${encodeURIComponent(torrent.magnet)}`;
        link.download = `${torrent.title}.magnet`;
        link.click();
    });

    return card;
}

// Copy to Clipboard (helper)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✓ Copiado al portapapeles');
    });
}
