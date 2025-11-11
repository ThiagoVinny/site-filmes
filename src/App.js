import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import SeriesDetails from "./pages/SeriesDetails";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recover from "./pages/Recover";
import Comentarios from "./pages/Comentarios";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/recover" element={<Recover />} />

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
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
