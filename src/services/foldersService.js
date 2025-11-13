// src/services/foldersService.js
import { apiFetch } from "./api";

export async function getFolders() {
    return apiFetch("/folders", { method: "GET" });
}

export async function createFolder(name, description) {
    return apiFetch("/folders", {
        method: "POST",
        body: JSON.stringify({ name, description }),
    });
}

export async function deleteFolder(id) {
    return apiFetch(`/folders/${id}`, { method: "DELETE" });
}

export async function addSerieToFolder(folderId, tmdbId, mediaType = "tv") {
    return apiFetch(`/folders/${folderId}/add`, {
        method: "POST",
        body: JSON.stringify({ tmdb_id: tmdbId, media_type: mediaType }),
    });
}

export async function getFolderSeries(folderId) {
    return apiFetch(`/folders/${folderId}/series`, { method: "GET" });
}

