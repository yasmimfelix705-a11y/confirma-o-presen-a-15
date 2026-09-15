// ===================================
// LISTA DE CONVIDADOS
// RSVP - 15 ANOS YASMIM
// ===================================


// ===================================
// FIREBASE
// ===================================

const firebaseConfig = {
    apiKey: "AIzaSyAYBh_xHUGeGMjpHEOxBU-Nppc5ymum6g",
    authDomain: "yasmim-dc181.firebaseapp.com",
    projectId: "yasmim-dc181",
    storageBucket: "yasmim-dc181.firebasestorage.app",
    messagingSenderId: "773790336369",
    appId: "1:773790336369:web:9292e70565a551b4bf22d0",
    measurementId: "G-MRCSX5RNGN"
};


// Inicializa o Firebase somente uma vez
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();


// ===================================
// AUTENTICAÇÃO ANÔNIMA
// ===================================

firebase.auth().signInAnonymously()
    .catch((erro) => {
        console.error("Erro na autenticação:", erro);
    });


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
// ELEMENTOS DA PÁGINA
// ===================================

const formulario = document.getElementById("formRsvp");
const campoNome = document.getElementById("convidado");
const mensagem = document.getElementById("mensagem");


// ===================================
// NORMALIZAR TEXTO
// ===================================

function normalizarTexto(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}


// ===================================
// CRIAR ID FIXO DO CONVITE
// ===================================

function criarIdConvite(tipo, nome) {

    const texto = normalizarTexto(nome)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return tipo + "-" + texto;

}


// ===================================
// TRANSFORMAR FAMÍLIA EM OBJETO
// ===================================

function encontrarConvite(busca) {

    const buscaNormalizada = normalizarTexto(busca);


    // Procura famílias
    for (const familia in familias) {

        const membros = familias[familia];

        const encontrouFamilia =
            normalizarTexto(familia).includes(buscaNormalizada);

        const encontrouPessoa =
            membros.some(nome =>
                normalizarTexto(nome).includes(buscaNormalizada)
            );


        if (encontrouFamilia || encontrouPessoa) {

            return {
                id: criarIdConvite("familia", familia),
                tipo: "familia",
                nome: familia,
                membros: membros
            };

        }

    }


    // Procura convidados individuais
    const individual = convidadosIndividuais.find(nome =>
        normalizarTexto(nome).includes(buscaNormalizada)
    );


    if (individual) {

        return {
            id: criarIdConvite("individual", individual),
            tipo: "individual",
            nome: individual,
            membros: [individual]
        };

    }


    return null;

}


// ===================================
// VERIFICAR SE JÁ CONFIRMOU
// ===================================

async function verificarConfirmacao(convite) {

    try {

        const documento = await db
            .collection("confirmacoes")
            .doc(convite.id)
            .get();


        if (documento.exists) {

            const dados = documento.data();

            const nomesConfirmados =
                Array.isArray(dados.convidados)
                    ? dados.convidados
                    : [];

            const quantidade =
                dados.quantidade ||
                nomesConfirmados.length;


            mensagem.innerHTML = `

                <h3>Presença já confirmada 💙</h3>

                <p>
                    Este convite já teve a presença confirmada.
                </p>

                <p>
                    <strong>
                        ${quantidade} pessoa(s) confirmada(s):
                    </strong>
                </p>

                <p>
                    ${nomesConfirmados.join(", ")}
                </p>

            `;

            return true;

        }


        return false;

    } catch (erro) {

        console.error(
            "Erro ao verificar confirmação:",
            erro
        );


        mensagem.innerHTML = `

            <h3>Não foi possível verificar</h3>

            <p>
                Aguarde alguns segundos e tente novamente.
            </p>

        `;

        return true;

    }

}


// ===================================
// BUSCAR CONVITE
// ===================================

formulario.addEventListener("submit", async function(e) {

    e.preventDefault();


    const busca = campoNome.value.trim();


    if (!busca) {

        mensagem.innerHTML = `

            <h3>Digite um nome</h3>

            <p>
                Digite seu nome ou o nome da família.
            </p>

        `;

        return;

    }


    mensagem.innerHTML = `

        <h3>Procurando seu convite...</h3>

        <p>
            Aguarde um instante.
        </p>

    `;


    const convite = encontrarConvite(busca);


    if (!convite) {

        mensagem.innerHTML = `

            <h3>Convite não encontrado</h3>

            <p>
                Verifique o nome digitado.
            </p>

        `;

        return;

    }


    const jaConfirmado =
        await verificarConfirmacao(convite);


    if (jaConfirmado) {

        campoNome.value = "";

        return;

    }


    mostrarConvite(convite);


    campoNome.value = "";

});


// ===================================
// MOSTRAR CONVITE ENCONTRADO
// ===================================

function mostrarConvite(convite) {

    mensagem.innerHTML = `

        <h3>Convite encontrado ✨</h3>

        <p>
            Selecione quem irá participar:
        </p>

        <div class="lista-pessoas">

            ${convite.membros.map(nome => `

                <label class="pessoa">

                    <input
                        type="checkbox"
                        class="presenca"
                        value="${nome}"
                    >

                    ${nome}

                </label>

            `).join("")}

        </div>

        <br>

        <button
            type="button"
            id="botaoConfirmar"
        >
            Confirmar presença
        </button>

    `;


    const botao =
        document.getElementById("botaoConfirmar");


    botao.addEventListener(
        "click",
        function() {

            confirmarPresenca(convite);

        }
    );

}


// ===================================
// CONFIRMAR PRESENÇA
// ===================================

async function confirmarPresenca(convite) {

    const selecionados =
        document.querySelectorAll(
            ".presenca:checked"
        );


    if (selecionados.length === 0) {

        mensagem.innerHTML = `

            <h3>Atenção</h3>

            <p>
                Selecione pelo menos uma pessoa.
            </p>

        `;

        return;

    }


    const nomes = [];


    selecionados.forEach(item => {

        nomes.push(item.value);

    });


    const botao =
        document.getElementById(
            "botaoConfirmar"
        );


    if (botao) {

        botao.disabled = true;

        botao.textContent =
            "Confirmando...";

    }


    try {

        // ===================================
        // CRIA O DOCUMENTO
        //
        // IMPORTANTE:
        // create() NÃO substitui documento.
        // Se já existir, o Firebase bloqueia.
        // ===================================

        await db
            .collection("confirmacoes")
            .doc(convite.id)
            .create({

                conviteId: convite.id,

                tipo: convite.tipo,

                familia: convite.nome,

                convidados: nomes,

                quantidade: nomes.length,

                confirmadoEm:
                    firebase.firestore.FieldValue
                        .serverTimestamp()

            });


        // ===================================
        // SUCESSO
        // ===================================

        mensagem.innerHTML = `

            <h3>Presença confirmada 💙</h3>

            <p>
                ${nomes.length}
                pessoa(s) confirmada(s).
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
        // DOCUMENTO JÁ EXISTE
        // ===================================

        if (
            erro.code ===
            "already-exists"
        ) {

            mensagem.innerHTML = `

                <h3>Presença já confirmada 💙</h3>

                <p>
                    Este convite já teve
                    a presença confirmada.
                </p>

                <p>
                    Não é possível confirmar
                    novamente.
                </p>

            `;

            return;

        }


        // ===================================
        // ERRO DE PERMISSÃO
        // ===================================

        if (
            erro.code ===
            "permission-denied"
        ) {

            // Tenta verificar novamente
            // se o convite já existe.

            try {

                const documento =
                    await db
                        .collection("confirmacoes")
                        .doc(convite.id)
                        .get();


                if (documento.exists) {

                    const dados =
                        documento.data();


                    const nomesConfirmados =
                        dados.convidados || [];


                    mensagem.innerHTML = `

                        <h3>
                            Presença já confirmada 💙
                        </h3>

                        <p>
                            Este convite já teve
                            a presença confirmada.
                        </p>

                        <p>
                            <strong>
                                Pessoas confirmadas:
                            </strong>
                        </p>

                        <p>
                            ${nomesConfirmados.join(", ")}
                        </p>

                    `;

                    return;

                }

            } catch (erroConsulta) {

                console.error(
                    "Erro na consulta:",
                    erroConsulta
                );

            }

        }


        // ===================================
        // OUTRO ERRO
        // ===================================

        mensagem.innerHTML = `

            <h3>Não foi possível confirmar</h3>

            <p>
                Tente novamente em alguns segundos.
            </p>

        `;


        if (botao) {

            botao.disabled = false;

            botao.textContent =
                "Confirmar presença";

        }

    }

}
