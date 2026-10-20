// Local storage utilities for Al-Miftah app

const BOOKMARKS_KEY = 'almiftah_bookmarks';
const PROGRESS_KEY = 'almiftah_progress';
const QUIZ_HISTORY_KEY = 'almiftah_quiz_history';

export const getBookmarks = () => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveBookmark = (item) => {
  try {
    const current = getBookmarks();
    const exists = current.some(b => b.id === item.id && b.type === item.type);
    let updated;
    if (exists) {
      updated = current.filter(b => !(b.id === item.id && b.type === item.type));
    } else {
      updated = [{ ...item, savedAt: new Date().toISOString() }, ...current];
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const isBookmarked = (id, type) => {
  const current = getBookmarks();
  return current.some(b => b.id === id && b.type === type);
};

export const getCompletedMateri = () => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const toggleMateriComplete = (idMateri) => {
  try {
    const current = getCompletedMateri();
    const updated = current.includes(idMateri)
      ? current.filter(id => id !== idMateri)
      : [...current, idMateri];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};
