const firebaseConfig = {
    apiKey: "AIzaSyAYBh_xHUGuEGMjpHEOxBU-Nppc5ymum6g",
    authDomain: "yasmim-dc181.firebaseapp.com",
    projectId: "yasmim-dc181",
    storageBucket: "yasmim-dc181.firebasestorage.app",
    messagingSenderId: "773790336369",
    appId: "1:773790336369:web:9292e70565a551b4bf22d0",
    measurementId: "G-MRCSX5RNGN"
};


/* ==========================================
   FIREBASE
========================================== */

const scriptApp =
document.createElement("script");

scriptApp.src =
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";

scriptApp.onload = function() {

    const scriptAuth =
    document.createElement("script");

    scriptAuth.src =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";

    scriptAuth.onload = function() {

        const scriptFirestore =
        document.createElement("script");

        scriptFirestore.src =
        "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";

        scriptFirestore.onload = function() {

            iniciarFirebase();

        };

        document.head.appendChild(scriptFirestore);

    };

    document.head.appendChild(scriptAuth);

};

document.head.appendChild(scriptApp);


/* ==========================================
   INICIAR
========================================== */

function iniciarFirebase() {

    try {

        firebase.initializeApp(firebaseConfig);

        window.db =
            firebase.firestore();

        firebase.auth()
            .signInAnonymously()
            .then(function() {

                console.log(
                    "Firebase conectado com sucesso."
                );

            })
            .catch(function(error) {

                console.error(
                    "Erro no login:",
                    error
                );

            });

    }

    catch (error) {

        console.error(
            "Erro ao iniciar Firebase:",
            error
        );

    }

}
