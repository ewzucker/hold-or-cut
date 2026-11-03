// Connects the game to Firebase. Students are signed in anonymously and
// automatically; the instructor signs in once at index.html#instructor.
(function () {
  "use strict";
  const cfg = window.HOLD_OR_CUT_CONFIG || {};
  const setupNeeded = !cfg.firebase || !cfg.firebase.apiKey || String(cfg.firebase.apiKey).includes("PASTE");

  function showInMain(html) {
    const go = () => { const m = document.getElementById("main"); if (m) m.innerHTML = html; };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  }

  if (setupNeeded) {
    window.claude = { use: async () => null };
    showInMain('<p style="margin:0">This copy of the game isn\'t connected to Firebase yet. Paste your Firebase settings into <code>config.js</code> (see README).</p>');
    return;
  }

  firebase.initializeApp(cfg.firebase);
  const auth = firebase.auth();
  const fs = firebase.firestore();
  fs.settings({ ignoreUndefinedProperties: true });

  const wantsInstructor = () => location.hash === "#instructor";
  const isInstructor = u => !!u && !u.isAnonymous && u.uid === cfg.instructorUid;

  function loginForm(msg) {
    showInMain(`<form id="loginForm" class="stack" style="max-width:420px">
      <h2 style="margin:0">Instructor sign-in</h2>
      <label class="stack" style="gap:6px"><span class="label">Email</span><input id="loginEmail" type="email" autocomplete="username" required></label>
      <label class="stack" style="gap:6px"><span class="label">Password</span><input id="loginPass" type="password" autocomplete="current-password" required></label>
      ${msg ? `<p class="note" style="margin:0">${msg}</p>` : ""}
      <div><button class="primary" type="submit">Sign in</button></div>
      <p class="muted" style="margin:0;font-size:13px">Students don't need to sign in. Send them the link without <code>#instructor</code>.</p>
    </form>`);
    setTimeout(() => {
      const f = document.getElementById("loginForm"); if (!f) return;
      f.onsubmit = async e => {
        e.preventDefault();
        try {
          const cred = await auth.signInWithEmailAndPassword(document.getElementById("loginEmail").value.trim(), document.getElementById("loginPass").value);
          if (!isInstructor(cred.user)) { await auth.signOut(); loginForm("That account isn't the instructor account set in config.js."); return; }
          history.replaceState(null, "", location.pathname);
          location.reload();
        } catch (err) { loginForm("Sign-in failed. Check the email and password."); }
      };
    }, 0);
  }

  // Resolves with the signed-in user once someone is signed in.
  const ready = new Promise(resolve => {
    auth.onAuthStateChanged(async u => {
      if (wantsInstructor() && !isInstructor(u)) { loginForm(); return; }
      if (!u) { try { await auth.signInAnonymously(); } catch (e) { showInMain('<p style="margin:0">The game couldn\'t connect. Reload the page to try again.</p>'); } return; }
      resolve(u);
    });
  });

  // ---- a thin wrapper giving the game the same calls it used on claude.ai ----
  const codeOf = err => (err && err.code === "permission-denied") ? "invalid_argument" : (err && err.code) || "unavailable";
  const wrapErr = e => err => { console.error(err); if (e) e({ code: codeOf(err), message: err.message }); };
  const docSnap = s => ({ id: s.id, exists: s.exists, data: () => s.data(), metadata: s.metadata });
  const querySnap = q => ({ docs: q.docs.map(docSnap), size: q.size, empty: q.empty, docChanges: () => q.docChanges(), metadata: q.metadata });
  const rethrow = p => p.catch(err => { throw { code: codeOf(err), message: err.message }; });

  function docRef(ref) {
    return {
      id: ref.id, path: ref.path,
      get: async () => docSnap(await rethrow(ref.get())),
      set: d => rethrow(ref.set(d)),
      update: d => rethrow(ref.set(d, { merge: true })), // deep-merges nested fields such as subs.<round>
      delete: () => rethrow(ref.delete()),
      onSnapshot: (next, e) => ref.onSnapshot(s => next(docSnap(s)), wrapErr(e)),
      collection: c => colRef(ref.collection(c))
    };
  }
  function query(q) {
    return {
      where: (f, op, v) => query(q.where(f, op, v)),
      orderBy: (f, dir) => query(q.orderBy(f, dir || "asc")),
      limit: n => query(q.limit(n)),
      get: async () => querySnap(await rethrow(q.get())),
      onSnapshot: (next, e) => q.onSnapshot(s => next(querySnap(s)), wrapErr(e))
    };
  }
  function colRef(c) {
    return Object.assign(query(c), {
      path: c.path,
      doc: id => docRef(id ? c.doc(id) : c.doc()),
      add: async d => docRef(await rethrow(c.add(d)))
    });
  }
  const db = { doc: p => docRef(fs.doc(p)), collection: p => colRef(fs.collection(p)) };

  window.claude = {
    use: async name => {
      const u = await ready;
      if (name === "db") return db;
      if (name === "user") return { id: async () => u.uid, isOwner: async () => isInstructor(u) };
      return null;
    }
  };
  window.holdOrCutSignOut = async () => { await auth.signOut(); location.reload(); };
})();
