import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDWCZSN1Eo-B7RxZgPQ0qkG_T6V2e75PZo",
  authDomain: "healthy-life-64ca0.firebaseapp.com",
  projectId: "healthy-life-64ca0",
  storageBucket: "healthy-life-64ca0.appspot.com",
  messagingSenderId: "968139723167",
  appId: "1:968139723167:web:0d7b0ca207be172ce12daa",
  measurementId: "G-3QEHS0MYD1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const parceiroBtn = document.getElementById("parceiroBtn");
const adminBtn = document.getElementById("adminBtn");
const parceiroForm = document.getElementById("parceiroForm");
const adminForm = document.getElementById("adminForm");
const loading = document.getElementById("loading");

parceiroBtn.addEventListener("click", () => {
  parceiroBtn.classList.add("active");
  adminBtn.classList.remove("active");
  parceiroForm.classList.remove("hidden");
  adminForm.classList.add("hidden");
});

adminBtn.addEventListener("click", () => {
  adminBtn.classList.add("active");
  parceiroBtn.classList.remove("active");
  adminForm.classList.remove("hidden");
  parceiroForm.classList.add("hidden");
});

async function realizarLogin(codigoHabilitacao, senha, tipoUsuario) {
  try {
    loading.classList.remove("hidden");

    const colecao = tipoUsuario === "admin" ? "admin" :
                    tipoUsuario === "parceiro" ? "parceiro" : null;

    if (!colecao) {
      throw new Error("Tipo de usuário inválido.");
    }

    const q = query(collection(db, colecao), where("ch", "==", codigoHabilitacao));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      loading.classList.add("hidden");
      alert("Código de habilitação não encontrado.");
      return;
    }

    let userData = null;
    let userEmail = null;

    snapshot.forEach(doc => {
      userData = doc.data();
      userEmail = userData.email;
    });

    if (!userEmail) {
      loading.classList.add("hidden");
      alert("E-mail do usuário não encontrado.");
      return;
    }

    await signInWithEmailAndPassword(auth, userEmail, senha);

 
    sessionStorage.setItem("usuarioLogado", JSON.stringify({
      ch: userData.ch,
      nome: userData.nome || "Parceiro",
      celular: userData.celular || "Celular",
      email: userData.email
    }));


    localStorage.setItem("usuarioCH", userData.ch);

    loading.classList.add("hidden");

    if (tipoUsuario === "admin") {
      window.location.href = "home-admin.html";
    } else {
      window.location.href = "home-cliente.html";
    }

  } catch (error) {
    loading.classList.add("hidden");
    console.error("Erro no login:", error);
    alert("Erro ao tentar logar: " + error.message);
  }
}

parceiroForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigoHabilitacao = document.getElementById("codigoHabilitacaoParceiro").value.trim();
  const senhaParceiro = document.getElementById("senhaParceiro").value;
  await realizarLogin(codigoHabilitacao, senhaParceiro, "parceiro");
});

adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigoHabilitacao = document.getElementById("codigoHabilitacaoAdmin").value.trim();
  const senhaAdmin = document.getElementById("senhaAdmin").value;
  await realizarLogin(codigoHabilitacao, senhaAdmin, "admin");
});
