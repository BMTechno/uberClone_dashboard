var uid = "";
var price = 0;
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
          if (user==null) {
               window.location.href = "http://uberclone.simcoder.com/login.html";
          }else{
               uid = user.uid;
               getRides();
          }
     });
     document.getElementById("sign-out").addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        firebase.auth().signOut();
        window.location.href = "http://uber.simcoder.com/login.html";
     });
     document.getElementById("payout").addEventListener("click", function(e){
          var recieverEmail = document.getElementById('recieverEmail').value;
          if (recieverEmail.length == 0) {
               alert('email not valid');
               return;
          }
          if(price!=0){
               $.ajax({
                    type: "POST",
                    url: "http://uberclone.simcoder.com/createPayout.php",
                    data:{value: price, email: recieverEmail},
                    success:function(data){
                         console.log(data);
                         if(data != 'SUCCESS'){
                              alert("ERROR -> Couldn't complete transation");
                         }else{
                              alert("payout successful");
                              const driverHistoryDb = firebase.database().ref().child('Users').child('Drivers').child(uid).child('history');
                              driverHistoryDb.once('value').then(function(snapshot) {
                                   for (rideId in snapshot.val()) {
                                        const historyDb = firebase.database().ref().child('history').child(rideId);
                                        historyDb.once('value').then(function(historySnapshot) {
                                             var data = historySnapshot.val();
                                             var customerPaid = data["customerPaid"];
                                             if (customerPaid == true) {
                                                  firebase.database().ref().child('history').child(historySnapshot.key).child('driverPaidOut').set(true);
                                             }
                                        });
                                   }
                              });
                         }
                    }

               });


          }else{
               alert('no money available to payout');
          }

     });


})();
function getRides(){
     const driverHistoryDb = firebase.database().ref().child('Users').child('Drivers').child(uid).child('history');
     driverHistoryDb.once('value').then(function(snapshot) {
          for (rideId in snapshot.val()) {
               const historyDb = firebase.database().ref().child('history').child(rideId);
               historyDb.once('value').then(function(historySnapshot) {
                    var data = historySnapshot.val();
                    var customerPaid = data["customerPaid"];
                    var driverPaidOut = data["driverPaidOut"];
                    var timestamp = data["timestamp"];
                    var distance = data["distance"];
                    var ridePrice = distance * 0.4;

                    var ts = new Date(timestamp*1000);

                    var tbody = document.getElementById("rideHistoryTable");
                    var tr = document.createElement("tr");
                    var th = document.createElement("th");

                    var thScope = document.createAttribute("scope");
                    thScope.value = "row";
                    th.setAttributeNode(thScope);


                    var tdTime = document.createElement("td");
                    var tdCustomerPaid = document.createElement("td");
                    var tdDistance = document.createElement("td");
                    var tdPrice = document.createElement("td");

                    if(driverPaidOut != true && customerPaid != true){
                         tdCustomerPaid.innerHTML = 'Pending';
                         tr.className += 'table-danger';
                    }else if(driverPaidOut != true && customerPaid == true){
                         price += ridePrice;
                         document.getElementById('balance').innerHTML = price;
                         tdCustomerPaid.innerHTML = 'Ready';
                         tr.className += 'table-warning';
                    }else if(driverPaidOut == true && customerPaid == true){
                         tdCustomerPaid.innerHTML = 'Paid';
                         tr.className += 'table-success';
                    }

                    tdTime.innerHTML=ts.toDateString();
                    tdDistance.innerHTML = distance;
                    tdPrice.innerHTML = ridePrice;

                    tr.appendChild(tdTime);
                    tr.appendChild(tdDistance);
                    tr.appendChild(tdPrice);
                    tr.appendChild(tdCustomerPaid);

                    tr.appendChild(th);

                    tbody.appendChild(tr);


               });
          }
     });











}
