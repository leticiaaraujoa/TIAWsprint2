const usuarioId = 1;
const apiUrl = 'http://localhost:3000';

async function carregarDados() {
  try {
    const usuario = await fetch(`${apiUrl}/usuarios/${usuarioId}`).then(res => res.json());
    document.getElementById("nome-usuario").textContent = usuario.nome;

    const comentarios = await fetch(`${apiUrl}/comentarios?usuarioId=${usuarioId}`).then(res => res.json());

    const noticiasPromises = comentarios.map(c => 
      fetch(`${apiUrl}/noticias/${c.noticiaId}`).then(res => res.json())
    );
    const noticias = await Promise.all(noticiasPromises);

    const container = document.getElementById("lista-comentarios");
    container.innerHTML = "";

    comentarios.forEach((comentario, i) => {
      const noticia = noticias[i];
      const div = document.createElement("div");
      div.className = "comentario";
      div.setAttribute("data-id", comentario.id);

      div.innerHTML = `
        <h3>${noticia.titulo}</h3>
        <p class="texto">${comentario.texto}</p>
        <p class="data">${new Date(comentario.data_hora).toLocaleString("pt-BR")}</p>
        <button class="btn-editar">Editar</button>
        <button class="btn-excluir">Excluir</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    document.getElementById("lista-comentarios").innerHTML = "<p>Erro ao carregar comentários.</p>";
  }
}

document.getElementById("lista-comentarios").addEventListener("click", async (e) => {
  const btn = e.target;
  const div = btn.closest(".comentario");
  const id = div?.getAttribute("data-id");

  if (btn.classList.contains("btn-editar")) {
    const p = div.querySelector(".texto");
    const novoTexto = prompt("Editar comentário:", p.textContent);
    if (novoTexto && novoTexto.trim() !== "") {
      await fetch(`${apiUrl}/comentarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: novoTexto })
      });
      p.textContent = novoTexto;
    }
  }

  if (btn.classList.contains("btn-excluir")) {
    const confirmar = confirm("Tem certeza que deseja excluir este comentário?");
    if (confirmar) {
      await fetch(`${apiUrl}/comentarios/${id}`, { method: "DELETE" });
      div.remove();
    }
  }
});

carregarDados();
