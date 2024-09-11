const easyQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Mars", "Jupiter", "Venus", "Saturn"],
        correctAnswer: 0
    },
    {
        question: "What is the largest mammal?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: 1
    }
];

const mediumQuestions = [
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        correctAnswer: 1
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "Brazil"],
        correctAnswer: 2
    }
];

const hardQuestions = [
    {
        question: "What is the smallest prime number greater than 100?",
        options: ["101", "103", "107", "109"],
        correctAnswer: 1
    },
    {
        question: "Who wrote the play 'Waiting for Godot'?",
        options: ["Samuel Beckett", "Arthur Miller", "Tennessee Williams", "Eugene O'Neill"],
        correctAnswer: 0
    },
    {
        question: "What is the capital of Burkina Faso?",
        options: ["Ouagadougou", "Bamako", "Niamey", "Dakar"],
        correctAnswer: 0
    }
];

let quizData = [];
let currentQuestion = 0;
let score = 0;
let answered = [];
let timeLeft = 30;
let timerInterval;
let username = "";
let difficulty = "";
let userAnswers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBarEl = document.getElementById("progress-bar");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const startScreenEl = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const difficultySelect = document.getElementById("difficulty");
const usernameInput = document.getElementById("username");
const feedbackEl = document.getElementById("feedback");
const leaderboardEl = document.getElementById("leaderboard");
const leaderboardListEl = document.getElementById("leaderboard-list");
const closeLeaderboardBtn = document.getElementById("close-leaderboard");
const showLeaderboardBtn = document.getElementById("show-leaderboard");
const reviewScreenEl = document.getElementById("review-screen");
const reviewQuestionsEl = document.getElementById("review-questions");
const closeReviewBtn = document.getElementById("close-review");

function startQuiz() {
    username = usernameInput.value.trim();
    if (!username) {
        alert("Please enter your name");
        return;
    }
    
    difficulty = difficultySelect.value;
    switch (difficulty) {
        case "easy":
            quizData = easyQuestions;
            break;
        case "medium":
            quizData = mediumQuestions;
            break;
        case "hard":
            quizData = hardQuestions;
            break;
    }
    answered = new Array(quizData.length).fill(false);
    userAnswers = new Array(quizData.length).fill(null);
    startScreenEl.style.display = "none";
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const question = quizData[currentQuestion];
    questionEl.textContent = question.question;

    optionsEl.innerHTML = "";
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("option");
        button.textContent = option;
        button.addEventListener("click", () => selectOption(index));
        if (userAnswers[currentQuestion] === index) {
            button.classList.add(index === question.correctAnswer ? "correct" : "incorrect");
        }
        optionsEl.appendChild(button);
    });

    updateProgressBar();
    updateButtons();
}

function selectOption(index) {
    if (answered[currentQuestion]) return;

    const options = optionsEl.children;
    const correctAnswer = quizData[currentQuestion].correctAnswer;

    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("correct", "incorrect");
        if (i === correctAnswer) {
            options[i].classList.add("correct");
        } else if (i === index) {
            options[i].classList.add("incorrect");
        }
    }

    if (index === correctAnswer) {
        score++;
        showFeedback("Correct!", "#4CAF50");
    } else {
        showFeedback("Incorrect!", "#f44336");
    }

    answered[currentQuestion] = true;
    userAnswers[currentQuestion] = index;
    updateButtons();
    checkQuizCompletion();
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBarEl.innerHTML = `<div class="progress-bar-fill" style="width: ${progress}%"></div>`;
}

function updateButtons() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = currentQuestion === quizData.length - 1 && !answered[currentQuestion];
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? "Finish" : "Next";
}

function checkQuizCompletion() {
    if (answered.every(a => a)) {
        finishQuiz();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectOption(-1); // Force selection of no option
            nextQuestion();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    startTimer();
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
        resetTimer();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    clearInterval(timerInterval);
    resultEl.textContent = `Quiz completed! Your score: ${score}/${quizData.length}`;
    saveScore();
    showLeaderboard();
    showReviewScreen();

    // Change the "Finish" button to "New Game"
    nextBtn.textContent = "New Game";
    nextBtn.disabled = false;
    nextBtn.removeEventListener("click", nextQuestion);
    nextBtn.addEventListener("click", startNewGame);
}

function startNewGame() {
    // Reset all game variables
    currentQuestion = 0;
    score = 0;
    answered = [];
    timeLeft = 30;
    username = "";
    difficulty = "";
    userAnswers = [];

    // Hide review screen and leaderboard
    hideReviewScreen();
    hideLeaderboard();

    // Show start screen
    startScreenEl.style.display = "block";

    // Reset input fields
    usernameInput.value = "";
    difficultySelect.value = "easy";

    // Reset result and progress bar
    resultEl.textContent = "";
    progressBarEl.innerHTML = "";

    // Reset timer display
    timerEl.textContent = "Time left: 30s";

    // Reset next button
    nextBtn.textContent = "Next";
    nextBtn.removeEventListener("click", startNewGame);
    nextBtn.addEventListener("click", nextQuestion);

    // Clear the question and options display
    questionEl.textContent = "";
    optionsEl.innerHTML = "";
}

function showFeedback(message, color) {
    feedbackEl.textContent = message;
    feedbackEl.style.backgroundColor = color;
    feedbackEl.style.display = "block";
    setTimeout(() => {
        feedbackEl.style.display = "none";
    }, 2000);
}

function saveScore() {
    const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
    scores.push({ username, score, difficulty });
    localStorage.setItem("quizScores", JSON.stringify(scores));
}

function showLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
    scores.sort((a, b) => b.score - a.score);

    leaderboardListEl.innerHTML = "";
    scores.slice(0, 10).forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.username} - ${entry.score} (${entry.difficulty})`;
        leaderboardListEl.appendChild(li);
    });

    leaderboardEl.style.display = "block";
}

function hideLeaderboard() {
    leaderboardEl.style.display = "none";
}

function showReviewScreen() {
    reviewQuestionsEl.innerHTML = "";
    quizData.forEach((question, index) => {
        const reviewQuestion = document.createElement("div");
        reviewQuestion.classList.add("review-question");
        
        const questionTitle = document.createElement("h3");
        questionTitle.textContent = `Question ${index + 1}: ${question.question}`;
        reviewQuestion.appendChild(questionTitle);

        const optionsList = document.createElement("ul");
        optionsList.classList.add("review-options");
        question.options.forEach((option, optionIndex) => {
            const optionItem = document.createElement("li");
            optionItem.textContent = option;
            if (optionIndex === question.correctAnswer) {
                optionItem.classList.add("correct");
            }
            if (userAnswers[index] === optionIndex) {
                optionItem.classList.add("selected");
                if (userAnswers[index] !== question.correctAnswer) {
                    optionItem.classList.add("incorrect");
                }
            }
            optionsList.appendChild(optionItem);
        });
        reviewQuestion.appendChild(optionsList);

        reviewQuestionsEl.appendChild(reviewQuestion);
    });

    reviewScreenEl.style.display = "flex";
}

function hideReviewScreen() {
    reviewScreenEl.style.display = "none";
}

prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        resetTimer();
    }
});

nextBtn.addEventListener("click", () => {
    if (nextBtn.textContent === "New Game") {
        startNewGame();
    } else {
        nextQuestion();
    }
});

startBtn.addEventListener("click", startQuiz);

closeLeaderboardBtn.addEventListener("click", hideLeaderboard);

showLeaderboardBtn.addEventListener("click", showLeaderboard);

closeReviewBtn.addEventListener("click", hideReviewScreen);