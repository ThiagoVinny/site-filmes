import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import GuestRoute from "./components/GuestRoute";

import Header from "./components/Header";

import Home from "./pages/Home";
import SeriesDetails from "./pages/SeriesDetails";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recover from "./pages/Recover";
import Comentarios from "./pages/Comentarios";
import Profile from "./pages/Profile";
import FolderView from "./pages/FolderView"; // 🆕 Import da nova tela

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />

                <Routes>
                    <Route
                        path="/login"
                        element={
                            <GuestRoute>
                                <Login />
                            </GuestRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <GuestRoute>
                                <Register />
                            </GuestRoute>
                        }
                    />

                    <Route
                        path="/recover"
                        element={
                            <GuestRoute>
                                <Recover />
                            </GuestRoute>
                        }
                    />

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

                    <Route
                        path="/folders/:id"
                        element={
                            <RequireAuth>
                                <FolderView />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
