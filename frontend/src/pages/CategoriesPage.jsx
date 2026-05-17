import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCategory, fetchCategories } from "../services/categoryService";

const PAGE_SIZE = 15;

const INITIAL_FILTERS = {
  search: ""
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadCategories = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível carregar as categorias: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível carregar as categorias.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const search = appliedFilters.search.trim().toLowerCase();
    if (!search) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(search)
    );
  }, [categories, appliedFilters]);

  const total = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [page, currentPage]);

  const handleNextPage = () => {
    setPage((current) => Math.min(current + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(current - 1, 1));
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
    setAppliedFilters(filters);
    setPage(1);
    setIsFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setPage(1);
    setIsFiltersOpen(false);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleRowKeyDown = (event, category) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectCategory(category);
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteError("");
    setDeleteTarget(selectedCategory);
    setSelectedCategory(null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteCategory(deleteTarget.id);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      await loadCategories();
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setDeleteError(`Não foi possível excluir: ${apiError}.`);
      } else {
        setDeleteError("Não foi possível excluir a categoria.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const isEmpty = !isLoading && !errorMessage && pagedCategories.length === 0;
  const activeFilterCount = appliedFilters.search.trim() ? 1 : 0;

  const editPath = selectedCategory
    ? `/categories/${selectedCategory.id}/edit`
    : "/categories";

  return (
    <section className="products-page">
      <div className="products-card">
        <header className="products-header">
          <div>
            <h1 className="products-title">Categorias</h1>
            <p className="products-subtitle">
              Gerencie as categorias cadastradas.
            </p>
          </div>
          <div className="products-header__actions">
            <Link className="products-add-button" to="/categories/new">
              Nova categoria
            </Link>
            <div className="pagination-status">
              {currentPage} de {totalPages} · {total} itens
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
                placeholder="Buscar por nome"
                value={filters.search}
                onChange={handleFilterChange}
              />
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
            <div className="products-state">Carregando categorias...</div>
          ) : null}

          {errorMessage ? (
            <div className="products-state products-state--error">
              <p>{errorMessage}</p>
              <div className="pagination-controls">
                <button className="pagination-button" type="button" onClick={loadCategories}>
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : null}

          {isEmpty ? (
            <div className="products-state">
              Nenhuma categoria encontrada nesta página.
            </div>
          ) : null}

          {!isLoading && !errorMessage
            ? pagedCategories.map((category) => (
                <article
                  className={`product-row${
                    selectedCategory?.id === category.id
                      ? " product-row--active"
                      : ""
                  }`}
                  key={category.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectCategory(category)}
                  onKeyDown={(event) => handleRowKeyDown(event, category)}
                >
                  <div className="product-name">{category.name}</div>
                  <div className="category-meta">
                    <span className="category-meta-label">Código</span>
                    <span className="category-meta-value">{category.id}</span>
                  </div>
                </article>
              ))
            : null}
        </div>

        <footer className="products-footer">
          <div className="pagination-status">Total de itens: {total}</div>
          <div className="pagination-controls">
            <button
              className="pagination-button"
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1 || isLoading}
            >
              Página anterior
            </button>
            <span className="pagination-current">{currentPage}</span>
            <button
              className="pagination-button"
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isLoading}
            >
              Próxima página
            </button>
          </div>
        </footer>

        {selectedCategory ? (
          <div
            className="product-actions-overlay"
            onClick={() => setSelectedCategory(null)}
          >
            <div
              className="product-actions-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="product-actions-info">
                <span className="product-actions-title">
                  {selectedCategory.name}
                </span>
                <span className="product-actions-meta">
                  Código {selectedCategory.id}
                </span>
              </div>
              <div className="product-actions-buttons">
                <Link
                  className="action-button"
                  to={editPath}
                  onClick={() => setSelectedCategory(null)}
                >
                  Editar
                </Link>
                <button
                  className="action-button action-button--danger"
                  type="button"
                  onClick={handleOpenDeleteModal}
                >
                  Excluir
                </button>
                <button
                  className="action-button action-button--ghost"
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isDeleteModalOpen ? (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
        >
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Excluir categoria</h2>
              <button
                className="modal-close"
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
              >
                Fechar
              </button>
            </div>
            <div className="modal-body">
              <p>
                Tem certeza que deseja excluir a categoria
                <strong> {deleteTarget?.name}</strong>?
              </p>

              {deleteError ? (
                <div className="modal-state modal-state--error">{deleteError}</div>
              ) : null}

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  className="primary-button"
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
