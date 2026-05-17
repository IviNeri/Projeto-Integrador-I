import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers } from "../services/userService";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 15,
  total: 0,
  totalPages: 1,
};

const INITIAL_FILTERS = {
  search: "",
  role: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async (page, filterParams) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchUsers({
        page,
        search: filterParams.search,
        role: filterParams.role,
      });

      setUsers(data?.data || []);

      const totalPages = Math.max(Number(data?.pagination?.totalPages) || 1, 1);

      setPagination({
        page: data?.pagination?.page ?? page,
        limit: data?.pagination?.limit ?? DEFAULT_PAGINATION.limit,
        total: data?.pagination?.total ?? 0,
        totalPages,
      });
    } catch (error) {
      const apiError = error?.response?.data?.error;

      if (apiError) {
        setErrorMessage(`Não foi possível carregar os usuários: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível carregar os usuários.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(pagination.page, appliedFilters);
  }, [pagination.page, appliedFilters]);

  const handleNextPage = () => {
    setPagination((current) => ({
      ...current,
      page: Math.min(current.page + 1, current.totalPages),
    }));
  };

  const handlePreviousPage = () => {
    setPagination((current) => ({
      ...current,
      page: Math.max(current.page - 1, 1),
    }));
  };

  const handleRetry = () => {
    loadUsers(pagination.page, appliedFilters);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();

    setPagination((current) => ({
      ...current,
      page: 1,
    }));

    setAppliedFilters(filters);

    setIsFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));

    setIsFiltersOpen(false);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleRowKeyDown = (event, user) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectUser(user);
    }
  };

  const isEmpty = !isLoading && !errorMessage && users.length === 0;

  const activeFilterCount = Object.values(appliedFilters).filter(
    (value) => value !== "" && value !== null && value !== undefined,
  ).length;

  const editPath = selectedUser ? `/users/${selectedUser.id}/edit` : "/users";

  return (
    <section className="products-page">
      <div className="products-card">
        <header className="products-header">
          <div>
            <h1 className="products-title">Usuários</h1>

            <p className="products-subtitle">
              Gerencie os usuários cadastrados no sistema.
            </p>
          </div>

          <div className="products-header__actions">
            <Link className="products-add-button" to="/users/new">
              Novo usuário
            </Link>

            <div className="pagination-status">
              {pagination.page} de {pagination.totalPages} · {pagination.total}{" "}
              itens
            </div>
          </div>
        </header>

        <div className="products-filter-toggle">
          <div className="filter-summary">
            <span className="filter-title">Filtros</span>

            {activeFilterCount > 0 ? (
              <span className="filter-badge">{activeFilterCount}</span>
            ) : (
              <span className="filter-hint">Opcional</span>
            )}
          </div>

          <button
            className="filter-toggle-button"
            type="button"
            onClick={() => setIsFiltersOpen((current) => !current)}
          >
            {isFiltersOpen ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {isFiltersOpen ? (
          <form className="products-filters" onSubmit={handleApplyFilters}>
            <label className="filter-field">
              <span className="filter-label">Busca</span>

              <input
                className="filter-input"
                type="search"
                name="search"
                placeholder="Buscar por nome ou e-mail"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </label>

            <label className="filter-field">
              <span className="filter-label">Cargo</span>

              <select
                className="filter-input"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="proprietario">Proprietário</option>
                <option value="funcionario">Funcionário</option>
              </select>
            </label>

            <div className="filter-actions">
              <button className="filter-button" type="submit">
                Aplicar filtros
              </button>

              <button
                className="filter-button filter-button--ghost"
                type="button"
                onClick={handleClearFilters}
              >
                Limpar
              </button>
            </div>
          </form>
        ) : null}

        <div className="products-table">
          {isLoading ? (
            <div className="products-state">Carregando usuários...</div>
          ) : null}

          {errorMessage ? (
            <div className="products-state products-state--error">
              <p>{errorMessage}</p>

              <div className="pagination-controls">
                <button
                  className="pagination-button"
                  type="button"
                  onClick={handleRetry}
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : null}

          {isEmpty ? (
            <div className="products-state">
              Nenhum usuário encontrado nesta página.
            </div>
          ) : null}

          {!isLoading && !errorMessage
            ? users.map((user) => (
                <article
                  className={`product-row${
                    selectedUser?.id === user.id ? " product-row--active" : ""
                  }`}
                  key={user.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectUser(user)}
                  onKeyDown={(event) => handleRowKeyDown(event, user)}
                >
                  <div className="product-name">{user.name}</div>

                  <div className="product-meta">
                    <div className="product-meta-item">
                      <span className="product-meta-label">Código</span>

                      <span className="product-meta-value">{user.id}</span>
                    </div>

                    <div className="product-meta-item">
                      <span className="product-meta-label">E-mail</span>

                      <span className="product-meta-value">{user.email}</span>
                    </div>

                    <div className="product-meta-item">
                      <span className="product-meta-label">Cargo</span>

                      <span className="product-meta-value">
                        {user.role === "proprietario"
                          ? "Proprietário"
                          : user.role === "funcionario"
                            ? "Funcionário"
                            : user.role}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            : null}
        </div>

        <footer className="products-footer">
          <div className="pagination-status">
            Total de itens: {pagination.total}
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-button"
              type="button"
              onClick={handlePreviousPage}
              disabled={pagination.page <= 1 || isLoading}
            >
              Página anterior
            </button>

            <span className="pagination-current">{pagination.page}</span>

            <button
              className="pagination-button"
              type="button"
              onClick={handleNextPage}
              disabled={pagination.page >= pagination.totalPages || isLoading}
            >
              Próxima página
            </button>
          </div>
        </footer>

        {selectedUser ? (
          <div
            className="product-actions-overlay"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="product-actions-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="product-actions-info">
                <span className="product-actions-title">
                  {selectedUser.name}
                </span>

                <span className="product-actions-meta">
                  Código {selectedUser.id}
                </span>
              </div>

              <div className="product-actions-buttons">
                <Link
                  className="action-button"
                  to={editPath}
                  onClick={() => setSelectedUser(null)}
                >
                  Editar
                </Link>

                <button
                  className="action-button action-button--ghost"
                  type="button"
                  onClick={() => setSelectedUser(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
