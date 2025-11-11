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
