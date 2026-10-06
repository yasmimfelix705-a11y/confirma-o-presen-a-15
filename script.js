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
// INICIAR AUTENTICAÇÃO
// ==========================================

auth.signInAnonymously()
    .then(() => {
        console.log("Firebase conectado.");
    })
    .catch((erro) => {
        console.error("Erro no Firebase:", erro);
    });


// ==========================================
// BOTÃO BUSCAR
// ==========================================

botaoBuscar.addEventListener("click", buscarConvidado);


// ==========================================
// ENTER NO CAMPO
// ==========================================

campoBusca.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarConvidado();
    }
});


// ==========================================
// BUSCAR CONVIDADO
// ==========================================

function buscarConvidado() {

    const texto = normalizar(campoBusca.value);

    mensagem.innerHTML = "";

    if (!texto) {
        mostrarMensagem("Digite seu nome ou o nome da sua família.");
        return;
    }

    // Verifica se convidados.js realmente foi carregado
    if (typeof convidados === "undefined") {
        console.error("ERRO: convidados.js não foi carregado.");
        mostrarMensagem("A lista de convidados não foi carregada. Atualize a página.");
        return;
    }

    if (!Array.isArray(convidados)) {
        console.error("ERRO: convidados não é uma lista.");
        mostrarMensagem("Erro ao carregar a lista de convidados.");
        return;
    }

    console.log("Total de convidados:", convidados.length);
    console.log("Buscando:", texto);

    // Procura pelo nome da família OU pelo nome da pessoa
    const resultados = convidados.filter((convite) => {

        const familia = normalizar(convite.familia || "");

        const pessoas = Array.isArray(convite.pessoas)
            ? convite.pessoas
            : [];

        const encontrouFamilia = familia.includes(texto);

        const encontrouPessoa = pessoas.some((pessoa) =>
            normalizar(pessoa).includes(texto)
        );

        return encontrouFamilia || encontrouPessoa;
    });

    console.log("Resultados encontrados:", resultados);

    if (resultados.length === 0) {
        mostrarMensagem(
            "Não encontramos esse nome na lista. Verifique a escrita e tente novamente."
        );
        return;
    }

    if (resultados.length === 1) {
        mostrarConvite(resultados[0]);
        return;
    }

    mostrarResultados(resultados);
}


// ==========================================
// MOSTRAR RESULTADOS
// ==========================================

function mostrarResultados(resultados) {

    let html = `
        <div class="resultado-busca">
            <p class="titulo-resultado">
                Encontramos estes convites:
            </p>
    `;

    resultados.forEach((convite, index) => {

        html += `
            <button
                type="button"
                class="resultado-item"
                onclick="selecionarResultado(${index})"
            >
                ${escapeHTML(convite.familia)}
            </button>
        `;
    });

    html += `</div>`;

    mensagem.innerHTML = html;

    window.resultadosBusca = resultados;
}


// ==========================================
// SELECIONAR RESULTADO
// ==========================================

function selecionarResultado(index) {

    if (!window.resultadosBusca) return;

    const convite = window.resultadosBusca[index];

    if (convite) {
        mostrarConvite(convite);
    }
}


// ==========================================
// MOSTRAR CONVITE
// ==========================================

async function mostrarConvite(convite) {

    conviteAtual = convite;
    pessoasSelecionadas = [];

    mensagem.innerHTML = `
        <div class="carregando">
            Consultando seu convite...
        </div>
    `;

    const jaConfirmado = await verificarConfirmacao(convite.id);

    if (jaConfirmado) {

        mensagem.innerHTML = `
            <div class="confirmado">
                <h3>Presença já confirmada 🩵</h3>
                <p>
                    A presença desta família já foi registrada.
                </p>
            </div>
        `;

        return;
    }

    let html = `
        <div class="convite-encontrado">

            <h3>
                ${escapeHTML(convite.familia)}
            </h3>

            <p class="instrucao-selecao">
                Selecione quem irá ao aniversário:
            </p>

            <div class="lista-pessoas">
    `;

    convite.pessoas.forEach((pessoa, index) => {

        html += `
            <label class="pessoa-item">

                <input
                    type="checkbox"
                    class="pessoa-checkbox"
                    value="${index}"
                    onchange="alterarPessoa(${index}, this.checked)"
                >

                <span class="quadradinho"></span>

                <span class="nome-pessoa">
                    ${escapeHTML(pessoa)}
                </span>

            </label>
        `;
    });

    html += `
            </div>

            <button
                type="button"
                class="botao-confirmar"
                onclick="confirmarPresenca()"
            >
                Confirmar presença
            </button>

        </div>
    `;

    mensagem.innerHTML = html;
}


// ==========================================
// MARCAR / DESMARCAR PESSOA
// ==========================================

function alterarPessoa(index, selecionado) {

    if (!conviteAtual) return;

    const pessoa = conviteAtual.pessoas[index];

    if (selecionado) {

        if (!pessoasSelecionadas.includes(pessoa)) {
            pessoasSelecionadas.push(pessoa);
        }

    } else {

        pessoasSelecionadas =
            pessoasSelecionadas.filter(nome => nome !== pessoa);
    }

    console.log("Selecionados:", pessoasSelecionadas);
}


// ==========================================
// VER
