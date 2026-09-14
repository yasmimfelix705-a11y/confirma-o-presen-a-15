// ===================================
// LISTA DE CONVIDADOS
// RSVP 15 ANOS YASMIM
// ===================================

const familias = {

"Núbia": [
"Carlos",
"Núbia",
"Ana Vitória",
"Sara"
],

"Rosilene": [
"Rosilene",
"Rodrigo",
"Theo"
],

"Mara": [
"Mara",
"Gilberto"
],

"Vanusa": [
"Vanusa",
"Marcelo",
"Estevão",
"Valentina"
],

"Marilene": [
"Marilene",
"Warley",
"Miguel"
],

"Lorrane": [
"Lorrane",
"Filipe"
],

"Rita": [
"Rita",
"Otamilson",
"Bruno"
],

"Marlene": [
"Marlene",
"Otailson",
"Maria Eduarda"
],

"Nicole": [
"Nicole",
"David",
"Maria Alice",
"Luís Otávio"
],

"Samara": [
"Samara",
"Renan",
"Isabelly",
"Emanuelly",
"Eloah"
],

"Soraia": [
"Soraia",
"Lara",
"Luna",
"Laerte"
],

"Helen": [
"Helen",
"Edson",
"Isaac"
],

"Adiciane": [
"Adiciane",
"Júlia"
],

"Tânia": [
"Tânia",
"Laíse",
"Luiz Gustavo",
"Lázaro"
],

"Sandra": [
"Sandra",
"Wagner",
"Anna Júlia",
"Anna Elize"
],

"Rafaela": [
"Rafaela",
"Lucas",
"Ana Laura"
],

"Joana": [
"Joana",
"Luciano",
"Luiza"
],

"Orlinda": [
"Orlinda",
"Lúcio Hélio",
"Ryan"
],

"Ezilane": [
"Ezilane",
"Maurício",
"Kauã",
"Sofia",
"Isabelly"
],

"Fernanda": [
"Fernanda",
"Otávio",
"Benjamin"
],

"Claudineia": [
"Claudineia",
"Sérgio",
"Gabriela"
],

"Vanuza": [
"Vanuza",
"Ilmar",
"Isabela"
],

"Fátima": [
"Fátima",
"Fausto"
],

"Fabrine": [
"Fabrine",
"João Vitor"
],

"Janaína": [
"Janaína",
"Jó",
"Nicolas",
"Sofia"
],

"Jéssica": [
"Jéssica",
"Heitor",
"Bryan",
"Liz"
],

"Marisa": [
"Marisa",
"Daniel"
],

"Tereza": [
"Tereza",
"Osvaldo",
"Rafael",
"Washington",
"Michele"
],

"Vivian": [
"Vivian",
"Hebert"
],

"Renata": [
"Renata",
"Roberto",
"Samuel",
"Maicon",
"Marlon",
"João Vicente"
],

"Cida": [
"Cida",
"José Carlos"
],

"Araci": [
"Araci",
"Silvio Henrique"
],

"Bruna": [
"Bruna",
"Agnes"
],

"Lúcia": [
"Lúcia",
"Márcio"
],

"Sônia": [
"Sônia",
"Milton"
],

"Leandra": [
"Natan",
"Leandra",
"Helena"
],

"Paulo Henrique": [
"Paulo Henrique",
"Jéssica"
],

"Alice": [
"Alice",
"Maycon",
"Liz"
],

"Nayara": [
"Nayara",
"Junior",
"Lavínia",
"Vitória",
"Helena"
],

"Eliane": [
"Eliane",
"Zumiro",
"Miguel"
],

"Raíssa": [
"Raíssa",
"Leonardo"
],

"Iane": [
"Iane",
"Demilson"
],

"Grete": [
"Grete",
"Edimilson"
]

};


// ===================================
// CONVIDADOS INDIVIDUAIS
// ===================================

const convidadosIndividuais = [

"Nicole Vitória",
"Laura",
"Ágatha",
"Maria Aparecida",
"Roberto",
"Silvio",
"Dalva",
"Lara Mikaely",
"Maria dos Anjos"

];


// ===================================
// FIREBASE
// ===================================

const firebaseConfig = {

    apiKey: "AIzaSyAYBh_xHUGuEGMjpHEOxBU-NPPc5ymum6g",

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


// ===================================
// AUTENTICAÇÃO ANÔNIMA
// ===================================

let usuarioAutenticado = false;

auth.signInAnonymously()
    .then(() => {

        usuarioAutenticado = true;

    })
    .catch((erro) => {

        console.error("Erro na autenticação:", erro);

    });


// ===================================
// ELEMENTOS
// ===================================

const formulario = document.getElementById("formRsvp");

const campoNome = document.getElementById("convidado");

const mensagem = document.getElementById("mensagem");


// ===================================
// NORMALIZAR ID
// ===================================

function criarId(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}


// ===================================
// BUSCA DO CONVIDADO
// ===================================

formulario.addEventListener("submit", function(e) {

    e.preventDefault();

    const busca = campoNome.value
        .trim()
        .toLowerCase();

    if (!busca) {
        return;
    }

    let resultado = null;

    let tipo = null;

    let identificador = null;

    let nomeFamilia = null;


    // ===================================
    // BUSCAR FAMÍLIA
    // ===================================

    for (const familia in familias) {

        const membros = familias[familia];

        if (
            familia.toLowerCase().includes(busca) ||
            membros.some(nome =>
                nome.toLowerCase().includes(busca)
            )
        ) {

            resultado = membros;

            tipo = "familia";

            nomeFamilia = familia;

            identificador = "familia-" + criarId(familia);

            break;
        }
    }


    // ===================================
    // BUSCAR INDIVIDUAL
    // ===================================

    if (!resultado) {

        const individual = convidadosIndividuais.find(nome =>
            nome.toLowerCase().includes(busca)
        );

        if (individual) {

            resultado = [individual];

            tipo = "individual";

            identificador = "individual-" + criarId(individual);

        }

    }


    // ===================================
    // NÃO ENCONTROU
    // ===================================

    if (!resultado) {

        mensagem.innerHTML = `

        <h3>
        Convite não encontrado
        </h3>

        <p>
        Verifique o nome digitado.
        </p>

        `;

        return;

    }


    // ===================================
    // MOSTRAR CONVITE
    // ===================================

    mensagem.innerHTML = `

    <h3>
    Convite encontrado ✨
    </h3>

    <p>
    Selecione quem irá participar:
    </p>

    ${resultado.map(nome => `

        <label class="pessoa">

        <input
        type="checkbox"
        class="presenca"
        >

        ${nome}

        </label>

    `).join("")}

    <br>

    <button
    type="button"
    onclick="confirmarPresenca()"
    >

    Confirmar presença

    </button>

    `;


    // Guardar os dados do convite atualmente pesquisado

    mensagem.dataset.conviteId = identificador;

    mensagem.dataset.tipo = tipo;

    mensagem.dataset.familia = nomeFamilia || "";

    mensagem.dataset.convidados = JSON.stringify(resultado);


    campoNome.value = "";

});


// ===================================
// CONFIRMAR PRESENÇA
// ===================================

async function confirmarPresenca() {

    const selecionados = document.querySelectorAll(
        ".presenca:checked"
    );


    if (selecionados.length === 0) {

        mensagem.innerHTML = `

        <h3>
        Atenção
        </h3>

        <p>
        Selecione pelo menos uma pessoa.
        </p>

        `;

        return;

    }


    if (!usuarioAutenticado) {

        mensagem.innerHTML = `

        <h3>
        Aguarde um instante
        </h3>

        <p>
        Estamos preparando sua confirmação.
        </p>

        `;

        return;

    }


    const conviteId = mensagem.dataset.conviteId;

    const tipo = mensagem.dataset.tipo;

    const familia = mensagem.dataset.familia;

    const convidados = JSON.parse(
        mensagem.dataset.convidados
    );


    // ===================================
    // VERIFICAR CONFIRMAÇÃO EXISTENTE
    // ===================================

    const referencia = db
        .collection("confirmacoes")
        .doc(conviteId);


    try {

        const documento = await referencia.get();


        if (documento.exists) {

            mensagem.innerHTML = `

            <h3>
            Presença já confirmada 💙
            </h3>

            <p>
            Este convite já foi confirmado.
            </p>

            `;

            return;

        }


        // ===================================
        // PEGAR NOMES SELECIONADOS
        // ===================================

        const nomes = [];

        selecionados.forEach(item => {

            nomes.push(
                item.parentElement.textContent.trim()
            );

        });


        // ===================================
        // SALVAR NO FIRESTORE
        // ===================================

        await referencia.set({

            conviteId: conviteId,

            tipo: tipo,

            familia: familia,

            convidados: nomes,

            quantidade: nomes.length,

            confirmadoEm:
                firebase.firestore.FieldValue.serverTimestamp()

        });


        // ===================================
        // MENSAGEM FINAL
        // ===================================

        mensagem.innerHTML = `

        <h3>
        Presença confirmada 💙
        </h3>

        <p>
        ${nomes.length} pessoa(s) confirmada(s).
        </p>

        <p>
        ${nomes.join(", ")}
        </p>

        <br>

        <p>
        Obrigada por fazer parte desta noite especial!
        </p>

        `;


    } catch (erro) {

        console.error(erro);

        mensagem.innerHTML = `

        <h3>
        Não foi possível confirmar
        </h3>

        <p>
        Tente novamente em alguns instantes.
        </p>

        `;

    }

}
