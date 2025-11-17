import React, { useEffect, useState } from "react";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";

export default function Comentarios({ movieId }) {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${BASE_URL}/tv/${movieId}/reviews?api_key=${API_KEY}&language=pt-BR&page=1`
                );
                if (!res.ok) throw new Error("Erro ao carregar comentários.");
                const data = await res.json();
                setComentarios(data.results);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar comentários.");
                setComentarios([]);
            } finally {
                setLoading(false);
            }
        };

        fetchComentarios();
    }, [movieId]);

    if (loading)
        return <p style={{ color: "white" }}>Carregando comentários...</p>;
    if (error)
        return <p style={{ color: "red" }}>{error}</p>;

    if (comentarios.length === 0)
        return <p style={{ color: "white" }}>Nenhum comentário disponível.</p>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {comentarios.map((c) => (
                <div
                    key={c.id}
                    style={{
                        background: "rgba(30,41,59,0.8)",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                    }}
                >
                    <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{c.author}</p>
                    <p style={{ marginBottom: "0.5rem" }}>{c.content}</p>
                    <a
                        href={`https://www.themoviedb.org/review/${c.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#60a5fa" }}
                    >
                        Ver comentário completo
                    </a>
                </div>
            ))}
        </div>
    );
}
