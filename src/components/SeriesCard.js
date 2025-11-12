// src/components/SeriesCard.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const IMG = (p) =>
    p
        ? `https://image.tmdb.org/t/p/w500${p}`
        : "https://via.placeholder.com/500x750?text=Sem+Imagem";

const Icon = {
    star: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
    ),
    calendar: (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
};

const glass = {
    background: "rgba(17,25,40,.55)",
    border: "1px solid rgba(255,255,255,.06)",
    boxShadow: "0 12px 40px rgba(0,0,0,.35)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
};

export default function SeriesCard({
                                       data,
                                       s,
                                       serie,
                                       movie,
                                       basePath = "/series",
                                       onAddToFolder,
                                   }) {
    const [hover, setHover] = useState(false);

    const item = data || s || serie || movie || {};
    const title = item.name || item.title || "Sem título";
    const dateStr = item.first_air_date || item.release_date || null;
    const year = dateStr ? new Date(dateStr).getFullYear() : "N/A";
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
    const linkTo = `${basePath}/${item.id}`;

    return (
        <div
            style={{
                position: "relative",
                ...glass,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform .25s, box-shadow .25s",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Link para detalhes */}
            <Link to={linkTo} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative" }}>
                    <img
                        src={IMG(item.poster_path)}
                        alt={title}
                        style={{
                            width: "100%",
                            height: 340,
                            objectFit: "cover",
                            display: "block",
                            transition: "all 0.3s ease",
                            filter: hover ? "brightness(0.85)" : "brightness(1)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            background: "rgba(0,0,0,.65)",
                            backdropFilter: "blur(10px)",
                            borderRadius: 8,
                            padding: "4px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: "#fbbf24",
                        }}
                    >
                        {Icon.star} <b>{rating}</b>
                    </div>
                </div>

                <div style={{ padding: 14 }}>
                    <h3
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            lineHeight: 1.35,
                            marginBottom: 8,
                            height: 44,
                            overflow: "hidden",
                        }}
                    >
                        {title}
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            color: "#94a3b8",
                            fontSize: 14,
                        }}
                    >
                        {Icon.calendar} <span>{year}</span>
                    </div>
                </div>
            </Link>

            {/* Botão de adicionar à pasta */}
            {hover && (
                <button
                    onClick={(e) => {
                        e.preventDefault(); // evita o clique abrir o link
                        e.stopPropagation();
                        onAddToFolder && onAddToFolder(item);
                    }}
                    style={{
                        position: "absolute",
                        bottom: 14,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg,#a855f7,#ec4899)",
                        border: "none",
                        borderRadius: 10,
                        color: "white",
                        padding: "6px 14px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 13,
                        opacity: 0.95,
                        boxShadow: "0 6px 14px rgba(236,72,153,0.3)",
                        transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(-50%) scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(-50%) scale(1)")}
                >
                    + Adicionar
                </button>
            )}
        </div>
    );
}
