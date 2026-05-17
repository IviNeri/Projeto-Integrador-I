import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovements } from "../services/movementService";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 15,
  total: 0,
  totalPages: 1
};

const INITIAL_FILTERS = {
  search: "",
  type: ""
};

const MOVEMENT_TYPES = {
  entrada: "Entrada",
  saida: "Saída",
  ajuste: "Ajuste"
};

const MOVEMENT_TYPE_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "ajuste", label: "Ajuste" }
];

export default function MovementsPage() {
  const [movements, setMovements] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
    []
  );

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return "-";
      }

      return dateFormatter.format(value);
    }

    try {
      const dateValue = new Date(value);
      if (Number.isNaN(dateValue.getTime())) {
        return "-";
      }

      return dateFormatter.format(dateValue);
    } catch {
      return "-";
    }
  };

  const loadMovements = async (page, filterParams) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchMovements({
        page,
        type: filterParams.type,
        search: filterParams.search
      });
      setMovements(data?.data || []);
      const totalPages = Math.max(
        Number(data?.pagination?.totalPages) || 1,
        1
      );

      setPagination({
        page: data?.pagination?.page ?? page,
        limit: data?.pagination?.limit ?? DEFAULT_PAGINATION.limit,
        total: data?.pagination?.total ?? 0,
        totalPages
      });
      return data;
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível carregar as movimentações: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível carregar as movimentações.");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovements(pagination.page, appliedFilters);
  }, [pagination.page, appliedFilters]);

  const handleNextPage = () => {
    setPagination((current) => ({
      ...current,
      page: Math.min(current.page + 1, current.totalPages || 1)
    }));
  };

  const handlePreviousPage = () => {
    setPagination((current) => ({
      ...current,
      page: Math.max(current.page - 1, 1)
    }));
  };

  const handleRetry = () => {
    loadMovements(pagination.page, appliedFilters);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value
    }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    setPagination((current) => ({
      ...current,
      page: 1
    }));
    setAppliedFilters(filters);
    setIsFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setPagination((current) => ({
      ...current,
      page: 1
    }));
    setIsFiltersOpen(false);
  };

  const isEmpty = !isLoading && !errorMessage && movements.length === 0;
  const activeFilterCount = Object.values(appliedFilters).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;

  const getMovementBadgeClass = (type) => {
    const baseClass = "movement-badge";
    if (type === "entrada") return `${baseClass} movement-badge--entrada`;
    if (type === "saida") return `${baseClass} movement-badge--saida`;
    if (type === "ajuste") return `${baseClass} movement-badge--ajuste`;
    return baseClass;
  };

  return (
    <section className="movements-page">
      <div className="movements-card">
        <header className="movements-header">
          <div>
            <h1 className="movements-title">Movimentações</h1>
            <p className="movements-subtitle">
              Acompanhe todas as entradas, saídas e ajustes de estoque.
            </p>
          </div>
          <div className="movements-header__actions">
            <Link className="movements-add-button" to="/movements/new">
              Nova movimentação
            </Link>
            <div className="pagination-status">
              {pagination.page} de {pagination.totalPages} · {pagination.total} itens
            </div>
          </div>
        </header>

        <div className="movements-filter-toggle">
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
          <form className="movements-filters" onSubmit={handleApplyFilters}>
            <label className="filter-field">
              <span className="filter-label">Busca por produto</span>
              <input
                className="filter-input"
                type="search"
                name="search"
                placeholder="Buscar por nome do produto"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </label>
            <label className="filter-field">
              <span className="filter-label">Tipo de movimentação</span>
              <select
                className="filter-input"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                {MOVEMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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

        <div className="movements-table">
          {isLoading ? (
            <div className="movements-state">Carregando movimentações...</div>
          ) : null}

          {errorMessage ? (
            <div className="movements-state movements-state--error">
              <p>{errorMessage}</p>
              <div className="pagination-controls">
                <button className="pagination-button" type="button" onClick={handleRetry}>
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : null}

          {isEmpty ? (
            <div className="movements-state">
              Nenhuma movimentação encontrada nesta página.
            </div>
          ) : null}

          {!isLoading && !errorMessage
            ? movements.map((movement) => (
                <article
                  className="movement-row"
                  key={movement.id}
                >
                  <div className="movement-row__content">
                    <div className="movement-info">
                      <div className="movement-info__main">
                        <span className="movement-product">{movement.product?.name || "-"}</span>
                        <span className={getMovementBadgeClass(movement.type)}>
                          {MOVEMENT_TYPES[movement.type] || movement.type}
                        </span>
                      </div>
                      <div className="movement-info__secondary">
                        <span className="movement-quantity">
                          Quantidade: {movement.quantity}
                        </span>
                        <span className="movement-user">
                          Por: {movement.user?.name || "-"}
                        </span>
                        <span className="movement-date">
                          {formatDate(movement.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            : null}
        </div>

        <footer className="movements-footer">
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
      </div>
    </section>
  );
}
