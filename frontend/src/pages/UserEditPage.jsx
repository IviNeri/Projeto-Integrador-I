import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUser } from "../services/userService";

const INITIAL_FORM = {
  name: "",
  email: "",
  role: "",
};

export default function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formState, setFormState] = useState(INITIAL_FORM);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUser = async () => {
    setIsLoadingUser(true);
    setErrorMessage("");

    try {
      const data = await fetchUserById(id);

      setFormState({
        name: data?.name || "",
        email: data?.email || "",
        role: data?.role || "",
      });
    } catch (error) {
      const apiError = error?.response?.data?.error;

      if (apiError) {
        setErrorMessage(`Não foi possível carregar o usuário: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível carregar o usuário.");
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    const name = formState.name.trim();
    const email = formState.email.trim();

    if (!name) {
      setErrorMessage("Informe o nome.");
      return;
    }

    if (!email) {
      setErrorMessage("Informe o e-mail.");
      return;
    }

    if (!formState.role) {
      setErrorMessage("Selecione o cargo.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUser(id, {
        name,
        email,
        role: formState.role,
      });

      navigate("/users");
    } catch (error) {
      const apiError = error?.response?.data?.error;

      if (apiError) {
        setErrorMessage(`Não foi possível atualizar o usuário: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível atualizar o usuário.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="product-create-page">
      <div className="product-create-card">
        <header className="product-create-header">
          <h1 className="product-create-title">Editar usuário</h1>
          <p className="product-create-subtitle">
            Atualize os dados do usuário selecionado.
          </p>
        </header>

        {isLoadingUser ? (
          <div className="modal-state">Carregando dados do usuário...</div>
        ) : null}

        {!isLoadingUser ? (
          <form className="product-create-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span className="form-label">Nome</span>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Nome"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field">
              <span className="form-label">E-mail</span>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="email@teste.com"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field">
              <span className="form-label">Cargo</span>

              <select
                className="form-input"
                name="role"
                value={formState.role}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="proprietario">Proprietário</option>
                <option value="funcionario">Funcionário</option>
              </select>
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
                onClick={() => navigate("/users")}
              >
                Cancelar
              </button>

              <button
                className="primary-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
