import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../services/categoryService";

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createCategory({ name: trimmedName });
      navigate("/categories");
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível criar a categoria: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível criar a categoria.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="product-create-page">
      <div className="product-create-card">
        <header className="product-create-header">
          <h1 className="product-create-title">Nova categoria</h1>
          <p className="product-create-subtitle">
            Cadastre uma nova categoria para organizar o estoque.
          </p>
        </header>

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
              {isSubmitting ? "Salvando..." : "Salvar categoria"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
