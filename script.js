// ==========================================
// FIREBASE
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAYBh_xHUGuEGMjpHEOxBU-Nppc5ymum6g",
    authDomain: "yasmim-dc181.firebaseapp.com",
    projectId: "yasmim-dc181",
    storageBucket: "yasmim-dc181.firebasestorage.app",
    messagingSenderId: "773790336369",
    appId: "1:773790336369:web:9292e70565a551b4bf22d0",
    measurementId: "G-MRCSX5RNGN"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// ==========================================
// ELEMENTOS
// ==========================================

const campoBusca = document.getElementById("convidado");
const botaoBuscar = document.getElementById("botaoBuscar");
const mensagem = document.getElementById("mensagem");

let conviteAtual = null;
let pessoasSelecionadas = [];


// ==========================================
// AUTENTICAÇÃO
// ==========================================

auth.signInAnonymously()
    .catch(erro => {
        console.log("Firebase:", erro);
    });


// ==========================================
// BOTÃO BUSCAR
// ==========================================

botaoBuscar.addEventListener("click", function () {
    buscarConvidado();
});


// ==========================================
// ENTER
// ==========================================

campoBusca.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarConvidado();
    }
});


// ==========================================
// BUSCAR
// ==========================================

function buscarConvidado() {

    const texto = normalizar(campoBusca.value);

    mensagem.innerHTML = "";

    if (texto === "") {
        mensagem.innerHTML = `
            <div class="mensagem-erro">
                Digite seu nome para buscar.
            </div>
        `;
        return;
    }

    // Verifica se convidados.js foi carregado
    if (typeof convidados === "undefined") {
        mensagem.innerHTML = `
            <div class="mensagem-erro">
                Erro ao carregar a lista de convidados.
            </div>
        `;

        console.error("convidados.js não foi carregado.");
        return;
    }

    const resultados = convidados.filter(convite => {

        const familia = normalizar(convite.familia);

        const encontrou
