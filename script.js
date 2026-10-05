/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyAYBh_xHUGuEGMjpHEOxBU-Nppc5ymum6g",
    authDomain: "yasmim-dc181.firebaseapp.com",
    projectId: "yasmim-dc181",
    storageBucket: "yasmim-dc181.firebasestorage.app",
    messagingSenderId: "101640445046",
    appId: "1:101640445046:web:7c5f4b5e5e3f5e3e5e3e5e"
};


/* =========================================================
   INICIAR FIREBASE
========================================================= */

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();


/* =========================================================
   ELEMENTOS
========================================================= */

const buscaInput = document.getElementById("busca");
const resultados = document.getElementById("resultados");
const mensagem = document.getElementById("mensagem");


/* =========================================================
   VARIÁVEIS
========================================================= */

let familiaSelecionada = null;


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

auth.signInAnonymously()
    .then(() => {
        console.log("Usuário autenticado.");
    })
    .catch((erro) => {
        console.error("Erro na autenticação:", erro);
    });


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto || "";
    return div.innerHTML;
}


/* =========================================================
   BUSCAR CONVIDADOS
========================================================= */

function buscarConvidados() {

    const termo = normalizarTexto(
        buscaInput ? buscaInput.value : ""
    );

    resultados.innerHTML = "";

    if (mensagem) {
        mensagem.textContent = "";
    }

    familiaSelecionada = null;


    /* Campo vazio */

    if (!termo) {
        return;
    }


    /* Verificar se convidados existe */

    if (
        typeof convidados === "undefined" ||
        !Array.isArray(convidados)
    ) {

        console.error(
            "A variável 'convidados' não foi encontrada."
        );

        if (mensagem) {
            mensagem.textContent =
                "Não foi possível carregar a lista de convidados.";
        }

        return;
    }


    /* =====================================================
       PROCURAR NA ESTRUTURA:
       
       {
           id: "...",
           familia: "...",
           pessoas: ["Nome", "Nome"]
       }
    ===================================================== */

    const encontrados = convidados.filter((familia) => {

        const nomeFamilia = normalizarTexto(
            familia.familia
        );

        const pessoas = Array.isArray(familia.pessoas)
            ? familia.pessoas
            : [];


        /* Procurar pelo nome da família */

        if (nomeFamilia.includes(termo)) {
            return true;
        }


        /* Procurar pelos nomes das pessoas */

        return pessoas.some((nome) =>
            normalizarTexto(nome).includes(termo)
        );
    });


    /* =====================================================
       NENHUM RESULTADO
    ===================================================== */

    if (encontrados.length === 0) {

        if (mensagem) {
            mensagem.textContent =
                "Nenhum convidado encontrado.";
        }

        return;
    }


    /* =====================================================
       MOSTRAR FAMÍLIAS ENCONTRADAS
    ===================================================== */

    mostrarResultados(encontrados);
}


/* =========================================================
   MOSTRAR RESULTADOS
========================================================= */

function mostrarResultados(lista) {

    resultados.innerHTML = "";


    lista.forEach((familia, indice) => {

        const card =
            document.createElement("div");

        card.className =
            "resultado-convidado";


        const nomes = Array.isArray(familia.pessoas)
            ? familia.pessoas
            : [];


        card.innerHTML = `

            <div class="nome-convidado">
                ${escaparHTML(familia.familia)}
            </div>

            <div class="familia-convidado">
                ${nomes
                    .map(nome => escaparHTML(nome))
                    .join(", ")}
            </div>

            <button
                type="button"
                class="botao-selecionar"
                data-indice="${indice}"
            >
                Selecionar
            </button>

        `;


        const botao =
            card.querySelector(
                ".botao-selecionar"
            );


        botao.addEventListener(
            "click",
            function () {

                selecionarFamilia(lista[indice]);

            }
        );


        resultados.appendChild(card);
    });
}


/* =========================================================
   SELECIONAR FAMÍLIA
========================================================= */

function selecionarFamilia(familia) {

    familiaSelecionada = familia;

    mostrarFamilia(familia);
}


/* =========================================================
   MOSTRAR MEMBROS DA FAMÍLIA
========================================================= */

function mostrarFamilia(familia) {

    resultados.innerHTML = "";


    const nomes = Array.isArray(familia.pessoas)
        ? familia.pessoas
        : [];


    /* =====================================================
       TÍTULO
    ===================================================== */

    const titulo =
        document.createElement("div");

    titulo.className =
        "titulo-familia";


    titulo.innerHTML = `

        <h3>
            ${escaparHTML(familia.familia)}
        </h3>

        <p>
            Selecione as pessoas que irão à festa:
        </p>

    `;


    resultados.appendChild(titulo);


    /* =====================================================
       LISTA DE PESSOAS
    ===================================================== */

    const lista =
        document.createElement("div");

    lista.className =
        "lista-familia";


    nomes.forEach((nome) => {

        const item =
            document.createElement("label");

        item.className =
            "membro-familia";


        /* =================================================
           QUADRADINHO
           
           IMPORTANTE:
           NÃO TEM "checked".
           Portanto começa SEMPRE vazio.
        ================================================= */

        item.innerHTML = `

            <input
                type="checkbox"
                class="checkbox-convidado"
                value="${escaparHTML(nome)}"
                data-nome="${escaparHTML(nome)}"
                autocomplete="off"
            >

            <span class="quadradinho"></span>

            <span class="nome-membro">
                ${escaparHTML(nome)}
            </span>

        `;


        const checkbox =
            item.querySelector(
                ".checkbox-convidado"
            );


        /* Garantir que começa vazio */

        checkbox.checked = false;


        lista.appendChild(item);
    });


    resultados.appendChild(lista);


    /* =====================================================
       BOTÕES
    ===================================================== */

    const area =
        document.createElement("div");

    area.className =
        "area-confirmacao";


    area.innerHTML = `

        <button
            type="button"
            class="botao-confirmar"
            id="btnConfirmar"
        >
            Confirmar presença
        </button>

        <button
            type="button"
            class="botao-voltar"
            id="btnVoltar"
        >
            Voltar
        </button>

    `;


    resultados.appendChild(area);


    /* =====================================================
       BOTÃO CONFIRMAR
    ===================================================== */

    document
        .getElementById("btnConfirmar")
        .addEventListener(
            "click",
            confirmarFamilia
        );


    /* =====================================================
       BOTÃO VOLTAR
    ===================================================== */

    document
        .getElementById("btnVoltar")
        .addEventListener(
            "click",
            voltarBusca
        );
}


/* =========================================================
   VOLTAR
========================================================= */

function voltarBusca() {

    resultados.innerHTML = "";

    familiaSelecionada = null;

    if (mensagem) {
        mensagem.textContent = "";
    }

    if (buscaInput) {
        buscaInput.value = "";
        buscaInput.focus();
    }
}


/* =========================================================
   CONFIRMAR PRESENÇA
========================================================= */

async function confirmarFamilia() {

    const selecionados =
        Array.from(
            document.querySelectorAll(
                ".checkbox-convidado:checked"
            )
        );


    /* =====================================================
       NINGUÉM SELECIONADO
    ===================================================== */

    if (selecionados.length === 0) {

        if (mensagem) {
            mensagem.textContent =
                "Selecione pelo menos uma pessoa.";
        }

        return;
    }


    if (!familiaSelecionada) {

        if (mensagem) {
            mensagem.textContent =
                "Família não identificada.";
        }

        return;
    }


    /* =====================================================
       GARANTIR AUTENTICAÇÃO
    ===================================================== */

    if (!auth.currentUser) {

        try {

            await auth.signInAnonymously();

        } catch (erro) {

            console.error(erro);

            if (mensagem) {
                mensagem.textContent =
                    "Não foi possível verificar sua confirmação.";
            }

            return;
        }
    }


    /* =====================================================
       NOMES CONFIRMADOS
    ===================================================== */

    const nomes =
        selecionados.map(
            checkbox =>
                checkbox.dataset.nome
        );


    /* =====================================================
       ID DA FAMÍLIA
    ===================================================== */

    const conviteId =
        String(
            familiaSelecionada.id ||
            familiaSelecionada.familia
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");


    try {

        /* =================================================
           VERIFICAR SE JÁ FOI CONFIRMADO
        ================================================= */

        const documento =
            await db
                .collection("confirmacoes")
                .doc(conviteId)
                .get();


        if (documento.exists) {

            if (mensagem) {
                mensagem.textContent =
                    "Esta família já possui uma confirmação.";
            }

            return;
        }


        /* =================================================
           SALVAR
        ================================================= */

        await db
            .collection("confirmacoes")
            .doc(conviteId)
            .set({

                conviteId: conviteId,

                familia:
                    familiaSelecionada.familia,

                nomes: nomes,

                quantidade:
                    nomes.length,

                confirmado: true,

                dataConfirmacao:
                    firebase.firestore
                        .FieldValue
                        .serverTimestamp(),

                uid:
                    auth.currentUser.uid
            });


        /* =================================================
           SUCESSO
        ================================================= */

        resultados.innerHTML = `

            <div class="confirmacao-sucesso">

                <div class="monograma">
                    Y
                </div>

                <h2>
                    Presença confirmada!
                </h2>

                <p>
                    Obrigada por confirmar sua presença
                    nos meus 15 anos.
                </p>

                <p>
                    Será muito especial ter você
                    comigo nesse momento.
                </p>

            </div>

        `;


        if (mensagem) {
            mensagem.textContent = "";
        }


    } catch (erro) {

        console.error(
            "Erro ao confirmar:",
            erro
        );


        if (mensagem) {
            mensagem.textContent =
                "Não foi possível confirmar a presença. Tente novamente.";
        }
    }
}


/* =========================================================
   VERIFICAR SE UMA PESSOA JÁ CONFIRMOU
========================================================= */

async function verificarConfirmacao(nomePesquisado) {

    const nome =
        normalizarTexto(nomePesquisado);


    try {

        const snapshot =
            await db
                .collection("confirmacoes")
                .get();


        let confirmacaoEncontrada = null;


        snapshot.forEach((doc) => {

            const dados =
                doc.data();


            if (
                !dados.nomes ||
                !Array.isArray(dados.nomes)
            ) {
                return;
            }


            const encontrou =
                dados.nomes.some(
                    pessoa =>
                        normalizarTexto(pessoa) === nome
                );


            if (encontrou) {
                confirmacaoEncontrada = dados;
            }
        });


        return confirmacaoEncontrada;


    } catch (erro) {

        console.error(
            "Erro ao verificar:",
            erro
        );

        return null;
    }
}


/* =========================================================
   EVENTO DE PESQUISA
========================================================= */

if (buscaInput) {

    buscaInput.addEventListener(
        "input",
        buscarConvidados
    );


    buscaInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                buscarConvidados();
            }
        }
    );
}


/* =========================================================
   LIMPAR MENSAGEM AO DIGITAR
========================================================= */

if (buscaInput) {

    buscaInput.addEventListener(
        "input",
        function () {

            if (mensagem) {
                mensagem.textContent = "";
            }

        }
    );
}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Sistema de confirmação dos 15 anos carregado corretamente."
);
