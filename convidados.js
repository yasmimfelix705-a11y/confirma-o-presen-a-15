// ===================================
// LISTA DE CONVIDADOS
// RSVP 15 ANOS YASMIM
// ===================================

const familias = {
"Núbia":["Carlos","Núbia","Ana Vitória","Sara"],
"Rosilene":["Rosilene","Rodrigo","Theo"],
"Mara":["Mara","Gilberto"],
"Vanusa":["Vanusa","Marcelo","Estevão","Valentina"],
"Marilene":["Marilene","Warley","Miguel"],
"Lorrane":["Lorrane","Filipe"],
"Rita":["Rita","Otamilson","Bruno"],
"Marlene":["Marlene","Otailson","Maria Eduarda"],
"Nicole":["Nicole","David","Maria Alice","Luís Otávio"],
"Samara":["Samara","Renan","Isabelly","Emanuelly","Eloah"],
"Soraia":["Soraia","Lara","Luna","Laerte"],
"Helen":["Helen","Edson","Isaac"],
"Adiciane":["Adiciane","Júlia"],
"Tânia":["Tânia","Laíse","Luiz Gustavo","Lázaro"],
"Sandra":["Sandra","Wagner","Anna Júlia","Anna Elize"],
"Rafaela":["Rafaela","Lucas","Ana Laura"],
"Joana":["Joana","Luciano","Luiza"],
"Orlinda":["Orlinda","Lúcio Hélio","Ryan"],
"Ezilane":["Ezilane","Maurício","Kauã","Sofia","Isabelly"],
"Fernanda":["Fernanda","Otávio","Benjamin"],
"Claudineia":["Claudineia","Sérgio","Gabriela"],
"Vanuza":["Vanuza","Ilmar","Isabela"],
"Fátima":["Fátima","Fausto"],
"Fabrine":["Fabrine","João Vitor"],
"Janaína":["Janaína","Jó","Nicolas","Sofia"],
"Jéssica":["Jéssica","Heitor","Bryan","Liz"],
"Marisa":["Marisa","Daniel"],
"Tereza":["Tereza","Osvaldo","Rafael","Washington","Michele"],
"Vivian":["Vivian","Hebert"],
"Renata":["Renata","Roberto","Samuel","Maicon","Marlon","João Vicente"],
"Cida":["Cida","José Carlos"],
"Araci":["Araci","Silvio Henrique"],
"Bruna":["Bruna","Agnes"],
"Lúcia":["Lúcia","Márcio"],
"Sônia":["Sônia","Milton"],
"Leandra":["Natan","Leandra","Helena"],
"Paulo Henrique":["Paulo Henrique","Jéssica"],
"Alice":["Alice","Maycon","Liz"],
"Nayara":["Nayara","Junior","Lavínia","Vitória","Helena"],
"Eliane":["Eliane","Zumiro","Miguel"],
"Raíssa":["Raíssa","Leonardo"],
"Iane":["Iane","Demilson"],
"Grete":["Grete","Edimilson"]
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
apiKey:"AIzaSyAYBh_xHUGuEGMjpHEOxBU-Nppc5ymum6g",
authDomain:"yasmim-dc181.firebaseapp.com",
projectId:"yasmim-dc181",
storageBucket:"yasmim-dc181.firebasestorage.app",
messagingSenderId:"773790336369",
appId:"1:773790336369:web:9292e70565a551b4bf22d0",
measurementId:"G-MRCSX5RNGN"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();


// ===================================
// ELEMENTOS
// ===================================

const formulario = document.getElementById("formRsvp");
const campoNome = document.getElementById("convidado");
const mensagem = document.getElementById("mensagem");


// ===================================
// NORMALIZAR
// ===================================

function normalizar(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .toLowerCase()
        .trim();

}


// ===================================
// ID FIXO DO CONVITE
// ===================================

function criarIdConvite(tipo,nome) {

    return normalizar(tipo + "-" + nome)
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"");

}


// ===================================
// AUTENTICAÇÃO
// ===================================

async function garantirAutenticacao() {

    if (!auth.currentUser) {
        await auth.signInAnonymously();
    }

}


// ===================================
// PESQUISAR CONVITE
// ===================================

formulario.addEventListener("submit",async function(e) {

    e.preventDefault();

    const busca = normalizar(campoNome.value);

    if (!busca) return;


    let listaEncontrada = null;
    let tipoConvite = null;
    let nomeConvite = null;


    // ===================================
    // FAMÍLIAS
    // ===================================

    for (const familia in familias) {

        const membros = familias[familia];

        if (
            normalizar(familia).includes(busca) ||
            membros.some(nome =>
                normalizar(nome).includes(busca)
            )
        ) {

            listaEncontrada = membros;
            tipoConvite = "familia";
            nomeConvite = familia;

            break;
        }
    }


    // ===================================
    // INDIVIDUAL
    // ===================================

    if (!listaEncontrada) {

        const individual =
            convidadosIndividuais.find(nome =>
                normalizar(nome).includes(busca)
            );

        if (individual) {

            listaEncontrada = [individual];
            tipoConvite = "individual";
            nomeConvite = individual;

        }
    }


    // ===================================
    // NÃO ENCONTROU
    // ===================================

    if (!listaEncontrada) {

        mensagem.innerHTML = `
        <h3>Convite não encontrado</h3>
        <p>Verifique o nome digitado.</p>
        `;

        return;
    }


    const conviteId =
        criarIdConvite(tipoConvite,nomeConvite);


    window.conviteAtual = {
        id:conviteId,
        tipo:tipoConvite,
        nome:nomeConvite,
        convidados:listaEncontrada
    };


    // ===================================
    // CONSULTAR FIREBASE
    // ===================================

    try {

        await garantirAutenticacao();

        const documento =
            await db
            .collection("confirmacoes")
            .doc(conviteId)
            .get();


        // ===================================
        // JÁ CONFIRMOU
        // ===================================

        if (documento.exists) {

            const dados = documento.data();

            const nomesConfirmados =
                dados.convidados || [];

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

            campoNome.value = "";

            return;
        }


        // ===================================
        // AINDA NÃO CONFIRMOU
        // ===================================

        mensagem.innerHTML = `

        <h3>Convite encontrado ✨</h3>

        <p>Selecione quem irá participar:</p>

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
            id="botaoConfirmar"
            onclick="confirmarPresenca()"
        >
        Confirmar presença
        </button>

        `;

        campoNome.value = "";


    } catch (erro) {

        console.error("Erro ao verificar convite:",erro);

        mensagem.innerHTML = `

        <h3>Não foi possível verificar</h3>

        <p>
        Verifique sua conexão e tente novamente.
        </p>

        `;
    }

});


// ===================================
// CONFIRMAR PRESENÇA
// ===================================

async function confirmarPresenca() {

    const selecionados =
        document.querySelectorAll(".presenca:checked");


    if (selecionados.length === 0) {

        mensagem.innerHTML = `

        <h3>Atenção</h3>

        <p>
        Selecione pelo menos uma pessoa.
        </p>

        `;

        return;
    }


    const botao =
        document.getElementById("botaoConfirmar");


    if (botao) {

        botao.disabled = true;
        botao.innerText = "Confirmando...";

    }


    const nomes = [];

    selecionados.forEach(item => {
        nomes.push(item.value);
    });


    const convite = window.conviteAtual;


    if (!convite) {

        mensagem.innerHTML = `

        <h3>Erro</h3>

        <p>
        Não foi possível identificar o convite.
        </p>

        `;

        return;
    }


    try {

        await garantirAutenticacao();


        const documento =
            db
            .collection("confirmacoes")
            .doc(convite.id);


        // ===================================
        // CRIA A CONFIRMAÇÃO
        // ===================================

        await documento.set({

            conviteId:convite.id,

            tipo:convite.tipo,

            familia:convite.nome,

            convidados:nomes,

            quantidade:nomes.length,

            confirmadoEm:
                firebase.firestore.FieldValue.serverTimestamp()

        });


        // ===================================
        // SUCESSO
        // ===================================

        mensagem.innerHTML = `

        <h3>Presença confirmada 💙</h3>

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

        console.error("Erro ao confirmar:",erro);


        // ===================================
        // JÁ EXISTE
        // ===================================

        if (
            erro.code === "permission-denied" ||
            erro.code === "firestore/permission-denied"
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


        mensagem.innerHTML = `

        <h3>Não foi possível confirmar</h3>

        <p>
        Verifique sua conexão e tente novamente.
        </p>

        `;
    }

}
