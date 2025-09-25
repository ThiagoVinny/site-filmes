import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const SeriesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [serie, setSerie] = useState(null);
    const [cast, setCast] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);

                // Detalhes da série
                const resSerie = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
                if (!resSerie.ok) throw new Error("Erro ao buscar detalhes da série.");
                const serieData = await resSerie.json();
                setSerie(serieData);

                // Elenco
                const resCast = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
                const castData = await resCast.json();
                setCast(castData.cast?.slice(0, 5) || []);

                // Trailer
                const resVideo = await fetch(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=pt-BR`);
                const videoData = await resVideo.json();
                const trailer = videoData.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
                setVideo(trailer);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) return <p style={{ color: "white", textAlign: "center", padding: "2rem" }}>Carregando série...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", padding: "2rem" }}>{error}</p>;
    if (!serie) return null;

    return (
        <div style={{
            minHeight: "100vh",
            padding: "2rem",
            background: "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)",
            color: "white"
        }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "2rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "rgba(107, 114, 128, 0.5)",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    color: "white"
                }}
            >
                ← Voltar
            </button>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                backdropFilter: "blur(6px)",
                borderRadius: "1rem",
                padding: "1rem",
                backgroundColor: "rgba(0,0,0,0.4)"
            }}>
                <img
                    src={serie.poster_path ? `${IMAGE_BASE_URL}${serie.poster_path}` : ""}
                    alt={serie.name}
                    style={{ width: "300px", borderRadius: "1rem" }}
                />

                <div style={{ maxWidth: "600px" }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{serie.name}</h1>
                    <p style={{ marginBottom: "0.5rem", fontStyle: "italic" }}>
                        {serie.first_air_date ? `Estreia: ${serie.first_air_date}` : ""}
                    </p>
                    <p style={{ marginBottom: "1rem" }}>{serie.overview || "Sem descrição disponível."}</p>
                    <p style={{ marginBottom: "0.5rem" }}>Nota: ⭐ {serie.vote_average?.toFixed(1) || "N/A"} ({serie.vote_count} votos)</p>

                    {serie.genres && (
                        <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Gêneros:</strong> {serie.genres.map(g => g.name).join(", ")}
                        </p>
                    )}

                    {cast.length > 0 && (
                        <p style={{ marginBottom: "0.5rem" }}>
                            <strong>Elenco:</strong> {cast.map(c => c.name).join(", ")}
                        </p>
                    )}

                    {video && (
                        <div style={{ marginTop: "1rem" }}>
                            <h3>Trailer:</h3>
                            <iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${video.key}`}
                                title="Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: "1rem" }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeriesDetails;
