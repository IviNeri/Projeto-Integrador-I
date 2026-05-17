import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await login(formState);
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
      navigate("/home");
    } catch (error) {
      const apiError = error?.response?.data?.error;
      if (apiError) {
        setErrorMessage(`Não foi possível entrar: ${apiError}.`);
      } else if (error?.message) {
        setErrorMessage(`Não foi possível conectar. ${error.message}.`);
      } else {
        setErrorMessage("Não foi possível conectar. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <header className="login-card__header">
          <p className="login-eyebrow">Acesso restrito</p>
          <h1 className="login-title">Entrar no EstoqueFacil</h1>
          <p className="login-subtitle">
            Use seu email e senha para acessar o painel.
          </p>
        </header>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span className="form-label">Email</span>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="email@exemplo.com"
              autoComplete="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span className="form-label">Senha</span>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Sua senha"
              autoComplete="current-password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </label>
          {errorMessage ? (
            <div className="login-error" role="alert">
              {errorMessage}
            </div>
          ) : null}
          <div className="login-actions">
            <button className="login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
