import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { deleteProduct, fetchProducts } from "../services/productService";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 15,
  total: 0,
  totalPages: 1
};

const INITIAL_FILTERS = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  expirationFrom: "",
  expirationTo: ""
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }),
    []
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }),
    []
  );

  const formatPrice = (value) => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      return "-";
    }
    return priceFormatter.format(numberValue);
  };

  const formatExpiration = (value) => {
    if (!value) {
      return "Sem vencimento";
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return "Sem vencimento";
      }

      return dateFormatter.format(value);
    }

    const datePart = String(value).split("T")[0];
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) {
      return "Sem vencimento";
    }

    const dateValue = new Date(Number(year), Number(month) - 1, Number(day));
    if (Number.isNaN(dateValue.getTime())) {
      return "Sem vencimento";
    }

    return dateFormatter.format(dateValue);
  };

  const loadProducts = async (page, filterParams) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchProducts({
        page,
        search: filterParams.search,
        categoryId: filterParams.categoryId,
        minPrice: filterParams.minPrice,
        maxPrice: filterParams.maxPrice,
        expirationFrom: filterParams.expirationFrom,
        expirationTo: filterParams.expirationTo
      });
      setProducts(data?.data || []);
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
        setErrorMessage(`Não foi possível carregar os produtos: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível carregar os produtos.");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(pagination.page, appliedFilters);
  }, [pagination.page, appliedFilters]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

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
    loadProducts(pagination.page, appliedFilters);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleRowKeyDown = (event, product) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectProduct(product);
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteError("");
    setDeleteTarget(selectedProduct);
    setSelectedProduct(null);
    setIsDeleteModalOpen(true);
  };

  const editPath = selectedProduct
    ? `/products/${selectedProduct.id}/edit`
    : "/products";

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteProduct(deleteTarget.id);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      await loadProducts(pagination.page, appliedFilters);
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setDeleteError(`Não foi possível excluir: ${apiError}.`);
      } else {
        setDeleteError("Não foi possível excluir o produto.");
      }
    } finally {
      setIsDeleting(false);
    }
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

  const isEmpty = !isLoading && !errorMessage && products.length === 0;
  const activeFilterCount = Object.values(appliedFilters).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;

  return (
    <section className="products-page">
      <div className="products-card">
        <header className="products-header">
          <div>
            <h1 className="products-title">Produtos</h1>
            <p className="products-subtitle">
              Confira os itens cadastrados e acompanhe os detalhes principais.
            </p>
          </div>
          <div className="products-header__actions">
            <Link className="products-add-button" to="/products/new">
              Novo produto
            </Link>
            <div className="pagination-status">
              {pagination.page} de {pagination.totalPages} · {pagination.total} itens
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
            <label className="filter-field">
              <span className="filter-label">Categoria</span>
              <select
                className="filter-input"
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-field">
              <span className="filter-label">Preço mín.</span>
              <input
                className="filter-input"
                type="number"
                name="minPrice"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </label>
            <label className="filter-field">
              <span className="filter-label">Preço máx.</span>
              <input
                className="filter-input"
                type="number"
                name="maxPrice"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </label>
            <label className="filter-field">
              <span className="filter-label">Vencimento de</span>
              <input
                className="filter-input"
                type="date"
                name="expirationFrom"
                value={filters.expirationFrom}
                onChange={handleFilterChange}
              />
            </label>
            <label className="filter-field">
              <span className="filter-label">Vencimento até</span>
              <input
                className="filter-input"
                type="date"
                name="expirationTo"
                value={filters.expirationTo}
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
            <div className="products-state">Carregando produtos...</div>
          ) : null}

          {errorMessage ? (
            <div className="products-state products-state--error">
              <p>{errorMessage}</p>
              <div className="pagination-controls">
                <button className="pagination-button" type="button" onClick={handleRetry}>
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : null}

          {isEmpty ? (
            <div className="products-state">
              Nenhum produto encontrado nesta página.
            </div>
          ) : null}

          {!isLoading && !errorMessage
            ? products.map((product) => (
                <article
                  className={`product-row${
                    selectedProduct?.id === product.id ? " product-row--active" : ""
                  }`}
                  key={product.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectProduct(product)}
                  onKeyDown={(event) => handleRowKeyDown(event, product)}
                >
                  <div className="product-name">{product.name}</div>
                  <div className="product-meta">
                    <div className="product-meta-item">
                      <span className="product-meta-label">Código</span>
                      <span className="product-meta-value">{product.id}</span>
                    </div>
                    <div className="product-meta-item">
                      <span className="product-meta-label">Quantidade</span>
                      <span className="product-meta-value">
                        {product.stock ?? "-"}
                      </span>
                    </div>
                    <div className="product-meta-item">
                      <span className="product-meta-label">Categoria</span>
                      <span className="product-meta-value">
                        {product.category?.name || "Sem categoria"}
                      </span>
                    </div>
                    <div className="product-meta-item">
                      <span className="product-meta-label">Preço</span>
                      <span className="product-meta-value">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="product-meta-item">
                      <span className="product-meta-label">Vencimento</span>
                      <span className="product-meta-value">
                        {formatExpiration(product.expiration_date)}
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

        {selectedProduct ? (
          <div
            className="product-actions-overlay"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="product-actions-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="product-actions-info">
                <span className="product-actions-title">
                  {selectedProduct.name}
                </span>
                <span className="product-actions-meta">
                  Código {selectedProduct.id}
                </span>
              </div>
              <div className="product-actions-buttons">
                <Link
                  className="action-button"
                  to={editPath}
                  onClick={() => setSelectedProduct(null)}
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
                  onClick={() => setSelectedProduct(null)}
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
              <h2 className="modal-title">Excluir produto</h2>
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
                Tem certeza que deseja excluir o produto
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
