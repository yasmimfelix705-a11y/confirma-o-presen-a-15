// ==========================================
// CONFIGURAÇÃO DO FIREBASE
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


// ==========================================
// INICIALIZAÇÃO
// ==========================================

window.firebasePronto = new Promise(function(resolve) {

  function iniciar() {

    try {

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      window.db = firebase.firestore();

      firebase.auth()
        .signInAnonymously()
        .then(function() {

          console.log("Firebase conectado.");

          resolve(true);

        })
        .catch(function(erro) {

          console.error(
            "Erro no login:",
            erro
          );

          resolve(false);

        });

    } catch (erro) {

      console.error(
        "Erro ao iniciar Firebase:",
        erro
      );

      resolve(false);

    }

  }


  const app =
    document.createElement("script");

  app.src =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";


  app.onload = function() {

    const auth =
      document.createElement("script");

    auth.src =
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";


    auth.onload = function() {

      const firestore =
        document.createElement("script");

      firestore.src =
        "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";


      firestore.onload =
        iniciar;


      document.head.appendChild(
        firestore
      );

    };


    document.head.appendChild(
      auth
    );

  };


  document.head.appendChild(
    app
  );

});


// ==========================================
// VERIFICAR CONFIRMAÇÃO
// ==========================================

window.verificarConfirmacao =
async function(conviteId) {

  try {

    const pronto =
      await window.firebasePronto;

    if (!pronto || !window.db) {

      return false;

    }


    const referencia =
      window.db
        .collection("confirmacoes")
        .doc(String(conviteId));


    const documento =
      await referencia.get();


    return documento.exists;

  } catch (erro) {

    console.error(
      "Erro ao verificar:",
      erro
    );

    return false;

  }

};


// ==========================================
// SALVAR CONFIRMAÇÃO
// ==========================================

window.salvarConfirmacao =
async function(convite, pessoas) {

  try {

    const pronto =
      await window.firebasePronto;


    if (!pronto || !window.db) {

      return {
        sucesso: false,
        erro: "Firebase não está pronto."
      };

    }


    const conviteId =
      String(convite.id);


    const referencia =
      window.db
        .collection("confirmacoes")
        .doc(conviteId);


    // ======================================
    // TRANSAÇÃO
    // ======================================

    await window.db.runTransaction(
      async function(transaction) {


        const documento =
          await transaction.get(
            referencia
          );


        // ==================================
        // JÁ EXISTE
        // ==================================

        if (documento.exists) {

          throw new Error(
            "JA_CONFIRMADO"
          );

        }


        // ==================================
        // PRIMEIRA CONFIRMAÇÃO
        // ==================================

        transaction.set(
          referencia,
          {

            conviteId:
              conviteId,

            familia:
              convite.familia || "",

            pessoas:
              pessoas,

            quantidade:
              pessoas.length,

            confirmadoEm:
              firebase.firestore
                .FieldValue
                .serverTimestamp()

          }
        );

      }
    );


    return {
      sucesso: true
    };


  } catch (erro) {


    console.error(
      "Resultado da confirmação:",
      erro
    );


    // ======================================
    // JÁ CONFIRMADO
    // ======================================

    if (
      erro.message ===
      "JA_CONFIRMADO"
    ) {

      return {

        sucesso: false,

        jaConfirmado: true

      };

    }


    return {

      sucesso: false,

      erro:
        erro.message ||
        "Erro ao confirmar."

    };

  }

};
