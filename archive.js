const ARCHIVE_STORAGE_KEY = 'synapse-archive';

function loadArchiveEntries() {
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Archive data unavailable or invalid.', error);
    return [];
  }
}

function renderArchive() {
  const archiveList = document.getElementById('archiveList');
  const searchInput = document.getElementById('archiveSearch');
  const clearAllButton = document.getElementById('clearAllButton');

  if (!archiveList || !searchInput || !clearAllButton) return;

  const entries = loadArchiveEntries();
  const query = searchInput.value.trim().toLowerCase();
  const filtered = entries.filter((entry) => {
    const haystack = `${entry.title || ''} ${entry.description || ''} ${entry.type || ''}`.toLowerCase();
    return haystack.includes(query);
  });

  if (!filtered.length) {
    archiveList.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>No saved memories yet</h3>
          <p>Generate an identity profile or a canvas composition to populate this archive.</p>
        </div>
      </div>
    `;
    return;
  }

  archiveList.innerHTML = filtered
    .map((entry) => {
      const created = new Date(entry.createdAt || Date.now()).toLocaleString();
      return `
        <article class="archive-card">
          <div>
            <p class="eyebrow">${entry.type === 'identity' ? 'Identity' : 'Artwork'}</p>
            <h3>${entry.title}</h3>
            <p>${entry.description}</p>
            ${entry.image ? `<img src="${entry.image}" alt="Saved artwork preview" style="border-radius:16px; max-height:160px; object-fit:cover; width:100%; margin-top:12px;" />` : ''}
          </div>
          <div class="archive-meta">
            <span>${created}</span>
            <button class="remove-entry" type="button" data-delete-id="${entry.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join('');

  archiveList.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.deleteId);
      const confirmed = window.confirm('Delete this saved item from the archive?');
      if (!confirmed) return;

      const nextEntries = loadArchiveEntries().filter((entry) => entry.id !== id);
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(nextEntries));
      renderArchive();
      showToast('Saved item removed.', 'success');
    });
  });
}

function clearArchive() {
  const confirmed = window.confirm('Clear all saved data from the local archive?');
  if (!confirmed) return;

  localStorage.removeItem(ARCHIVE_STORAGE_KEY);
  renderArchive();
  showToast('Archive cleared.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'archive') return;

  const searchInput = document.getElementById('archiveSearch');
  const clearAllButton = document.getElementById('clearAllButton');

  if (searchInput) {
    searchInput.addEventListener('input', renderArchive);
  }

  if (clearAllButton) {
    clearAllButton.addEventListener('click', clearArchive);
  }

  renderArchive();
});
