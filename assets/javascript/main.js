$(document).ready(function () {
    // Your web app's Firebase configuration

    const firebaseConfig = {
        apiKey: "AIzaSyDzaHDzQVao7jX2_hgIpUr_8nvBbfzTt0g",
        authDomain: "trainscheduler-115e5.firebaseapp.com",
        databaseURL: "https://trainscheduler-115e5.firebaseio.com",
        projectId: "trainscheduler-115e5",
        storageBucket: "trainscheduler-115e5.appspot.com",
        messagingSenderId: "123612980120",
        appId: "1:123612980120:web:8e5380db9de39d34"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    // reference schedule
    const input = function () {
        var name = $("#trainName").val();
        var des = $("#trainDes").val();
        var firstTT = $("#trainFTT").val();
        var freq = $("#trainFreq").val();
        var next = 1;
        var newEntry = { name: name, des: des, firstTT: firstTT, freq: freq, next: next };
        database.ref().push(newEntry);
        $("#trainName").val(""); // clear input
        $("#trainDes").val("");
        $("#trainFTT").val("");
        $("#trainFreq").val("");
    }
    var minAway = function (FRQ, NXT, FTT) {
        var arrTime = moment(FTT, "hh:mm").add(FRQ * NXT, "minutes")
        var now=moment();
        var difference = arrTime.diff(now, "minutes");

        if (difference === 0) {
            return "DUE";
        } else {
            return difference;
        }
    };

    var timeUpdate = function () {
        $("#time").text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    };
    setInterval(timeUpdate, 1000);
    $("#inputSubmit").on("click", function () {
        input();
        console.log("btn clicked!");
    });
    var scheduleUpdate = function () {
        console.log("updated!");

        $("#scheduleList > tbody").empty();
        database.ref().on("child_added", function (childSnap) {
            var key = childSnap.key;
            var childData = childSnap.val();
            console.log(childData);
            //var itemContainer = $("<div>");
            //var trainName = $("<div>");

            var trainName = childData.name;
            //var trainDestination = $("<div>");
            var trainDestination = childData.des;
            //var trainFrequency = $("<div>");
            var trainFrequency = childData.freq;
            var trainArrival = moment(childData.firstTT, "hh:mm").add(childData.freq * childData.next, "minutes").calendar();
            var trainAway = minAway(childData.freq, childData.next, childData.firstTT);
            if (parseInt(trainAway, 10)<=0){
                console.log(trainName+" next train! ")
                childData.next++;
                database.ref(key).update(childData);
            }
            $("#scheduleList > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainArrival + "</td><td>" + trainAway + "</td></tr>");
        });
    };
    setInterval(scheduleUpdate, 1000);

});








