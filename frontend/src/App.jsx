import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import ProductsPage from "./pages/ProductsPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import ProductEditPage from "./pages/ProductEditPage";

import CategoriesPage from "./pages/CategoriesPage";
import CategoryCreatePage from "./pages/CategoryCreatePage";
import CategoryEditPage from "./pages/CategoryEditPage";

import MovementsPage from "./pages/MovementsPage";
import MovementCreatePage from "./pages/MovementCreatePage";

import UsersPage from "./pages/UsersPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserEditPage from "./pages/UserEditPage";

import { logout as logoutRequest, setAuthToken } from "./services/authService";

const THEME_STORAGE_KEY = "estoque-facil-theme";
const AUTH_STORAGE_KEY = "estoque-facil-auth";

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    document.documentElement.dataset.theme = theme;

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const [auth, setAuth] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
      return null;
    }

    try {
      return JSON.parse(storedAuth);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (auth?.token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setAuthToken(auth?.token ?? null);
  }, [auth]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const handleLoginSuccess = (data) => {
    if (!data?.token) {
      return;
    }

    setAuth({
      token: data.token,
      user: data.user,
    });
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Falha ao fazer logout", error);
    } finally {
      setAuth(null);
    }
  };

  const isAuthenticated = Boolean(auth?.token);

  const isOwner = auth?.user?.role === "proprietario";

  const defaultPath = isAuthenticated ? "/home" : "/login";

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header
          isAuthenticated={isAuthenticated}
          user={auth?.user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />

        <main className="app-main">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <LoginPage onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <HomePage user={auth?.user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Produtos */}
            <Route
              path="/products"
              element={
                isAuthenticated ? (
                  <ProductsPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/products/new"
              element={
                isAuthenticated ? (
                  <ProductCreatePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/products/:id/edit"
              element={
                isAuthenticated ? (
                  <ProductEditPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Categorias */}
            <Route
              path="/categories"
              element={
                isAuthenticated ? (
                  <CategoriesPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/categories/new"
              element={
                isAuthenticated ? (
                  <CategoryCreatePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/categories/:id/edit"
              element={
                isAuthenticated ? (
                  <CategoryEditPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Movimentações */}
            <Route
              path="/movements"
              element={
                isAuthenticated ? (
                  <MovementsPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/movements/new"
              element={
                isAuthenticated ? (
                  <MovementCreatePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Usuários */}
            <Route
              path="/users"
              element={
                isAuthenticated && isOwner ? (
                  <UsersPage />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            <Route
              path="/users/new"
              element={
                isAuthenticated && isOwner ? (
                  <UserCreatePage />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            <Route
              path="/users/:id/edit"
              element={
                isAuthenticated && isOwner ? (
                  <UserEditPage />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />

            {/* Redirects */}
            <Route path="/" element={<Navigate to={defaultPath} replace />} />

            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
