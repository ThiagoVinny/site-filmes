import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

import Header from "./components/Header";

import Home from "./pages/Home";
import SeriesDetails from "./pages/SeriesDetails";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recover from "./pages/Recover";
import Comentarios from "./pages/Comentarios";
import Profile from "./pages/Profile";

function App() {
    return (
        <AuthProvider>
            <Router>
                {/* Header visível em todas as páginas */}
                <Header />

                <Routes>
                    {/* Rotas públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/recover" element={<Recover />} />

                    {/* Rotas protegidas */}
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                                <Home />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/series/:id"
                        element={
                            <RequireAuth>
                                <SeriesDetails />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/ranking"
                        element={
                            <RequireAuth>
                                <Ranking />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/series/:id/comentarios"
                        element={
                            <RequireAuth>
                                <Comentarios />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <Profile />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
