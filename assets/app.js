var questions = new Map();
questions.set("q1", "Who invented the World Wide Web?");
questions.set("q2", "What was the very first Web Browser?");
questions.set("q3", "In formal terms, how many bytes are there in 1 Megabyte?");
questions.set("q4", "What is the telecommunication protocol that all computers must use to be part of the Internet?");
questions.set("q5", "BSD is a Unix-like operating system that was developed and distributed by which university?");

var answers = new Map();
answers.set("q1", ["Tim Berners-Lee @CERN", "Bill Gates @Microsoft", "Steve Jobs @Apple", "A group of scientists @Berkeley"]);
answers.set("q2", ["WorldWideWeb", "Internet Explorer", "Netscape", "Mosaic"]);
answers.set("q3", ["1 x 10^6", "1,048,576", "8000", "2^16"]);
answers.set("q4", ["IP", "HTTP", "WWW", "WiFi"]);
answers.set("q5", ["UC Berkeley", "MIT", "Princeton", "Harvard"]);

var welcome = ["Welcome to technology Trivia", "Test your knowledge on basic tech and computer topics."];

const WAIT_RESULT = 2;      //Seconds to show the result
const WAIT_QUESTION = 2;    //Seconds for timeout
var correct;
var incorrect;
var iterQuestion;           //iterable for questions
var currentQuestion;
var iterAns;                //iterable for answers
var selectLock;             //locks answers click event
var timeout;                //used to cancel the timeout call
var interval;               //controls the timer text of each question


function restart() {
    correct = 0;
    incorrect = 0;
    iterQuestion = questions.entries();
    iterAns = answers.entries();
    selectLock = false;
}
function cleanPanels() {
    $(".card_panel1, .card_panel2").fadeOut(500);

    $(".card_panel2").promise().done(function () {
        $(".trivia_panel2").text("");
    });
}
function initEvents() {
    $(".trivia_start").on("click", function () {
        $(".card_panel1").fadeOut(500, printQuestion);
    });

    $(document).on("click", ".card_panel2", evalAnswer);

    $(document).on("click", ".restart", restartTrivia);

}
function printWelcome() {
    restart();
    // cleanPanels();
    var card = $("<div>");
    card.addClass("card bg-transparent card_panel1");
    var cardBody = $("<div>");
    cardBody.addClass("card-body p-0 text-center card_panel1_body");
    var h4 = $("<h4>");
    h4.addClass("card-title welcome_title");
    h4.text(welcome[0]);

    var p = $("<p>");
    p.addClass("welcome_msg");
    p.text(welcome[1]);
    var btn = $("<button>");
    btn.addClass("btn btn-success trivia_start mb-1");
    btn.text("START");

    cardBody.append(h4).append(p).append(btn);
    card.append(cardBody);
    card.css({ "display": "none" });

    $(".trivia_panel1").append(card);
    $(".card_panel1").fadeIn(1000);
    initEvents();
}
function getAnswer(ans) {
    var card = $("<div>");
    card.addClass("card bg-transparent card_panel2 my-3");
    var cardBody = $("<div>");
    cardBody.addClass("card-body p-0");
    var p = $("<p>");
    p.addClass("card-text btn btn-outline-warning answer");
    p.text(ans);
    card.append(cardBody.append(p));
    card.css({ "display": "none" });

    return card;
}
function printAnswers() {
    //Get the array of answers for that questions
    var arrAns = iterAns.next().value[1];

    //Get the html for each answer
    var htmlAns = [];
    arrAns.forEach(function (ans) {

        htmlAns.push(getAnswer(ans));

    });

    //Print answers in random order
    while (htmlAns.length) {
        var i = Math.floor(Math.random() * htmlAns.length);

        $(".trivia_panel2").append(htmlAns[i]);

        // console.log($(".trivia_panel2"));

        //remove this element from the array
        htmlAns = htmlAns.filter(function (val) {
            // console.log (this);
            // console.log(val != this);
            // var condition = (val != this);
            //I cannot do--> "return val != this"  nor use a boolean variable like --> return myVar; --- JavaScript Bug??
            if (val != this)
                return true;
            else
                return false;

        }, htmlAns[i]);

    }
    $(".card_panel2").toggle(500);

}
function updateSeconds() {



    counter++;
    var seconds = parseFloat($(".timer_seconds").text());
    console.log("Value of seconds is: " + seconds);
    console.log("UpdateSeconds has been called: " + counter + " times");

    $(".timer_seconds").text(--seconds);
}
function printTimer() {

    var info = "Seconds remaining: ";
    var timer = $("<p>");
    timer.addClass("timer text-center mt-3");
    timer.text(info);
    $(".card_panel1_body").append(timer);

    var div = $("<div>").addClass("spinner_wrapper");

    var spinner = $("<i>");
    spinner.addClass("fas fa-spinner fa-pulse fa-5x text-white-50");
    var seconds = $("<span>");
    seconds.addClass("timer_seconds text-danger fa-layers-text fa-inverse");
    seconds.text(WAIT_QUESTION);
    div.append(spinner).append(seconds);

    $(".card_panel1_body").append(div);

    return setInterval(updateSeconds, 1000);
}
function printIncorrect(title) {

    clearInterval(interval);
    selectLock = true;

    $(".card_panel1").fadeOut(1000, function () {
        $(".trivia_panel1").text("");
        var card = $("<div>");
        card.addClass("card bg-transparent card_panel1");
        var cardBody = $("<div>");
        cardBody.addClass("card-body p-0 text-center card_panel1_body");
        var h4 = $("<h4>");
        h4.addClass("card-title result_title text-white bg-danger");
        h4.text(title);

        var info = $("<p>");
        info.addClass("result_info");
        info.text("The correct answer is");

        var ans = $("<span>");
        ans.addClass("card-text bg-info answer w-auto p-2");
        var temp = answers.get(currentQuestion.value[0]);
        ans.text(temp[0]);

        var img = $("<img>").attr("src", "assets/images/" + currentQuestion.value[0] + ".jpg")
            .addClass("img_answer img-fluid mt-4 mx-auto rounded mb-2 ");

        cardBody.append(h4).append(info).append(ans).append(img);
        card.append(cardBody);
        card.css({ "display": "none" });

        $(".trivia_panel1").html(card);
        $(".card_panel1").fadeIn(500);
    })

    setTimeout(function () {

        cleanPanels();
        printQuestion();
    }, (WAIT_RESULT + 1) * 1000);

}
function printCorrect(title) {
    clearInterval(interval);
    selectLock = true;

    $(".card_panel1").fadeOut(1000, function () {
        $(".trivia_panel1").text("");
        var card = $("<div>");
        card.addClass("card bg-transparent card_panel1");
        var cardBody = $("<div>");
        cardBody.addClass("card-body p-0 text-center card_panel1_body");
        var h4 = $("<h4>");
        h4.addClass("card-title result_title text-white bg-success");
        h4.text(title);

        var info = $("<p>");
        info.addClass("result_info");
        info.text("You got this one right");

        var img = $("<img>").attr("src", "assets/images/" + currentQuestion.value[0] + ".jpg")
            .addClass("img_answer img-fluid mt-4 mx-auto rounded mb-2 ");

        cardBody.append(h4).append(info).append(img);
        card.append(cardBody);
        card.css({ "display": "none" });

        $(".trivia_panel1").html(card);
        $(".card_panel1").fadeIn(500);
    })
    setTimeout(function () {
        cleanPanels();
        printQuestion();
    }, (WAIT_RESULT + 1) * 1000);

}
function evalAnswer() {
    if (!selectLock) {
        selectLock = true;
        clearTimeout(timeout);
        // console.log($(this));
        if ($(this).text() === answers.get(currentQuestion.value[0])[0]) {
            correct++;
            $(".card_panel2 p").addClass("btn-danger").removeClass("btn-outline-warning");
            $(this).find("p").addClass("btn-success").removeClass("btn-danger");
            printCorrect("CORRECT!");
        }
        else {
            incorrect++;
            $(this).find("p").addClass("btn-danger").removeClass("btn-outline-warning");
            printIncorrect("INCORRECT!!");
        }
    }
}
function gameOver() {
    var card = $("<div>");
    card.addClass("card bg-transparent card_panel1 bg-outline-primary card_score");
    var cardBody = $("<div>");
    cardBody.addClass("card-body p-0 text-center card_panel1_body");
    var h4 = $("<h4>");
    h4.addClass("card-title result_title bg-primary");
    h4.text("Your score is: ");

    var correctAns = $("<h6>").addClass("score");
    correctAns.text("Correct Answers: " + correct);

    var incorrectAns = $("<h6>").addClass("none");
    incorrectAns.text("Incorrect Answers: " + incorrect);

    var btn = $("<button>").addClass("btn btn-light restart btn-lg mt-5 mb-3").text("Restart Trivia");

    cardBody.append(h4)
        .append(correctAns)
        .append(incorrectAns)
        .append(btn);


    card.append(cardBody);
    card.css({ "display": "none", "position": "relative" });

    $(".card_panel2").promise().done(function () {
        $(".trivia_panel2").toggle("fast");
        $(".trivia_panel1").html(card);
        $(".card_panel1").slideToggle(500);
    });

}
function restartTrivia() {
    restart();
    cleanPanels();
    printQuestion();
}
function printQuestion() {
    currentQuestion = iterQuestion.next();

    //are there more questions?
    if (!currentQuestion.done) {
        var card = $("<div>");
        card.addClass("card bg-transparent card_panel1");
        var cardBody = $("<div>");
        cardBody.addClass("card-body p-0 text-center card_panel1_body");
        var h4 = $("<h4>");
        h4.addClass("card-title question");
        h4.text(currentQuestion.value[1]);
        card.append(cardBody.append(h4));
        card.css({ "display": "none", "position": "relative" });

        //Execute the following when animation on card_panel2 finishes 
        $(".card_panel2").promise().done(function () {
            $(".trivia_panel1").html(card);
            $(".card_panel1").slideToggle(500);
            printAnswers();
            selectLock = false;
            interval = printTimer();
            timeout = setTimeout(printIncorrect, WAIT_QUESTION * 1000, "TIMEOUT!!");
        });
    }
    else {
        gameOver();
    }
}

$(document).ready(function () {

    printWelcome();

});