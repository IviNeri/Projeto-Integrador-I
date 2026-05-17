import { Link, NavLink } from "react-router-dom";

export default function Header({
  isAuthenticated,
  user,
  theme,
  onToggleTheme,
  onLogout,
}) {
  const isDark = theme === "dark";
  const nextThemeLabel = isDark
    ? "Mudar para tema claro"
    : "Mudar para tema escuro";

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="brand" to="/home">
          EstoqueFacil
        </Link>
        <nav className="header-nav" aria-label="Navegação principal">
          {isAuthenticated ? (
            <div className="header-nav__links">
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? " nav-link--active" : ""}`
                }
                to="/products"
              >
                Produtos
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? " nav-link--active" : ""}`
                }
                to="/categories"
              >
                Categorias
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? " nav-link--active" : ""}`
                }
                to="/movements"
              >
                Movimentações
              </NavLink>

              {user?.role === "proprietario" ? (
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " nav-link--active" : ""}`
                  }
                  to="/users"
                >
                  Usuários
                </NavLink>
              ) : null}
            </div>
          ) : null}
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <button className="logout-button" type="button" onClick={onLogout}>
              <i
                className="fa-solid fa-right-from-bracket"
                aria-hidden="true"
              />
              <span>Sair</span>
            </button>
          ) : null}
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={nextThemeLabel}
            aria-pressed={isDark}
          >
            <i
              className={isDark ? "fa-solid fa-sun" : "fa-solid fa-moon"}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
