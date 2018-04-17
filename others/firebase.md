# Firebase

## Initializing a Firebase application

- [Firebase main page](https://firebase.google.com/)
- [Firebase console](https://console.firebase.google.com/)
- Add project
- Add Firebase to your web app

    ```html
    <script src="https://www.gstatic.com/firebasejs/4.12.1/firebase.js"></script>
    <script>
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyAsCl5e-xwQjDvCMYac7NlIunbfNe_bOz8",
        authDomain: "fir-proba-302b2.firebaseapp.com",
        databaseURL: "https://fir-proba-302b2.firebaseio.com",
        projectId: "fir-proba-302b2",
        storageBucket: "fir-proba-302b2.appspot.com",
        messagingSenderId: "356713176229"
    };
    firebase.initializeApp(config);
    </script>
    ```

    This imports every services to your app.

- Further references for getting started:

    * [Getting started (web)](https://firebase.google.com/docs/web/setup)
    * [Web samples](https://firebase.google.com/docs/samples/#web)
    * [API reference](https://firebase.google.com/docs/reference/js/index-all)

- You can inlude only the features you need:

    ```html
    <script src="https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/4.12.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/4.12.0/firebase-firestore.js"></script>
    <script>
        firebase.initializeApp({
            apiKey: 'AIzaSyAsCl5e-xwQjDvCMYac7NlIunbfNe_bOz8',
            authDomain: 'fir-proba-302b2.firebaseapp.com',
            projectId: 'fir-proba-302b2'
        });
    </script>
    ```

Create an `index.html` file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

    <script src="https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js"></script>
    <script src="index.js"></script>
</body>
</html>
```

Create `index.js` file:

```js
firebase.initializeApp({
    apiKey: 'AIzaSyAsCl5e-xwQjDvCMYac7NlIunbfNe_bOz8',
    authDomain: 'fir-proba-302b2.firebaseapp.com',
    projectId: 'fir-proba-302b2'
});
```

## Firestore database

Firestore is a new live database in Firebase, in the long run it will replace the Realtime Database. For new projects Firestore is recommended.

[Getting started with Firestore](https://firebase.google.com/docs/firestore/)

### Preparation

- Firebase console
- Database section
- Enable Firestore
- Add collections and documents ([Firestore data model](https://firebase.google.com/docs/firestore/data-model))
- Add security rule: allow everything ([Firestore security](https://firebase.google.com/docs/firestore/security/get-started?authuser=0))

    ```js
    service cloud.firestore {
        match /databases/{database}/documents {
            match /{document=**} {
                allow read, write;
            }
        }
    }
    ```
    
### Client side code

Include the necessary script imports in `index.html`:

```html
<script src="https://www.gstatic.com/firebasejs/4.12.0/firebase-firestore.js"></script>
```

Initialize Firestore Database in `index.js`:

```js
const db = firebase.firestore();
```

Adding:

```js
db.collection("users").add({
  first: "Ada",
  last: "Lovelace",
  born: 1815
})
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

db.collection("users").add({
  first: "Alan",
  middle: "Mathison",
  last: "Turing",
  born: 1912
})
  .then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

// Add a new document in collection "cities"
db.collection("cities").doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA"
})
.then(function() {
    console.log("Document successfully written!");
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});
```

[Querying](https://firebase.google.com/docs/firestore/query-data/get-data):

```js
// One-time query
db.collection("users").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
});

// Live update
db.collection("users")
  .onSnapshot(function (snapshot) {
    console.log(snapshot);
    snapshot.docChanges.forEach(function (change) {
      if (change.type === "added") {
        console.log("New city: ", change.doc.data());
      }
      if (change.type === "modified") {
        console.log("Modified city: ", change.doc.data());
      }
      if (change.type === "removed") {
        console.log("Removed city: ", change.doc.data());
      }
    });
  });
```

Update:

```js
var cityRef = db.collection('cities').doc('BJ');

var setWithMerge = cityRef.set({
    capital: true
}, { merge: true });

// or

var washingtonRef = db.collection("cities").doc("DC");

// Set the "capital" field of the city 'DC'
return washingtonRef.update({
    capital: true
})
.then(function() {
    console.log("Document successfully updated!");
})
.catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
});
```

Delete:

```js
db.collection("cities").doc("DC").delete().then(function() {
    console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});

// deleting a field

var cityRef = db.collection('cities').doc('BJ');

// Remove the 'capital' field from the document
var removeCapital = cityRef.update({
    capital: firebase.firestore.FieldValue.delete()
});
```

## Authentication

- [Firebase authentication options](https://firebase.google.com/docs/auth/?authuser=0)
- [Firebaseui-web](https://github.com/firebase/firebaseui-web)
- [Firebase UI](https://firebase.google.com/docs/auth/web/firebaseui)

### Preparation

- Firebase console
- Authentication
- Sign-in methods
- Enable Google
- Authorized domain (localhost)

### Client-side draft

```js
ui.start('#firebaseui-auth-container', {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  // Other config options...
});
```


### Client-side code

`index.html`:

```html
<script src="https://www.gstatic.com/firebasejs/4.12.0/firebase-auth.js"></script>
<script src="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.js"></script>
<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.css" />

<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
<div id="container">
  <h3>FirebaseUI Demo</h3>
  <div id="loading">Loading...</div>
  <div id="loaded" class="hidden">
    <div id="main">
      <div id="user-signed-in" class="hidden">
        <div id="user-info">
          <div id="photo-container">
            <img id="photo">
          </div>
          <div id="name"></div>
          <div id="email"></div>
          <div id="phone"></div>
          <div id="is-new-user"></div>
          <div class="clearfix"></div>
        </div>
        <p>
          <button id="sign-out">Sign Out</button>
        </p>
      </div>
      <div id="user-signed-out" class="hidden">
        <h4>You are signed out.</h4>
        <div id="firebaseui-spa">
          <h5>Single Page Application mode:</h5>
          <div id="firebaseui-container"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

`index.js`:

```js
function getUiConfig() {
  return {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccessWithAuthResult': function(authResult, redirectUrl) {
        if (authResult.user) {
          handleSignedInUser(authResult.user);
        }
        if (authResult.additionalUserInfo) {
          document.getElementById('is-new-user').textContent =
              authResult.additionalUserInfo.isNewUser ?
              'New User' : 'Existing User';
        }
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  };
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Disable auto-sign in.
ui.disableAutoSignIn();

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  document.getElementById('user-signed-in').style.display = 'block';
  document.getElementById('user-signed-out').style.display = 'none';
  document.getElementById('name').textContent = user.displayName;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phoneNumber;
  if (user.photoURL){
    var photoURL = user.photoURL;
    // Append size to the photo URL for Google hosted images to avoid requesting
    // the image with its original resolution (using more bandwidth than needed)
    // when it is going to be presented in smaller size.
    if ((photoURL.indexOf('googleusercontent.com') != -1) ||
        (photoURL.indexOf('ggpht.com') != -1)) {
      photoURL = photoURL + '?sz=' +
          document.getElementById('photo').clientHeight;
    }
    document.getElementById('photo').src = photoURL;
    document.getElementById('photo').style.display = 'block';
  } else {
    document.getElementById('photo').style.display = 'none';
  }
};


/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() {
  document.getElementById('user-signed-in').style.display = 'none';
  document.getElementById('user-signed-out').style.display = 'block';
  ui.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) {
  console.log('onauthchange')
  document.getElementById('loading').style.display = 'none';
  document.getElementById('loaded').style.display = 'block';
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Initializes the app.
 */
var initApp = function() {
  document.getElementById('sign-out').addEventListener('click', function() {
    firebase.auth().signOut();
  });
};

window.addEventListener('load', initApp);
```


## Firebase and React

- [Firebase and React](https://github.com/firebase/reactfire#using-the-firebase-js-sdk-in-react)
- [FirebaseUI authentication and React](https://github.com/firebase/firebaseui-web-react)
- [An article on Firebase authentication and React](https://css-tricks.com/firebase-react-part-2-user-authentication/)
