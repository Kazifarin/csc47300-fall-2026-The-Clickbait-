// Favorites (star button + "My favorites" tab, from our original design)

import { load, save } from "./utils.js";

const KEY = "crf_favorites";
const favorites = new Set<number>(load<number[]>(KEY, []));

export function isFavorite(id: number): boolean {
  return favorites.has(id);
}

// Returns true if it is now a favorite
export function toggleFavorite(id: number): boolean {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  save(KEY, [...favorites]);
  return favorites.has(id);
}
