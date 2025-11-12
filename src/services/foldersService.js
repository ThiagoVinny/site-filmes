// src/services/foldersService.js
import { apiFetch } from "./api";

// Lista as pastas do usuário
export async function getFolders() {
    return apiFetch("/folders", { method: "GET" });
}

// Cria uma nova pasta
export async function createFolder(name, description) {
    return apiFetch("/folders", {
        method: "POST",
        body: JSON.stringify({ name, description }),
    });
}

// Deleta uma pasta
export async function deleteFolder(id) {
    return apiFetch(`/folders/${id}`, { method: "DELETE" });
}

// Adiciona uma série a uma pasta
export async function addSerieToFolder(folderId, tmdbId, mediaType = "tv") {
    return apiFetch(`/folders/${folderId}/series`, {
        method: "POST",
        body: JSON.stringify({ tmdb_id: tmdbId, media_type: mediaType }),
    });
}

// Lista as séries dentro de uma pasta
// Lista as séries dentro de uma pasta
export async function getFolderSeries(folderId) {
    return apiFetch(`/folders/${folderId}/series`, { method: "GET" });
}

