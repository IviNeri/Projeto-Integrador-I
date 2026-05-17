import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoryById, updateCategory } from "../services/categoryService";

export default function CategoryEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);

  const loadCategory = async () => {
    setIsLoadingCategory(true);
    setErrorMessage("");

    try {
      const data = await fetchCategoryById(id);
      setName(data?.name || "");
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível carregar a categoria: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível carregar a categoria.");
      }
    } finally {
      setIsLoadingCategory(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Informe o nome da categoria.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateCategory(id, { name: trimmedName });
      navigate("/categories");
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível atualizar a categoria: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível atualizar a categoria.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="product-create-page">
      <div className="product-create-card">
        <header className="product-create-header">
          <h1 className="product-create-title">Editar categoria</h1>
          <p className="product-create-subtitle">
            Atualize o nome da categoria selecionada.
          </p>
        </header>

        {isLoadingCategory ? (
          <div className="modal-state">Carregando dados da categoria...</div>
        ) : null}

        {!isLoadingCategory ? (
          <form className="product-create-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span className="form-label">Nome</span>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Nome da categoria"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            {errorMessage ? (
              <div className="form-error" role="alert">
                {errorMessage}
              </div>
            ) : null}

            <div className="form-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => navigate("/categories")}
              >
                Cancelar
              </button>
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
