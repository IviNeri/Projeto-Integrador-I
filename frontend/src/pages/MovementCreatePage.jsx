import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { createMovement } from "../services/movementService";

const INITIAL_FORM = {
  productId: "",
  type: "entrada",
  quantity: ""
};

const MOVEMENT_TYPES = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "ajuste", label: "Ajuste" }
];

export default function MovementCreatePage() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find(
    (product) => String(product.id) === String(formState.productId)
  );

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    setProductError("");

    try {
      const data = await fetchProducts();
      setProducts(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      setProducts([]);
      setProductError("Não foi possível carregar os produtos.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value
    }));
  };

  const handleOpenModal = () => {
    setIsProductModalOpen(true);

    if (!isLoadingProducts && products.length === 0) {
      loadProducts();
    }
  };

  const handleSelectProduct = (product) => {
    setFormState((currentState) => ({
      ...currentState,
      productId: String(product.id)
    }));
    setIsProductModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!formState.productId) {
      setErrorMessage("Selecione um produto.");
      return;
    }

    if (formState.type === "") {
      setErrorMessage("Selecione o tipo de movimentação.");
      return;
    }

    if (formState.quantity === "") {
      setErrorMessage("Informe a quantidade.");
      return;
    }

    const quantity = Number(formState.quantity);
    if (quantity <= 0) {
      setErrorMessage("A quantidade deve ser maior que zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createMovement({
        productId: formState.productId,
        type: formState.type,
        quantity
      });
      navigate("/movements");
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível criar a movimentação: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível criar a movimentação.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMovementTypeLabel = (type) => {
    const found = MOVEMENT_TYPES.find((t) => t.value === type);
    return found?.label || type;
  };

  const getMovementDescription = (type) => {
    if (type === "entrada") {
      return `${selectedProduct?.name || "Produto"} + ${formState.quantity || 0} unidades`;
    }
    if (type === "saida") {
      return `${selectedProduct?.name || "Produto"} - ${formState.quantity || 0} unidades`;
    }
    if (type === "ajuste") {
      return `${selectedProduct?.name || "Produto"} → ${formState.quantity || 0} unidades`;
    }
    return "";
  };

  return (
    <section className="movement-create-page">
      <div className="movement-create-card">
        <header className="movement-create-header">
          <h1 className="movement-create-title">Nova movimentação</h1>
          <p className="movement-create-subtitle">
            Registre uma entrada, saída ou ajuste de estoque.
          </p>
        </header>

        <form className="movement-create-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <span className="form-label">Produto</span>
            <div className="product-selector">
              <input
                className="form-input"
                type="text"
                placeholder="Selecione um produto"
                value={selectedProduct?.name || ""}
                readOnly
              />
              <button
                className="product-button"
                type="button"
                onClick={handleOpenModal}
              >
                Escolher
              </button>
            </div>
          </div>

          <label className="form-field">
            <span className="form-label">Tipo de movimentação</span>
            <select
              className="form-input"
              name="type"
              value={formState.type}
              onChange={handleChange}
              required
            >
              {MOVEMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span className="form-label">Quantidade</span>
            <input
              className="form-input"
              type="number"
              name="quantity"
              min="1"
              step="1"
              placeholder="0"
              value={formState.quantity}
              onChange={handleChange}
              required
            />
          </label>

          {selectedProduct && formState.quantity ? (
            <div className="movement-preview">
              <span className="preview-label">Resultado:</span>
              <span className="preview-text">
                {getMovementDescription(formState.type)}
              </span>
              {formState.type !== "ajuste" && (
                <span className="preview-result">
                  Novo estoque: {
                    formState.type === "entrada"
                      ? (selectedProduct.stock || 0) + Number(formState.quantity)
                      : (selectedProduct.stock || 0) - Number(formState.quantity)
                  } unidades
                </span>
              )}
              {formState.type === "ajuste" && (
                <span className="preview-result">
                  Estoque anterior: {selectedProduct.stock || 0} unidades
                </span>
              )}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="form-error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => navigate("/movements")}>
              Cancelar
            </button>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Registrar movimentação"}
            </button>
          </div>
        </form>
      </div>

      {isProductModalOpen ? (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Selecionar produto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Produtos</h2>
              <button
                className="modal-close"
                type="button"
                onClick={() => setIsProductModalOpen(false)}
              >
                Fechar
              </button>
            </div>
            <div className="modal-body">
              {isLoadingProducts ? (
                <div className="modal-state">Carregando produtos...</div>
              ) : null}

              {productError ? (
                <div className="modal-state modal-state--error">
                  <p>{productError}</p>
                  <button className="modal-select" type="button" onClick={loadProducts}>
                    Recarregar
                  </button>
                </div>
              ) : null}

              {!isLoadingProducts && !productError ? (
                products.length > 0 ? (
                  <div className="modal-list">
                    {products.map((product) => (
                      <div className="modal-item" key={product.id}>
                        <div className="modal-item-info">
                          <span className="modal-item-name">{product.name} </span>
                          <span className="modal-item-detail">
                            | {product.stock || 0} un.
                          </span>
                        </div>
                        <button
                          className="modal-select"
                          type="button"
                          onClick={() => handleSelectProduct(product)}
                        >
                          Selecionar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="modal-state">Nenhum produto encontrado.</div>
                )
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
