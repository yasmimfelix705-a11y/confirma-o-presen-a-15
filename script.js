// ===================================
// ABRIR CONVITE
// ===================================


function abrirConvite() {


    const loading = document.getElementById("loading");

    const site = document.getElementById("site");


    // anima o envelope fechando

    loading.classList.add("fechar");



    setTimeout(() => {


        loading.style.display = "none";


        site.classList.add("ativo");


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });



    }, 1000);



}





// ===================================
// CONTADOR
// 05 DE DEZEMBRO ÀS 20:00
// ===================================


function atualizarContador() {


    const dataFesta = new Date();


    dataFesta.setMonth(11); // Dezembro

    dataFesta.setDate(5);

    dataFesta.setHours(20);

    dataFesta.setMinutes(0);

    dataFesta.setSeconds(0);



    const agora = new Date();



    const diferenca = dataFesta - agora;



    if (diferenca <= 0) {


        document.getElementById("dias").innerHTML = "00";

        document.getElementById("horas").innerHTML = "00";

        document.getElementById("minutos").innerHTML = "00";

        document.getElementById("segundos").innerHTML = "00";


        return;


    }



    const dias = Math.floor(

        diferenca /

        (1000 * 60 * 60 * 24)

    );



    const horas = Math.floor(

        (diferenca %

        (1000 * 60 * 60 * 24))

        /

        (1000 * 60 * 60)

    );



    const minutos = Math.floor(

        (diferenca %

        (1000 * 60 * 60))

        /

        (1000 * 60)

    );



    const segundos = Math.floor(

        (diferenca %

        (1000 * 60))

        /

        1000

    );



    document.getElementById("dias").innerHTML =
        String(dias).padStart(2,"0");



    document.getElementById("horas").innerHTML =
        String(horas).padStart(2,"0");



    document.getElementById("minutos").innerHTML =
        String(minutos).padStart(2,"0");



    document.getElementById("segundos").innerHTML =
        String(segundos).padStart(2,"0");



}



// atualiza a cada segundo

setInterval(atualizarContador,1000);


atualizarContador();





// ===================================
// ANIMAÇÕES AO ROLAR A PÁGINA
// ===================================


const elementos = document.querySelectorAll(

    ".card, .card-rsvp, .caixa"

);



const observar = new IntersectionObserver(

(entries) => {


    entries.forEach(entry => {


        if(entry.isIntersecting){


            entry.target.classList.add("mostrar");


        }


    });


},

{

    threshold:0.2

}



);



elementos.forEach(elemento => {


    observar.observe(elemento);


});
