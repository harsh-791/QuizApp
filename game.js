console.log("hsbkfb")
const question = document.getElementById("question");
// console.log(question);
const choices = Array.from(document.getElementsByClassName("choice-text"));
// console.log(choices)
let progressText = document.getElementById('progressText'); 
let scoreText = document.getElementById('score');
let progressBarFull = document.getElementById("progressBarFull");
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [
    {
        question: 'Inside which HTML element do we put the JavaScript??',
        choice1: '<script>',
        choice2: '<javascript>',
        choice3: '<js>',
        choice4: '<scripting>',
        answer: 1,
    },
    {
        question:
            "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choice1: "<script href='xxx.js'>",
        choice2: "<script name='xxx.js'>",
        choice3: "<script src='xxx.js'>",
        choice4: "<script file='xxx.js'>",
        answer: 3,
    },
    {
        question: " How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World');",
        choice2: "alertBox('Hello World');",
        choice3: "msg('Hello World');",
        choice4: "alert('Hello World');",
        answer: 4,
    },
];

const CORRECT_BONUS = 10;
const MAX_QUESTION = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
};

function getNewQuestion(){
    if(availableQuestions.length == 0 || questionCounter >= MAX_QUESTION){
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTION}`;
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTION)*100}px`;
    const questionIndex = Math.floor(Math.random()*availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question; 
    
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        // console.log(number);
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    console.log(availableQuestions);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        // console.log(e.target);
        if(!acceptingAnswers)return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        let classToApply = 'incorrect';
        // console.log(selectedAnswer == currentQuestion.answer)
        if(selectedAnswer == currentQuestion.answer){
            classToApply = 'correct';
        }

        if(classToApply == "correct"){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        // console.log(selectedAnswer);
        setTimeout(function(){
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
        
    });
});

function incrementScore(num){
    score += num;
    scoreText.innerText = score;
}

startGame();