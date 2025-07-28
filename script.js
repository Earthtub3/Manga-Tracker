/*
 * Manga Sammlung Tracker
 *
 * Dieses Skript verwaltet eine lokale Manga‑Bibliothek. Nutzerinnen und Nutzer
 * können Titel hinzufügen, bearbeiten und löschen. Es werden Statistiken
 * berechnet und ein Fortschrittsbalken angezeigt. Optional können über die
 * Jikan API Basisinformationen zu einem Titel abgefragt und Formularfelder
 * automatisch ausgefüllt werden.
 */

// Globale Variablen
let mangaLibrary = [];
let editMode = false;
let editId = null;

// Hilfsfunktion zur Generierung einer eindeutigen ID
function generateID() {
  return (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  );
}

// Bibliothek aus localStorage laden
function loadLibrary() {
  const data = localStorage.getItem('mangaLibrary');
  if (data) {
    try {
      mangaLibrary = JSON.parse(data);
    } catch (e) {
      console.error('Fehler beim Laden der Bibliothek:', e);
      mangaLibrary = [];
    }
  }
}

// Bibliothek speichern
function saveLibrary() {
  localStorage.setItem('mangaLibrary', JSON.stringify(mangaLibrary));
}

// Statistiken aktualisieren
function updateStats() {
  const totalTitlesEl = document.getElementById('totalTitles');
  const chaptersReadEl = document.getElementById('chaptersRead');
  const chaptersTotalEl = document.getElementById('chaptersTotal');
  const completionRateEl = document.getElementById('completionRate');

  const totalTitles = mangaLibrary.length;
  let chaptersRead = 0;
  let chaptersTotal = 0;

  mangaLibrary.forEach((item) => {
    const read = parseInt(item.chaptersRead, 10) || 0;
    const total = parseInt(item.totalChapters, 10) || 0;
    chaptersRead += read;
    if (total > 0) {
      chaptersTotal += total;
    }
  });

  const completionRate = chaptersTotal
    ? ((chaptersRead / chaptersTotal) * 100).toFixed(0)
    : 0;

  totalTitlesEl.textContent = totalTitles;
  chaptersReadEl.textContent = chaptersRead;
  chaptersTotalEl.textContent = chaptersTotal;
  completionRateEl.textContent = `${completionRate}%`;
}

// Karte für einen Manga erstellen
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  // Coverbild
  const img = document.createElement('img');
  if (item.coverUrl) {
    img.src = item.coverUrl;
  } else {
    // Platzhalter verwenden, falls kein Cover verfügbar
    img.src = 'https://via.placeholder.com/350x500?text=Manga';
  }
  img.alt = item.title;
  card.appendChild(img);

  // Inhalt
  const content = document.createElement('div');
  content.className = 'card-content';

  const titleEl = document.createElement('div');
  titleEl.className = 'card-title';
  titleEl.textContent = item.title;
  content.appendChild(titleEl);

  const authorEl = document.createElement('div');
  authorEl.className = 'card-author';
  authorEl.textContent = item.author ? item.author : 'Unbekannter Autor';
  content.appendChild(authorEl);

  // Fortschritt
  const progressText = document.createElement('div');
  progressText.className = 'progress-text';
  const read = parseInt(item.chaptersRead, 10) || 0;
  const total = parseInt(item.totalChapters, 10) || 0;
  if (total > 0) {
    progressText.textContent = `${read} / ${total} Kapitel gelesen`;
  } else {
    progressText.textContent = `${read} Kapitel gelesen`;
  }
  content.appendChild(progressText);

  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  const percentage = total > 0 ? Math.min((read / total) * 100, 100) : 0;
  progressBar.style.width = `${percentage}%`;
  progressContainer.appendChild(progressBar);
  content.appendChild(progressContainer);

  // Buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'card-buttons';
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Bearbeiten';
  editBtn.addEventListener('click', () => openModal(item.id));
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Löschen';
  deleteBtn.addEventListener('click', () => deleteItem(item.id));
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);
  content.appendChild(buttonContainer);

  card.appendChild(content);
  return card;
}

// Bibliothek anzeigen
function renderLibrary() {
  const libraryEl = document.getElementById('library');
  libraryEl.innerHTML = '';
  const searchValue = document.getElementById('searchInput').value
    .toLowerCase()
    .trim();
  const statusValue = document.getElementById('statusFilter').value;
  mangaLibrary.forEach((item) => {
    // Filter anwenden
    const matchesSearch = item.title.toLowerCase().includes(searchValue);
    const matchesStatus = statusValue ? item.status === statusValue : true;
    if (matchesSearch && matchesStatus) {
      libraryEl.appendChild(createCard(item));
    }
  });
  updateStats();
}

// Modal öffnen (für Hinzufügen oder Bearbeiten)
function openModal(id = null) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const totalChaptersInput = document.getElementById('totalChapters');
  const chaptersReadInput = document.getElementById('chaptersReadInput');
  const statusSelect = document.getElementById('statusSelect');
  const coverInput = document.getElementById('coverUrl');
  const synopsisInput = document.getElementById('synopsis');
  const searchQueryInput = document.getElementById('searchQuery');
  const apiResult = document.getElementById('apiResult');

  apiResult.textContent = '';
  searchQueryInput.value = '';
  if (id) {
    editMode = true;
    editId = id;
    modalTitle.textContent = 'Manga bearbeiten';
    const item = mangaLibrary.find((m) => m.id === id);
    if (item) {
      titleInput.value = item.title;
      authorInput.value = item.author || '';
      totalChaptersInput.value = item.totalChapters || '';
      chaptersReadInput.value = item.chaptersRead || 0;
      statusSelect.value = item.status || 'reading';
      coverInput.value = item.coverUrl || '';
      synopsisInput.value = item.synopsis || '';
    }
  } else {
    editMode = false;
    editId = null;
    modalTitle.textContent = 'Manga hinzufügen';
    titleInput.value = '';
    authorInput.value = '';
    totalChaptersInput.value = '';
    chaptersReadInput.value = 0;
    statusSelect.value = 'reading';
    coverInput.value = '';
    synopsisInput.value = '';
  }
  modal.classList.remove('hidden');
}

// Modal schließen
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
}

// Element löschen
function deleteItem(id) {
  if (confirm('Möchtest du dieses Element wirklich löschen?')) {
    mangaLibrary = mangaLibrary.filter((item) => item.id !== id);
    saveLibrary();
    renderLibrary();
  }
}

// API-Suche durchführen
async function searchApi() {
  const query = document.getElementById('searchQuery').value.trim();
  const apiResult = document.getElementById('apiResult');
  if (!query) {
    apiResult.textContent = 'Bitte einen Titel eingeben.';
    return;
  }
  apiResult.textContent = 'Suche…';
  try {
    // Jikan API – Manga Suche
    const response = await fetch(
      `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`
    );
    if (!response.ok) {
      throw new Error('Fehler bei der API-Anfrage');
    }
    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      const manga = data.data[0];
      // Felder füllen
      document.getElementById('title').value = manga.title;
      document.getElementById('author').value =
        manga.authors && manga.authors.length > 0
          ? manga.authors.map((a) => a.name).join(', ')
          : '';
      document.getElementById('totalChapters').value =
        manga.chapters || '';
      document.getElementById('synopsis').value = manga.synopsis || '';
      document.getElementById('coverUrl').value =
        manga.images && manga.images.jpg && manga.images.jpg.image_url
          ? manga.images.jpg.image_url
          : '';
      apiResult.textContent = `Gefunden: ${manga.title}`;
    } else {
      apiResult.textContent = 'Keine Ergebnisse gefunden.';
    }
  } catch (error) {
    console.error(error);
    apiResult.textContent = 'Fehler bei der Suche.';
  }
}

// Formular-Submit (Speichern)
function handleFormSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const totalChapters = document.getElementById('totalChapters').value;
  const chaptersRead = document.getElementById('chaptersReadInput').value;
  const status = document.getElementById('statusSelect').value;
  const coverUrl = document.getElementById('coverUrl').value.trim();
  const synopsis = document.getElementById('synopsis').value.trim();

  if (!title) {
    alert('Bitte gib einen Titel ein.');
    return;
  }

  if (editMode && editId) {
    // Aktualisieren
    mangaLibrary = mangaLibrary.map((item) => {
      if (item.id === editId) {
        return {
          ...item,
          title,
          author,
          totalChapters: totalChapters ? parseInt(totalChapters, 10) : '',
          chaptersRead: chaptersRead ? parseInt(chaptersRead, 10) : 0,
          status,
          coverUrl,
          synopsis,
        };
      }
      return item;
    });
  } else {
    // Neues Element hinzufügen
    mangaLibrary.push({
      id: generateID(),
      title,
      author,
      totalChapters: totalChapters ? parseInt(totalChapters, 10) : '',
      chaptersRead: chaptersRead ? parseInt(chaptersRead, 10) : 0,
      status,
      coverUrl,
      synopsis,
    });
  }

  saveLibrary();
  renderLibrary();
  closeModal();
}

// Event Listener setzen
function init() {
  loadLibrary();
  renderLibrary();
  // Suche und Filter
  document.getElementById('searchInput').addEventListener('input', () => {
    renderLibrary();
  });
  document.getElementById('statusFilter').addEventListener('change', () => {
    renderLibrary();
  });
  // Add Button
  document.getElementById('addBtn').addEventListener('click', () => openModal());
  // Modal schließen
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  // API Suche
  document
    .getElementById('searchApiBtn')
    .addEventListener('click', searchApi);
  // Formular absenden
  document
    .getElementById('mangaForm')
    .addEventListener('submit', handleFormSubmit);
}

// Initialisieren, wenn DOM bereit ist
document.addEventListener('DOMContentLoaded', init);