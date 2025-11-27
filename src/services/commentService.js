// src/services/commentService.js
import { apiFetch } from "./api";

const commentService = {
    /**
     * Criar comentário
     * @param {number} seriesId
     * @param {string} content
     * @param {number|null} rating
     * @param {string|null} watchedAt
     * @param {string} seriesName - 🆕 Adicionado para a IA saber o contexto
     */
    async create(seriesId, content, rating = null, watchedAt = null, seriesName) {
        return apiFetch("/comments", {
            method: "POST",
            body: JSON.stringify({
                series_id: seriesId,
                content,
                rating,
                watched_at: watchedAt,
                series_name: seriesName, // 👈 AQUI ESTAVA FALTANDO!
            }),
        });
    },

    /**
     * Comentários de uma série
     */
    async getBySeries(seriesId) {
        return apiFetch(`/comments/series/${seriesId}`);
    },

    /**
     * Comentários de um usuário
     */
    async getByUser(userId) {
        return apiFetch(`/comments/user/${userId}`);
    },

    /**
     * Atualizar comentário — por enquanto só edita o texto
     */
    async update(commentId, content) {
        return apiFetch(`/comments/${commentId}`, {
            method: "PUT",
            body: JSON.stringify({ content }),
        });
    },

    /**
     * Excluir comentário
     */
    async remove(commentId) {
        return apiFetch(`/comments/${commentId}`, {
            method: "DELETE",
        });
    },
};

export default commentService;
