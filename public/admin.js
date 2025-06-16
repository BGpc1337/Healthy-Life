const firebaseConfig = {
  apiKey: "AIzaSyDWCZSN1Eo-B7RxZgPQ0qkG_T6V2e75PZo",
  authDomain: "healthy-life-64ca0.firebaseapp.com",
  projectId: "healthy-life-64ca0",
  storageBucket: "healthy-life-64ca0.appspot.com",
  messagingSenderId: "968139723167",
  appId: "1:968139723167:web:dd2c7a131004b5a1e12daa",
  measurementId: "G-CPW7VW8TLM"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function carregarConteudo(acao) {
  const conteudo = document.getElementById("conteudo");

  if (acao === "dashboard") {
    conteudo.innerHTML = `
      <h2 class="dashboard-title">Dashboard</h2>
      <div class="dashboard-cards">
        <div class="card card-usuarios">
          <h3>Usuários cadastrados</h3>
          <p id="parceiroCount">Carregando...</p>
        </div>
        <div class="card card-doacoes">
          <h3>Doações</h3>
          <p id="doacoesCount">Carregando...</p>
        </div>
        <div class="card card-descartes">
          <h3>Descartes</h3>
          <p id="descartesCount">Carregando...</p>
        </div>
      </div>
    `;
    atualizarContadoresDashboard();

    function atualizarContadoresDashboard() {
      db.collection("parceiro").get().then(snapshot => {
        document.getElementById("parceiroCount").innerText = snapshot.size;
      }).catch(() => {
        document.getElementById("usuariosCount").innerText = "Erro";
      });

      db.collection("doacoes").get().then(snapshot => {
        document.getElementById("doacoesCount").innerText = snapshot.size;
      }).catch(() => {
        document.getElementById("doacoesCount").innerText = "Erro";
      });

      db.collection("descartes").get().then(snapshot => {
        document.getElementById("descartesCount").innerText = snapshot.size;
      }).catch(() => {
        document.getElementById("descartesCount").innerText = "Erro";
      });
    }

  } else if (acao === "criar") {
    conteudo.innerHTML = `
   <div class="form-container">
  <h2 class="form-title">Criar Usuário</h2>
  <form onsubmit="event.preventDefault(); criarUsuario()">
    <input type="text" id="nome" placeholder="Nome Completo" required />
    <input type="email" id="email" placeholder="E-mail" required />
    <input type="password" id="senha" placeholder="Senha" required />
    <input type="text" id="CH" placeholder="Código de Habilitação" required />
    <label>Celular</label><input type="tel" id="celular" placeholder="(00) 00000-0000" />
    <label>Cep</label><input type="text" id="cep" placeholder="00000-000" />
    <label>Bairro</label><input type="text" id="bairro" placeholder="nome do bairro" />
    <label>Rua</label><input type="text" id="rua" placeholder="nome da rua" />
    <label>Número</label><input type="text" id="numero" placeholder="número" />
    <label>Cidade</label><input type="text" id="cidade" placeholder="Cidade" />
    <label>Estado</label><input type="text" id="estado" placeholder="Estado" />
    Usuário
    <select id="tipo" required>
      <option value="">Selecione o tipo de usuário</option>
      <option value="parceiro">Parceiro</option>
      <option value="admin">Administrador</option>
    </select>
    <button type="submit">Criar</button>
  </form>
</div>

    `;
    adicionarPreenchimentoCEP();

  } else if (acao === "listar") {
    conteudo.innerHTML = `
      <h2>Remover Usuários</h2>
      <div id="listaUsuarios" class="lista-usuarios lista-colunas"></div>
      <button onclick="removerUsuariosSelecionados()">Remover Selecionados</button>
    `;
    carregarUsuariosParaRemocao();

  } else if (acao === "atualizar") {
    conteudo.innerHTML = `
      <h2>Atualizar Usuário</h2>
      <form onsubmit="event.preventDefault(); atualizarUsuario()">
        <input type="email" id="emailBusca" placeholder="E-mail do usuário" required />
        <input type="text" id="Nome" placeholder="Nome" />
        <input type="text" id="CH" placeholder="Código de Habilitação" />
        <label>Celular</label><input type="tel" id="celular" placeholder="(00) 00000-0000">
        <label>Email</label><input type="email" id="emailNovo" placeholder="seu@email.com">
        <label>Cep</label><input type="text" id="cep" placeholder="00000-000">
        <label>Bairro</label><input type="text" id="bairro" placeholder="nome do bairro">
        <label>Rua</label><input type="text" id="rua" placeholder="nome da rua">
        <label>Número</label><input type="text" id="numero" placeholder="número">
        <label>Cidade</label><input type="text" id="cidade" placeholder="Cidade">
        <label>Estado</label><input type="text" id="estado" placeholder="Estado">
        Usuário
        <select id="perfis">
          <option value="">Selecione o tipo de usuário</option>
          <option value="parceiro">Parceiro</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Atualizar</button>
      </form>
    `;
    adicionarPreenchimentoCEP();

  } else if (acao === "doacao" || acao === "descarte") {
    const titulo = acao === "doacao" ? "Doações" : "Descartes";
    conteudo.innerHTML = `
      <h2>Registro de ${titulo}</h2>
      <div id="listaRegistros" class="lista-registros"></div>
    `;
    listarRegistros(acao);
  }
}

function adicionarPreenchimentoCEP() {
  const cepInput = document.querySelector('#cep');
  const bairroInput = document.querySelector('#bairro');
  const ruaInput = document.querySelector('#rua');
  const cidadeInput = document.querySelector('#cidade');
  const estadoInput = document.querySelector('#estado');

  if (!cepInput) return;

  cepInput.addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      alert('CEP inválido. Deve conter 8 dígitos.');
      return;
    }
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          alert('CEP não encontrado.');
          return;
        }
        bairroInput.value = data.bairro || '';
        ruaInput.value = data.logradouro || '';
        cidadeInput.value = data.localidade || '';
        estadoInput.value = data.uf || '';
      })
      .catch(() => alert('Erro ao buscar CEP.'));
  });
}

function listarRegistros(tipo) {
  const lista = document.getElementById("listaRegistros");

  const nomeColecao = tipo === "doacao" ? "doacoes" : "descartes";

  db.collection(nomeColecao).orderBy("timestamp", "desc").get()
    .then(snapshot => {
      if (snapshot.empty) {
        lista.innerHTML = `<p class="nenhum-registro">Nenhum registro de ${tipo === "doacao" ? "doações" : "descartes"} encontrado.</p>`;
        return;
      }
      let html = "<ul class='lista-itens'>";
      snapshot.forEach(doc => {
        const registro = doc.data();
        const dataRegistro = registro.timestamp?.toDate().toLocaleString() || "Sem data";
        html += `
          <li class="registro-item">
            <strong>Medicamento:</strong> ${registro.nome || "Não informado"}<br/>
            <strong>Quantidade:</strong> ${registro.quantidade || "Não informado"}<br/>
            <strong>Data de ${tipo === "doacao" ? "Doação" : "Descarte"}:</strong> ${dataRegistro}<br/>
            <strong>Validade:</strong> ${registro.validade || "Não informado"}<br/>
            <strong>${tipo === "doacao" ? "Observações" : "Observações"}:</strong> ${registro.observacoes || "Nenhuma observação"}<br/>
            <hr/>
            <strong>Dados Parceiro(a):</strong><br/>
            Nome: <strong> ${registro.nomeParceiro || "Não informado"}</strong><br/>
            Celular: ${registro.celular || "Não informado"}<br/>
            E-mail: ${registro.email || "Não informado"}<br/>
            Endereço: ${registro.endereco || "Não informado"}<br/>
          </li>
        `;
      });
      html += "</ul>";
      lista.innerHTML = html;
    })
    .catch(err => {
      lista.innerHTML = `<p class="erro-registro">Erro ao carregar registros: ${err.message}</p>`;
    });
}

function criarUsuario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const ch = document.getElementById("CH").value;
  const celular = document.getElementById("celular").value;
  const cep = document.getElementById("cep").value;
  const bairro = document.getElementById("bairro").value;
  const rua = document.getElementById("rua").value;
  const numero = document.getElementById("numero").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;
  const tipo = document.getElementById("tipo").value;

  if (!tipo) {
    alert("Selecione o tipo de usuário.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, senha)
    .then(cred => {
      const userData = {
        nome,
        email,
        celular,
        ch,
        tipo,
        endereco: `${rua}, ${numero}, ${bairro}, ${cidade} - ${estado}, CEP: ${cep}`,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      };

      const colecao = tipo === "parceiro" ? "parceiro" : "admin";
      return db.collection(colecao).doc(cred.user.uid).set(userData);
    })
    .then(() => {
      alert("Usuário criado com sucesso! Código de Habilitação e Senha enviados por email.");
      document.querySelector("form").reset();
    })
    .catch(error => {
      console.error("Erro ao criar usuário:", error);
      alert("Erro ao criar usuário: " + error.message);
    });
}


function carregarUsuariosParaRemocao() {
  const lista = document.getElementById("listaUsuarios");
  lista.innerHTML = "Carregando...";

  const colecoes = ["parceiro", "admin"];
  let html = "<form id='formUsuarios'><ul class='lista-itens lista-colunas'>";
  let promises = [];

  colecoes.forEach(colecao => {
    const promise = db.collection(colecao).get().then(snapshot => {
      snapshot.forEach(doc => {
        const usuario = doc.data();
        const uid = doc.id;
        html += `
          <li class="registro-item">
            <input type="checkbox" class="usuario-checkbox" value="${uid}" data-colecao="${colecao}">
            <strong>Nome:</strong> ${usuario.nome || "Sem nome"} |
            <strong>CH:</strong> ${usuario.ch || "Sem CH"} |
            <strong>Email:</strong> ${usuario.email || "Sem email"} |
            <strong>Tipo:</strong> ${colecao}
          </li>
        `;
      });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(() => {
    html += "</ul></form>";
    lista.innerHTML = html;
  }).catch(error => {
    console.error("Erro ao carregar usuários:", error);
    lista.innerHTML = "<p>Erro ao carregar usuários.</p>";
  });
}

function removerUsuariosSelecionados() {
  const checkboxes = document.querySelectorAll('.usuario-checkbox:checked');

  if (checkboxes.length === 0) {
    alert("Selecione pelo menos um usuário para remover.");
    return;
  }

  const confirmacao = confirm(`Tem certeza que deseja remover ${checkboxes.length} usuário(s)?`);
  if (!confirmacao) return;

  let erros = [];
  let promises = [];

  checkboxes.forEach(checkbox => {
    const uid = checkbox.value;
    const colecao = checkbox.getAttribute("data-colecao");

    const promise = db.collection(colecao).doc(uid).delete()
      .catch(error => {
        console.error(`Erro ao remover usuário ${uid}:`, error);
        erros.push(uid);
      });

    promises.push(promise);
  });

  Promise.all(promises).then(() => {
    if (erros.length > 0) {
      alert(`Alguns usuários não puderam ser removidos:\n${erros.join(", ")}`);
    } else {
      alert("Usuário(s) removido(s) com sucesso.");
    }
    carregarUsuariosParaRemocao(); 
  });
}

function sair() {{
  Swal.fire({
    title: 'Tem certeza que deseja sair?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, sair',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "login.html";
    }
  });
}
};
