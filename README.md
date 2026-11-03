# The 15.900 Hold or Cut Dilemma

A classroom pricing game that separates greed from fear of greed. Students join by scanning a QR code: no accounts, no sign-in. The instructor runs the game from a console on the same page.

Files:

- `index.html`: the game
- `firebase-adapter.js`: connects the game to Firebase
- `config.js`: your Firebase settings (you fill this in)
- `firestore.rules`: database security rules (you paste these into Firebase)

## One-time setup (about 15 minutes)

### 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and sign in with any Google account.
2. Click **Create a project**. Name it, for example `hold-or-cut`. Google Analytics isn't needed.
3. In the left menu, open **Build → Firestore Database → Create database**. Choose **production mode** and a US location such as `nam5` or `us-east1`.
4. Open **Build → Authentication → Get started**. Under **Sign-in method**, enable **Anonymous** and **Email/Password**.
5. Still in Authentication, open the **Users** tab, click **Add user**, and enter your email and a password. This is your instructor login. Copy the **User UID** shown for it.

### 2. Paste in the security rules

1. Open **Firestore Database → Rules**.
2. Replace everything with the contents of `firestore.rules`.
3. Replace `PASTE_INSTRUCTOR_UID` with the User UID from step 1.5, then click **Publish**.

### 3. Fill in `config.js`

1. Open **Project settings** (gear icon) → **General** → **Your apps**, and click the web icon `</>`. Give it any nickname. Hosting isn't needed.
2. Firebase shows a `firebaseConfig` block. Copy its six values into the matching lines of `config.js`.
3. Replace `PASTE_INSTRUCTOR_UID` in `config.js` with the same User UID.

### 4. Put the site on GitHub Pages

1. On GitHub, create a new **public** repository, for example `hold-or-cut`.
2. Click **Add file → Upload files** and upload `index.html`, `firebase-adapter.js` and `config.js`.
3. Open the repository's **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and click **Save**.
4. After a minute, the site is live at `https://YOUR-USERNAME.github.io/hold-or-cut/`.

### 5. Allow your site to sign people in

In Firebase, open **Authentication → Settings → Authorized domains**, click **Add domain**, and enter `YOUR-USERNAME.github.io`.

## Using it in class

- **Instructor:** the first time on a device, open `https://YOUR-USERNAME.github.io/hold-or-cut/#instructor` and sign in. That device then opens straight into the console.
- **Students:** share `https://YOUR-USERNAME.github.io/hold-or-cut/` or project the QR code from the console. They tap **Join** and play.
- To clear the game after testing, reload the console and choose **Start a new game**.

## Cost and privacy

The free Firebase plan covers a class of this size many times over. Students are anonymous: the database stores a random ID per browser, never a name or email. The Firebase settings in `config.js` are meant to be public. The security rules are what stop students from changing the game or reading one another's entries.
