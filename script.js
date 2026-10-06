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
// ENTER
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

        mensagem.innerHTML = `
            <div class="mensagem-erro">
                Digite seu nome para buscar.
            </div>
        `;

        return;
    }


    // Verifica se a lista foi carregada
    if (
        typeof convidados === "undefined" ||
        !Array.isArray(convidados)
    ) {

        console.error("A lista convidados.js não foi carregada.");

        mensagem.innerHTML = `
            <div class="mensagem-erro">
                Não foi possível carregar a lista de convidados.
            </div>
        `;

        return;
    }


    console.log("Buscando:", texto);
    console.log("Total de convites:", convidados.length);


    // ==========================================
    // PROCURAR
    // ==========================================

    const resultados = convidados.filter((convite) => {

        const familia = normalizar(
            convite.familia || ""
        );

        const pessoas = Array.isArray(convite.pessoas)
            ? convite.pessoas
            : [];


        // Procura pelo nome da família
        const encontrouFamilia =
            familia.includes(texto);


        // Procura pelo nome de qualquer pessoa
        const encontrouPessoa =
            pessoas.some((pessoa) =>
                normalizar(pessoa).includes(texto)
            );


        return encontrouFamilia || encontrouPessoa;

    });


    console.log("Resultados:", resultados);


    // ==========================================
    // NÃO ENCONTROU
    // ==========================================

    if (resultados.length === 0) {

        mensagem.innerHTML = `
            <div class="mensagem-erro">
                Não encontramos esse nome na lista.
            </div>
        `;

        return;
    }


    // ==========================================
    // ENCONTROU UM
    // ==========================================

    if (resultados.length === 1) {

        mostrarConvite(resultados[0]);

        return;
    }


    // ==========================================
    // ENCONTROU MAIS DE UM
    // ==========================================

    window.resultadosBusca = resultados;

    let html = `
        <div class="resultado-busca">

            <p>
                Encontramos mais de um convite:
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


    html += `
        </div>
    `;

    mensagem.innerHTML = html;
}


// ==========================================
// SELECIONAR RESULTADO
// ==========================================

function selecionarResultado(index) {

    if (!window.resultadosBusca) {
        return;
    }

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


    // Verifica confirmação
    const jaConfirmado =
        await verificarConfirmacao(convite.id);


    if (jaConfirmado) {

        mensagem.innerHTML = `
            <div class="confirmado">

                <h3>
                    Presença já confirmada 🩵
                </h3>

                <p>
                    Este convite já teve a presença confirmada.
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

            <p>
                Selecione quem irá ao aniversário:
            </p>

            <div class="lista-pessoas">
    `;


    convite.pessoas.forEach((pessoa, index) => {

        html += `
            <label class="pessoa-item">

                <input
                    type="checkbox"
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
// SELECIONAR PESSOA
// ==========================================

function alterarPessoa
