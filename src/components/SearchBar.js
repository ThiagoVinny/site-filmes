import React, { useState } from "react";

const icons = {
    search: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
};

export default function SearchBar({ onSearch }) {
    const [input, setInput] = useState("");

    const handleSearch = () => {
        if (onSearch) onSearch(input.trim());
    };

    const handleClear = () => {
        setInput("");
        if (onSearch) onSearch("");
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                margin: "1.5rem auto 3rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 40,
                    padding: "0.4rem 0.4rem 0.4rem 1rem",
                    maxWidth: 480,
                    width: "100%",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                }}
            >
                <span style={{ color: "#9ca3af", marginRight: 10 }}>{icons.search}</span>

                <input
                    type="text"
                    value={input}
                    placeholder="Buscar séries..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        color: "white",
                        fontSize: 15,
                        outline: "none",
                        padding: "0.4rem 0",
                    }}
                />

                {input && (
                    <button
                        onClick={handleClear}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#9ca3af",
                            cursor: "pointer",
                            fontSize: 18,
                            marginRight: 8,
                        }}
                    >
                        ✕
                    </button>
                )}

                <button
                    onClick={handleSearch}
                    style={{
                        background: "linear-gradient(135deg, #a855f7, #ec4899)",
                        border: "none",
                        borderRadius: 30,
                        padding: "0.5rem 1.3rem",
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 14,
                        transition: "all 0.25s",
                        boxShadow: "0 4px 12px rgba(236,72,153,0.35)",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                    }
                >
                    Buscar
                </button>
            </div>
        </div>
    );
}
