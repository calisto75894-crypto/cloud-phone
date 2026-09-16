/* =========================================================
   CLOUD PHONE — CONFIGURAÇÃO DO FIREBASE
   Estas chaves identificam o projeto "CloudPhone" no Firebase.
   O apiKey aqui NÃO é secreto — ele apenas identifica o projeto
   perante o Google; quem realmente protege os dados é a
   configuração de segurança feita no próprio Firebase Console.
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyD2DAklkP1zo9asvqw8oqq6fi71_Baf6X4",
  authDomain: "cloudphone-cc4dd.firebaseapp.com",
  projectId: "cloudphone-cc4dd",
  storageBucket: "cloudphone-cc4dd.firebasestorage.app",
  messagingSenderId: "666169223620",
  appId: "1:666169223620:web:091e77371b4f27b1611c91",
  measurementId: "G-3FE45L57PN"
};

// Inicializa o Firebase com essa configuração
firebase.initializeApp(firebaseConfig);
