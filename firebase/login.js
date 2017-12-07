(function(){
  // Initialize Firebase
     var config = {
          apiKey: "AIzaSyD_C6w2Zc24ufn6EPHqE3R7scK_OGEjSIc",
          authDomain: "uberapp-408c8.firebaseapp.com",
          databaseURL: "https://uberapp-408c8.firebaseio.com",
          projectId: "uberapp-408c8",
          storageBucket: "uberapp-408c8.appspot.com",
          messagingSenderId: "887573440989"
     };
     firebase.initializeApp(config);

     firebase.auth().onAuthStateChanged(function(user){
          if(user){
               window.location.href = "http://uberclone.simcoder.com/main.html";
          }
     });

     document.querySelector('#sign-in').addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var email = document.querySelector('#email').value;
          var password = document.querySelector('#password').value;
          firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){

          });
     });
})();
