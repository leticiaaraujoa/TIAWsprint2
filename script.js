const usuarioId = 1;
const apiUrl = 'http://localhost:3000'; // URL do json-server

async function carregarDados() {
  try {
    // Busca o usuário
    const usuario = await fetch(`${apiUrl}/usuarios/${usuarioId}`).then(res => res.json());
    document.getElementById("nome-usuario").textContent = usuario.nome;

    // Busca os comentários do usuário
    const comentarios = await fetch(`${apiUrl}/comentarios?usuarioId=${usuarioId}`).then(res => res.json());
    const container = document.getElementById("lista-comentarios");
    container.innerHTML = "";

    for (const comentario of comentarios) {
      const noticia = await fetch(`${apiUrl}/noticias/${comentario.noticiaId}`).then(res => res.json());

      const div = document.createElement("div");
      div.className = "comentario";
      div.setAttribute("data-id", comentario.id);

      // ✅ Usando crases corretamente para interpolar
      div.innerHTML = `
        <h3>${noticia.titulo}</h3>
        <p class="texto">${comentario.texto}</p>
        <p class="data">${new Date(comentario.data_hora).toLocaleString("pt-BR")}</p>
        <button class="btn-editar">Editar</button>
        <button class="btn-excluir">Excluir</button>
      `;

      container.appendChild(div);
    }

    adicionarListeners();
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    document.getElementById("lista-comentarios").innerHTML = "<p>Erro ao carregar comentários.</p>";
  }
}

function adicionarListeners() {
  // Botão Editar
  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const div = e.target.closest(".comentario");
      const id = div.getAttribute("data-id");
      const p = div.querySelector(".texto");

      const novoTexto = prompt("Editar comentário:", p.textContent);
      if (novoTexto && novoTexto.trim() !== "") {
        await fetch(`${apiUrl}/comentarios/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ texto: novoTexto })
        });
        p.textContent = novoTexto;
      }
    });
  });

  // Botão Excluir
  document.querySelectorAll(".btn-excluir").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const div = e.target.closest(".comentario");
      const id = div.getAttribute("data-id");

      const confirmar = confirm("Tem certeza que deseja excluir este comentário?");
      if (confirmar) {
        await fetch(`${apiUrl}/comentarios/${id}`, {
          method: "DELETE"
        });
        div.remove();
      }
    });
  });
}

carregarDados();
