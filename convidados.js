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
"José Vicente"
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


"Luciene": [
"Luciene",
"Emerson"
],


"Iane": [
"Iane",
"Demilson"
]


};


// ===================================
// CONVIDADOS INDIVIDUAIS
// ===================================


const convidadosIndividuais = [

"Nicole Vitória",
"Laura",
"Ágatha",
"Thauany",
"Maria Aparecida",
"Roberto",
"Silvio",
"Dalva"

];
// ===================================
// BUSCA DO CONVIDADO
// ===================================


const formulario = document.getElementById("formRsvp");

const campoNome = document.getElementById("convidado");

const mensagem = document.getElementById("mensagem");



formulario.addEventListener("submit", function(e){


    e.preventDefault();



    const busca = campoNome.value
        .trim()
        .toLowerCase();



    let listaEncontrada = null;



    // Busca por família ou integrante

    for (const familia in familias){


        const membros = familias[familia];



        if(

            familia.toLowerCase().includes(busca)

            ||

            membros.some(nome =>

                nome.toLowerCase().includes(busca)

            )

        ){


            listaEncontrada = membros;

            break;


        }


    }



    // Busca convidados individuais

    if(!listaEncontrada){


        const individual = convidadosIndividuais.find(nome =>

            nome.toLowerCase().includes(busca)

        );



        if(individual){


            listaEncontrada = [individual];


        }


    }





    // Caso não encontre

    if(!listaEncontrada){


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






    // Mostra lista encontrada

    mensagem.innerHTML = `


    <h3>
    Convite encontrado ✨
    </h3>



    <p>
    Selecione quem irá participar:
    </p>



    ${listaEncontrada.map(nome => `


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



    campoNome.value = "";



});






// ===================================
// CONFIRMAR PRESENÇA
// ===================================


function confirmarPresenca(){


    const selecionados = document.querySelectorAll(

        ".presenca:checked"

    );



    if(selecionados.length === 0){


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





    let nomes = [];



    selecionados.forEach(item => {


        nomes.push(

            item.parentElement.textContent.trim()

        );


    });





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



}
