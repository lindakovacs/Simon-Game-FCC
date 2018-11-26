//variables
payerTurn = [];
simonTurn = [];
const NUM_OF_LEVELS = 20;
var id, color, level = 0;
var strict = false;
var error = false;
var gameOn = false //switch to turn game on or off
var boardSound = [
    "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", //green
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", //red
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", //yellow
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" //blue
];

//start board sequence
$(document).ready(function () {
    $(".display").text("");
    //listener for switch button
    $(".switch").click(function () {
        gameOn = (gameOn === false) ? true : false;
    // console.log(gameOn);
        if (!gameOn) {
            $(".inner-switch").removeClass("inner-inactive");
            $(".switch").removeClass("outter-active");
            $(".display").text("");
            strict = false;
            error = false;
        }
        else {
            $(".inner-switch").addClass("inner-inactive");
            $(".switch").addClass("outter-active");
            $(".display").text("00");
            resetGame();
        }
    })

    //start game
    $(".start").click(function () {
        if (gameOn) {
            strict = false;
            error = false;
            level = 0;
            level++;
            simonTurn = []
            payerTurn = [];
            simonSequence();
        }
        else {
            $(".inner-switch").removeClass("inner-inactive");
            $(".switch").removeClass("outter-active");
            $(".display").text("");
        }
    })

    //user pad listener
    $(".pad").click(function () {
        id = $(this).attr("id");
        color = $(this).attr("class").split(" ")[1];
        playerSequence();
    });

    //strict mode listener
    $(".strict").click(function () {
        if (gameOn) {
            level = 0;
            level++;
            simonTurn = []
            payerTurn = [];
            strict = true;
            simonSequence();
        }
    })
})

//user sequence
function playerSequence() {
    payerTurn.push(id);
    console.log(id + " " + color);
    addClassSound(id, color);
    //check user sequence
    if (!checkPayerTurn()) {
        //if playing strict mode reset everything lol
        if (strict) {
            console.log("strict");
            simonTurn = [];
            level = 1;
        }
        error = true;
        displayError();
        payerTurn = [];
        simonSequence();
    }
    //checking end of sequence
    else if (payerTurn.length == simonTurn.length && payerTurn.length < NUM_OF_LEVELS) {
        level++;
        payerTurn = [];
        error = false;
        console.log("start simon")
        simonSequence();
    }
    //checking for winners
    if (payerTurn.length == NUM_OF_LEVELS) {
        displayWinner();
        resetGame();
    }

}

// simon sequence
function simonSequence() {
    console.log("level " + level);
    $(".display").text(level);
    if (!error) {
        getRandomNum();
    }
    if (error && strict) {
        getRandomNum();
    }
    var i = 0;
    var myInterval = setInterval(function () {
        id = simonTurn[i];
        color = $("#" + id).attr("class");
        color = color.split(" ")[1];
        console.log(id + " " + color);
        addClassSound(id, color);
        i++;
        if (i == simonTurn.length) {
            clearInterval(myInterval);
        }
    }, 1000);
}

//generate random number
function getRandomNum() {
    var random = Math.floor(Math.random() * 4);
    simonTurn.push(random);
}

// add temporary class and sound
function addClassSound(id, color) {
    $("#" + id).addClass(color + "-active");
    playSound(id)
    setTimeout(function () {
        $("#" + id).removeClass(color + "-active");
    }, 500);
}

// checking user seq against simon's
function checkPayerTurn() {
    for (var i = 0; i < payerTurn.length; i++) {
        if (payerTurn[i] != simonTurn[i]) {
            return false;
        }
    }
    return true;
}

// display error
function displayError() {
    console.log("error");
    var counter = 0;
    var myError = setInterval(function () {
        $(".display").text("Err");
        counter++;
        if (counter == 3) {
            $(".display").text(level);
            clearInterval(myError);
            payerTurn = [];
            counter = 0;
        }
    }, 500);
}

//display winner
function displayWinner() {
    var count = 0;
    var winInterval = setInterval(function () {
        count++;
        $(".display").text("Win");
        if (count == 5) {
            clearInterval(winInterval);
            $(".display").text("00");
            count = 0;
        }
    }, 500);
}

// play board sound
function playSound(id) {
    var sound = new Audio(boardSound[id]);
    sound.play();
}

// reset game
function resetGame() {
    payerTurn = [];
    simonTurn = [];
    level = 0;
    $(".display").text("00");
}