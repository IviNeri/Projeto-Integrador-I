import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";

const INITIAL_FORM = {
  name: "",
  email: "",
  cpf: "",
  password: "",
  role: "",
};

export default function UserCreatePage() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState(INITIAL_FORM);

  const [errorMessage, setErrorMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: name === "cpf" ? formatCpf(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    const name = formState.name.trim();

    const email = formState.email.trim();

    const cpf = formState.cpf.replace(/\D/g, "");

    const password = formState.password.trim();

    if (!name) {
      setErrorMessage("Informe o nome.");
      return;
    }

    if (!email) {
      setErrorMessage("Informe o e-mail.");
      return;
    }

    if (!cpf) {
      setErrorMessage("Informe o CPF.");
      return;
    }

    if (cpf.replace(/\D/g, "").length !== 11) {
      setErrorMessage("Informe um CPF válido.");
      return;
    }

    if (!password) {
      setErrorMessage("Informe a senha.");
      return;
    }

    if (!formState.role) {
      setErrorMessage("Selecione o cargo.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({
        name,
        email,
        cpf,
        password,
        role: formState.role,
      });

      navigate("/users");
    } catch (error) {
      const apiError = error?.response?.data?.error;

      if (apiError) {
        setErrorMessage(`Não foi possível criar o usuário: ${apiError}.`);
      } else {
        setErrorMessage("Não foi possível criar o usuário.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="product-create-page">
      <div className="product-create-card">
        <header className="product-create-header">
          <h1 className="product-create-title">Novo usuário</h1>

          <p className="product-create-subtitle">
            Cadastre um novo usuário no sistema.
          </p>
        </header>

        <form className="product-create-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span className="form-label">Nome</span>

            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Nome completo"
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
            <span className="form-label">CPF</span>

            <input
              className="form-input"
              type="text"
              name="cpf"
              placeholder="000.000.000-00"
              value={formState.cpf}
              onChange={handleChange}
              maxLength={14}
              required
            />
          </label>

          <label className="form-field">
            <span className="form-label">Senha</span>

            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Digite a senha"
              value={formState.password}
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
              required
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
              {isSubmitting ? "Salvando..." : "Salvar usuário"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
