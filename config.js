// Firebase web app settings for the "Hold or Cut Game" project.
// These values are meant to be public; the security rules in firestore.rules protect the data.
window.HOLD_OR_CUT_CONFIG = {
  firebase: {
    apiKey: "AIzaSyC0tOVYcwips62KzAJonFf3C6FZ4rq3KHo",
    authDomain: "hold-or-cut-game.firebaseapp.com",
    projectId: "hold-or-cut-game",
    storageBucket: "hold-or-cut-game.firebasestorage.app",
    messagingSenderId: "442162310450",
    appId: "1:442162310450:web:791ca1c7f1c34894617b2b"
  },
  // The User UID of your instructor account (Firebase console → Authentication → Users).
  // It must match the UID in firestore.rules.
  instructorUid: "H1b7On6gEgfVuCNxI75RD0zZXxo1"
};
