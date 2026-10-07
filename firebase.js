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
// FIREBASE PRONTO
// ==========================================

window.firebasePronto = new Promise(function(resolve) {

  function iniciarFirebase() {

    try {

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      window.db = firebase.firestore();

      firebase.auth()
        .signInAnonymously()
        .then(function() {

          console.log("Firebase conectado com sucesso.");

          resolve(true);

        })
        .catch(function(erro) {

          console.error(
            "Erro no login anônimo:",
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


  function carregarFirestore() {

    const scriptFirestore =
      document.createElement("script");

    scriptFirestore.src =
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";

    scriptFirestore.onload =
      iniciarFirebase;

    scriptFirestore.onerror =
      function() {

        console.error(
          "Erro ao carregar Firestore."
        );

        resolve(false);

      };

    document.head.appendChild(scriptFirestore);

  }


  function carregarAuth() {

    const scriptAuth =
      document.createElement("script");

    scriptAuth.src =
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";

    scriptAuth.onload =
      carregarFirestore;

    scriptAuth.onerror =
      function() {

        console.error(
          "Erro ao carregar Firebase Auth."
        );

        resolve(false);

      };

    document.head.appendChild(scriptAuth);

  }


  const scriptApp =
    document.createElement("script");

  scriptApp.src =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";

  scriptApp.onload =
    carregarAuth;

  scriptApp.onerror =
    function() {

      console.error(
        "Erro ao carregar Firebase."
      );

      resolve(false);

    };

  document.head.appendChild(scriptApp);

});


// ==========================================
// VERIFICAR SE JÁ CONFIRMOU
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
      "Erro ao verificar confirmação:",
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
        erro: "Firebase ainda não está pronto."
      };

    }


    const conviteId =
      String(convite.id);


    const referencia =
      window.db
        .collection("confirmacoes")
        .doc(conviteId);


    // ======================================
    // VERIFICA NOVAMENTE ANTES DE SALVAR
    // ======================================

    const documento =
      await referencia.get();


    // JÁ EXISTE
    if (documento.exists) {

      return {
        sucesso: false,
        jaConfirmado: true
      };

    }


    // ======================================
    // PRIMEIRA CONFIRMAÇÃO
    // ======================================

    await referencia.set({

      conviteId: conviteId,

      familia:
        convite.familia || "",

      pessoas:
        pessoas,

      quantidade:
        pessoas.length,

      confirmadoEm:
        firebase.firestore.FieldValue.serverTimestamp()

    });


    return {
      sucesso: true
    };


  } catch (erro) {

    console.error(
      "Erro ao salvar confirmação:",
      erro
    );


    return {

      sucesso: false,

      erro:
        erro.message ||
        "Não foi possível salvar."

    };

  }

};
