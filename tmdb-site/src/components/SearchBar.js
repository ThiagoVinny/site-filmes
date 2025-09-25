import React, { useState } from "react";

const icons = {
    search: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    ),
};

// AQUI já é o default export
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
        <div style={{ position: "relative", maxWidth: 400, margin: "0 auto" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                {icons.search}
            </span>
            <input
                type="text"
                value={input}
                placeholder="Buscar séries..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                    width: "100%",
                    padding: "0.6rem 3rem 0.6rem 2.5rem",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: 16,
                    outline: "none"
                }}
            />
            {input && (
                <button
                    onClick={handleClear}
                    style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(107,114,128,0.5)",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.3rem 0.8rem",
                        color: "white",
                        cursor: "pointer"
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
}
