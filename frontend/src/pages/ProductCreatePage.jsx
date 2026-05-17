import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { createProduct } from "../services/productService";

const INITIAL_FORM = {
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  expirationDate: ""
};

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = categories.find(
    (category) => String(category.id) === String(formState.categoryId)
  );

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryError("");

    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setCategories([]);
      setCategoryError("Não foi possível carregar as categorias.");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value
    }));
  };

  const handleOpenModal = () => {
    setIsCategoryModalOpen(true);

    if (!isLoadingCategories && categories.length === 0) {
      loadCategories();
    }
  };

  const handleSelectCategory = (category) => {
    setFormState((currentState) => ({
      ...currentState,
      categoryId: String(category.id)
    }));
    setIsCategoryModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const name = formState.name.trim();
    if (!name) {
      setErrorMessage("Informe o nome do produto.");
      return;
    }

    if (!formState.categoryId) {
      setErrorMessage("Selecione uma categoria.");
      return;
    }

    if (formState.price === "") {
      setErrorMessage("Informe o preço do produto.");
      return;
    }

    if (formState.stock === "") {
      setErrorMessage("Informe a quantidade em estoque.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct({
        name,
        categoryId: formState.categoryId,
        price: Number(formState.price),
        stock: Number(formState.stock),
        expirationDate: formState.expirationDate || null
      });
      navigate("/products");
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível criar o produto: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível criar o produto.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="product-create-page">
      <div className="product-create-card">
        <header className="product-create-header">
          <h1 className="product-create-title">Novo produto</h1>
          <p className="product-create-subtitle">
            Cadastre um novo item para o estoque.
          </p>
        </header>

        <form className="product-create-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span className="form-label">Nome</span>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Nome do produto"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-field">
            <span className="form-label">Categoria</span>
            <div className="category-selector">
              <input
                className="form-input"
                type="text"
                placeholder="Selecione uma categoria"
                value={selectedCategory?.name || ""}
                readOnly
              />
              <button
                className="category-button"
                type="button"
                onClick={handleOpenModal}
              >
                Escolher
              </button>
            </div>
          </div>

          <label className="form-field">
            <span className="form-label">Preço</span>
            <input
              className="form-input"
              type="number"
              name="price"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={formState.price}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span className="form-label">Quantidade em estoque</span>
            <input
              className="form-input"
              type="number"
              name="stock"
              min="0"
              step="1"
              placeholder="0"
              value={formState.stock}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span className="form-label">Vencimento</span>
            <input
              className="form-input"
              type="date"
              name="expirationDate"
              value={formState.expirationDate}
              onChange={handleChange}
            />
          </label>

          {errorMessage ? (
            <div className="form-error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => navigate("/products")}>
              Cancelar
            </button>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar produto"}
            </button>
          </div>
        </form>
      </div>

      {isCategoryModalOpen ? (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Selecionar categoria"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Categorias</h2>
              <button
                className="modal-close"
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Fechar
              </button>
            </div>
            <div className="modal-body">
              {isLoadingCategories ? (
                <div className="modal-state">Carregando categorias...</div>
              ) : null}

              {categoryError ? (
                <div className="modal-state modal-state--error">
                  <p>{categoryError}</p>
                  <button className="modal-select" type="button" onClick={loadCategories}>
                    Recarregar
                  </button>
                </div>
              ) : null}

              {!isLoadingCategories && !categoryError ? (
                categories.length > 0 ? (
                  <div className="modal-list">
                    {categories.map((category) => (
                      <div className="modal-item" key={category.id}>
                        <span>{category.name}</span>
                        <button
                          className="modal-select"
                          type="button"
                          onClick={() => handleSelectCategory(category)}
                        >
                          Selecionar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="modal-state">Nenhuma categoria encontrada.</div>
                )
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
