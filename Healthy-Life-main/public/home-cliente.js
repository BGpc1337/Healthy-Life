window.showForm = function(option) {
  const formContainer = document.getElementById('mainForm');
  if (!formContainer) return;

  const usuarioCH = localStorage.getItem("usuarioCH");

  if (!usuarioCH) {
    alert("Usuário não logado. Redirecionando para login...");
    window.location.href = "login.html"; 
  }

  formContainer.style.display = 'block';
  let html = '';

  switch (option) {
    case 'Doar Medicamentos':
      html = `
        <img src="IBAGENS/medicacao.png" id="formLogo" alt="Ícone Doação">
        <h4 id="formTitle"> Formulário de Doação </h4>
        <form id="doacao-form">
          <label>Nome do Medicamento</label>
          <input type="text" name="nome" required>
          <label>Quantidade</label>
          <input type="number" name="quantidade" min="0" max="50" required>
          <label>Validade</label>
          <input type="date" name="validade" required>
          <label>Nome</label>
          <input type="text" name="nomeparceiro" placeholder="Nome do doador(a)"required>
          <label>Celular</label>
          <input type="tel" name="celular" placeholder="(00) 00000-0000">
          <label>Email</label>
          <input type="email" name="email" placeholder="seu@email.com">
          <label>Endereço</label>
          <input type="text" name="endereco" placeholder="Endereço">
          <label>Observações</label>
          <textarea name="observacoes"></textarea>
          <button type="submit">Enviar Doação</button>
        </form>`;
      break;

    case 'Descartar Medicamentos':
      html = `
        <img src="IBAGENS/rem.png" id="formLogo" alt="Ícone Descarte">
        <h4 id="formTitle"> Formulário de Descarte </h4>
        <form id="descarte-form">
          <label>Nome do Medicamento</label>
          <input type="text" name="nome" required>
          <label>Quantidade</label>
          <input type="number" name="quantidade" min="0" max="50" required>
          <label>Observações</label>
          <textarea name="observacoes" required></textarea>
          <label>Validade</label>
          <input type="date" name="validade" required>
          <label>Nome</label>
          <input type="text" name="nomeparceiro" placeholder="Nome do descartador(a)"required>
          <label>Celular</label>
          <input type="tel" name="celular" placeholder="(00) 00000-0000">
          <label>Email</label>
          <input type="email" name="email" placeholder="seu@email.com">
          <label>Endereço</label>
          <input type="text" name="endereco" placeholder="Endereço">
          <button type="submit">Registrar Descarte</button>
        </form>`;
      break;

    case 'Histórico de Doações':
      html = `
        <img src="IBAGENS/historico.png" id="formLogo" alt="Histórico Doações">
        <h4 id="formTitle">Histórico de Doações</h4>
        <ul class="list-group" id="doacoes-list"></ul>`;
      break;

    case 'Histórico de Descartes':
      html = `
        <img src="IBAGENS/historico R.png" id="formLogo" alt="Histórico Descartes">
        <h4 id="formTitle">Histórico de Descartes</h4>
        <ul class="list-group" id="descartes-list"></ul>`;
      break;

    case 'Atualizar Perfil':
      html = `
        <img src="IBAGENS/prancheta.png" id="formLogo" alt="Atualizar Perfil">
        <h4 id="formTitle">Atualizar Perfil</h4>
        <form id="perfil-form">
          <label>Celular</label>
          <input type="tel" name="celular" placeholder="(00) 00000-0000">
          <label>Email</label>
          <input type="email" name="email" placeholder="seu@email.com">
          <label>CEP</label>
          <input type="text" name="cep" placeholder="00000-000">
          <label>Bairro</label>
          <input type="text" name="bairro" placeholder="nome do bairro">
          <label>Rua</label>
          <input type="text" name="rua" placeholder="nome da rua">
          <label>Número</label>
          <input type="text" name="numero" placeholder="número">
          <label>Cidade</label>
          <input type="text" name="cidade" placeholder="Cidade">
          <label>Estado</label>
          <input type="text" name="estado" placeholder="Estado">
          <button type="submit">Salvar</button>
        </form>`;
      break;
  }

  formContainer.innerHTML = html;

  const mainContainer = document.querySelector('main.container');
  if (mainContainer) {
    mainContainer.appendChild(formContainer);
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const quantidadeInputs = formContainer.querySelectorAll('input[name="quantidade"]');
  quantidadeInputs.forEach(input => {
    input.type = "number";
    input.min = "0";
    input.max = "50";

    input.addEventListener('input', function () {
      let valor = parseInt(this.value, 10);
      if (isNaN(valor)) {
        this.value = '';
        return;
      }
      if (valor > 50) this.value = '50';
      else if (valor < 0) this.value = '0';
    });
  });

  if (option === 'Atualizar Perfil') {
    const cepInput = formContainer.querySelector('input[placeholder="00000-000"]');
    const bairroInput = formContainer.querySelector('input[placeholder="nome do bairro"]');
    const ruaInput = formContainer.querySelector('input[placeholder="nome da rua"]');
    const cidadeInput = formContainer.querySelector('input[placeholder="Cidade"]');
    const estadoInput = formContainer.querySelector('input[placeholder="Estado"]');

    if (cepInput) {
      cepInput.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length !== 8) {
          Swal.fire({
            icon: 'error',
            title: 'CEP inválido',
            text: 'Deve conter 8 dígitos.'
          });
          return;
        }
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => response.json())
          .then(data => {
            if (data.erro) {
              Swal.fire({
                icon: 'error',
                title: 'CEP não encontrado'
              });
              return;
            }
            bairroInput.value = data.bairro || '';
            ruaInput.value = data.logradouro || '';
            cidadeInput.value = data.localidade || '';
            estadoInput.value = data.uf || '';
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Erro ao buscar CEP.'
            });
          });
      });
    }

    const perfilForm = formContainer.querySelector('#perfil-form');
    perfilForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(perfilForm);
      const perfilAtualizado = {
        celular: formData.get('celular'),
        email: formData.get('email'),
        cep: formData.get('cep'),
        bairro: formData.get('bairro'),
        rua: formData.get('rua'),
        numero: formData.get('numero'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado')
      };

      Swal.fire({
        icon: 'success',
        title: 'Perfil atualizado com sucesso!',
        html: `
          <b>Celular:</b> ${perfilAtualizado.celular}<br>
          <b>Email:</b> ${perfilAtualizado.email}<br>
          <b>Endereço:</b> ${perfilAtualizado.rua}, ${perfilAtualizado.numero}, ${perfilAtualizado.bairro} - ${perfilAtualizado.cidade}/${perfilAtualizado.estado}<br>
          <b>CEP:</b> ${perfilAtualizado.cep}
        `
      });

      perfilForm.reset();
    });
  }

  const doacaoForm = formContainer.querySelector('#doacao-form');
  if (doacaoForm) {
    doacaoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(doacaoForm);
      const novaDoacao = {
        ch: usuarioCH,
        nome: data.get('nome'),
        quantidade: data.get('quantidade'),
        validade: data.get('validade'),
        nomeParceiro : data.get('nomeparceiro'),
        celular: data.get('celular'),
        email: data.get('email'),
        endereco: data.get('endereco'),
        observacoes: data.get('observacoes'),
        data_doacao: new Date(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      db.collection("doacoes").add(novaDoacao)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Doação registrada com sucesso! Entraremos em contato e combinaremos a retirada dos medicamentos com você.'
          });
          showForm('Histórico de Doações');
          carregarHistorico('doacoes');
        })
        .catch(error => {
          console.error("Erro ao registrar doação: ", error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível registrar a doação.'
          });
        });
    });
  }

  const descarteForm = formContainer.querySelector('#descarte-form');
  if (descarteForm) {
    descarteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(descarteForm);
      const novoDescarte = {
        ch: usuarioCH,
        nome: data.get('nome'),
        quantidade: data.get('quantidade'),
        observacoes: data.get('observacoes'),
        validade: data.get('validade'),
        nomeParceiro : data.get('nomeparceiro'),
        celular: data.get('celular'),
        email: data.get('email'),
        endereco: data.get('endereco'),
        data_descarte: new Date(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      db.collection("descartes").add(novoDescarte)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Descarte registrado com sucesso! Entraremos em contato em breve.'
          });
          showForm('Histórico de Descartes');
          carregarHistorico('descartes');
        })
        .catch(error => {
          console.error("Erro ao registrar descarte: ", error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível registrar o descarte.'
          });
        });
    });
  }

  if (option === 'Histórico de Doações' || option === 'Histórico de Descartes') {
    carregarHistorico(option === 'Histórico de Doações' ? 'doacoes' : 'descartes');
  }
}

function formatarData(data) {
  if (!data) return '';
  const d = new Date(data);
  if (isNaN(d)) return data;
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function carregarHistorico(colecao) {
  const usuarioCH = localStorage.getItem("usuarioCH");
  if (!usuarioCH) return;

  db.collection(colecao)
    .where('ch', '==', usuarioCH)
    .orderBy('timestamp', 'desc')
    .get()
    .then(snapshot => {
      const list = document.getElementById(colecao + '-list');
      if (!list) return;
      list.innerHTML = '';

      snapshot.forEach(doc => {
        const item = doc.data();
        const li = document.createElement('li');
        li.className = 'list-group-item';

       const dataOriginal = item.data_doacao || item.data_descarte;
       const dataFormatada = dataOriginal?.toDate 
       ? formatarData(dataOriginal.toDate()) 
       : formatarData(dataOriginal);         


        if (colecao === 'doacoes') {
          li.textContent = `${item.nome} — ${item.quantidade} unidades (Val: ${item.validade}) — Doado em: ${dataFormatada}`;
        } else {
          li.textContent = `${item.nome} — Observações: ${item.observacoes} — Descartado em: ${dataFormatada}`;
        }

        list.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar histórico: ", error);
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
