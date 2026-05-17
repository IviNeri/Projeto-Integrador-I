function HomePage({ user }) {
  const name = user?.name || "Usuário";

  return (
    <section className="home-page">
      <div className="home-card">
        <p className="home-eyebrow">Login realizado</p>
        <h1 className="home-title">Bem-vindo, {name}.</h1>
        <p className="home-subtitle">
          Você já está autenticado. Navegue pelo painel e gerencie o estoque
          com segurança.
        </p>
      </div>
    </section>
  );
}

export default HomePage;
