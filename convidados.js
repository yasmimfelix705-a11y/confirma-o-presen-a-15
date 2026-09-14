// ===================================
// LISTA DE CONVIDADOS
// RSVP 15 ANOS YASMIM
// ===================================

// ===================================
// FIREBASE
// ===================================

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

const db = firebase.firestore();
const auth = firebase.auth();


// ===================================
// LISTA DE FAMÍLIAS
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
// ELEMENTOS DO SITE
// ===================================

const formulario = document.getElementById("formRsvp");
const campoNome = document.getElementById("convidado");
const mensagem = document.getElementById("mensagem");


// ===================================
// NORMALIZAR TEXTO
// ===================================

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


// ===================================
// CRIAR ID ÚNICO DO CONVITE
// ===================================

function criarConviteId(tipo, nome) {

    return normalizar(tipo + "-" + nome)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


// ===================================
// LOGIN ANÔNIMO NO FIREBASE
// ===================================

let usuarioFirebase = null;

auth.onAuthStateChanged(function(usuario) {

    if (usuario) {

        usuarioFirebase = usuario;

    } else {

        auth.signInAnonymously()
            .then(function(resultado) {

                usuarioFirebase = resultado.user;

            })
            .catch(function(erro) {

                console.error(
                    "Erro ao entrar no Firebase:",
                    erro
                );

            });

    }

});


// ===================================
// BUSCAR CONVITE
// ===================================

formulario.addEventListener("submit", async function(e) {

    e.preventDefault();

    const buscaOriginal = campoNome.value.trim();

    if (!buscaOriginal) {
        return;
    }

    const busca = normalizar(buscaOriginal);

    let listaEncontrada = null;
    let nomeFamiliaEncontrada = null;
    let tipoConvite = null;

    
    // ===================================
    // PROCURAR FAMÍLIA
    // ===================================

    for (const familia in familias) {

        const membros = familias[familia];

        const familiaEncontrada =
            normalizar(familia).includes(busca);

        const membroEncontrado =
            membros.some(nome =>
                normalizar(nome).includes(busca)
            );

        if (familiaEncontrada || membroEncontrado) {

            listaEncontrada = membros;
            nomeFamiliaEncontrada = familia;
            tipoConvite = "familia";

            break;
        }
    }


    // ===================================
    // PROCURAR CONVIDADO INDIVIDUAL
    // ===================================

    if (!listaEncontrada) {

        const individualEncontrado =
            convidadosIndividuais.find(nome =>
                normalizar(nome).includes(busca)
            );

        if (individualEncontrado) {

            listaEncontrada = [
                individualEncontrado
            ];

            nomeFamiliaEncontrada =
                individualEncontrado;

            tipoConvite = "individual";
        }
    }


    // ===================================
    // CONVITE NÃO ENCONTRADO
    // ===================================

    if (!listaEncontrada) {

        mensagem.innerHTML = `
            <h3>Convite não encontrado</h3>
            <p>Verifique o nome digitado.</p>
        `;

        return;
    }


    // ===================================
    // VERIFICAR SE JÁ CONFIRMOU
    // ===================================

    const conviteId = criarConviteId(
        tipoConvite,
        nomeFamiliaEncontrada
    );

    try {

        const documento =
            await db
                .collection("confirmacoes")
                .doc(conviteId)
                .get();

        if (documento.exists) {

            mensagem.innerHTML = `
                <h3>Presença já confirmada 💙</h3>

                <p>
                    Este convite já teve a presença confirmada.
                </p>

                <p>
                    Não é possível confirmar novamente.
                </p>
            `;

            campoNome.value = "";

            return;
        }

    } catch (erro) {

        console.error(
            "Erro ao verificar confirmação:",
            erro
        );

        mensagem.innerHTML = `
            <h3>Não foi possível verificar</h3>

            <p>
                Tente novamente em alguns instantes.
            </p>
        `;

        return;
    }


    // ===================================
    // MOSTRAR CONVIDADOS
    // ===================================

    mensagem.innerHTML = `
        <h3>Convite encontrado ✨</h3>

        <p>
            Selecione quem irá participar:
        </p>

        ${listaEncontrada.map(nome => `
            <label class="pessoa">

                <input
                    type="checkbox"
                    class="presenca"
                    value="${nome}"
                >

                ${nome}

            </label>
        `).join("")}

        <br>

        <button
            type="button"
            onclick="confirmarPresenca(
                '${conviteId}',
                '${tipoConvite}',
                '${nomeFamiliaEncontrada.replace(/'/g, "\\'")}'
            )"
        >
            Confirmar presença
        </button>
    `;

    campoNome.value = "";

});


// ===================================
// CONFIRMAR PRESENÇA
// ===================================

async function confirmarPresenca(
    conviteId,
    tipoConvite,
    nomeFamilia
) {

    const selecionados =
        document.querySelectorAll(
            ".presenca:checked"
        );


    // ===================================
    // NENHUMA PESSOA SELECIONADA
    // ===================================

    if (selecionados.length === 0) {

        mensagem.innerHTML = `
            <h3>Atenção</h3>

            <p>
                Selecione pelo menos uma pessoa.
            </p>
        `;

        return;
    }


    // ===================================
    // PEGAR NOMES SELECIONADOS
    // ===================================

    const nomes = [];

    selecionados.forEach(function(item) {

        nomes.push(item.value);

    });


    // ===================================
    // DESABILITAR BOTÃO
    // EVITA CLIQUES DUPLOS
    // ===================================

    const botao =
        mensagem.querySelector(
            "button"
        );

    if (botao) {

        botao.disabled = true;

        botao.textContent =
            "Confirmando...";
    }


    try {

        // ===================================
        // VERIFICAR NOVAMENTE NO FIRESTORE
        // ===================================

        const documento =
            await db
                .collection("confirmacoes")
                .doc(conviteId)
                .get();


        // ===================================
        // JÁ CONFIRMOU
        // ===================================

        if (documento.exists) {

            mensagem.innerHTML = `
                <h3>Presença já confirmada 💙</h3>

                <p>
                    Este convite já teve a presença confirmada.
                </p>

                <p>
                    Não é possível confirmar novamente.
                </p>
            `;

            return;
        }


        // ===================================
        // SALVAR CONFIRMAÇÃO
        // ===================================

        await db
            .collection("confirmacoes")
            .doc(conviteId)
            .set({

                conviteId: conviteId,

                tipo: tipoConvite,

                familia: nomeFamilia,

                convidados: nomes,

                quantidade: nomes.length,

                confirmadoEm:
                    firebase.firestore.FieldValue.serverTimestamp()

            });


        // ===================================
        // SUCESSO
        // ===================================

        mensagem.innerHTML = `
            <h3>Presença confirmada 💙</h3>

            <p>
                ${nomes.length} pessoa(s)
                confirmada(s).
            </p>

            <p>
                ${nomes.join(", ")}
            </p>

            <br>

            <p>
                Obrigada por fazer parte
                desta noite especial!
            </p>
        `;


    } catch (erro) {

        console.error(
            "Erro ao confirmar:",
            erro
        );


        // ===================================
        // ERRO DE PERMISSÃO =
        // PROVAVELMENTE JÁ CONFIRMADO
        // ===================================

        if (
            erro.code ===
            "permission-denied"
        ) {

            mensagem.innerHTML = `
                <h3>Presença já confirmada 💙</h3>

                <p>
                    Este convite já teve a presença confirmada.
                </p>

                <p>
                    Não é possível confirmar novamente.
                </p>
            `;

            return;
        }


        // ===================================
        // OUTRO ERRO
        // ===================================

        mensagem.innerHTML = `
            <h3>Não foi possível confirmar</h3>

            <p>
                Verifique sua conexão
                e tente novamente.
            </p>
        `;

    }

}
