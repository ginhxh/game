const quiz = {
  title: "Anime",
  numQuestions: 5,
  estimatedTime: "5 min",
  difficultyLevel: "Moyen",
  questionTypes: [
    {
      type: "QCM",
      questions: [
        {
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          correctAnswer: "Paris",
          points: 10,
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Saturn"],
          correctAnswer: "Mars",
          points: 10,
        },
      ],
    },
    {
      type: "Vrai/Faux",
      questions: [
        {
          question: "The sun rises in the east.",
          correctAnswer: "True",
          points: 5,
          expline: "because the sun rises in the east",
        },
        {
          question: "Water boils at 50°C.",
          correctAnswer: "False",
          points: 5,
          expline: "because water boils at 100°C, not 50°C",
        },
      ],
    },
    {
      type: "Réponse Textuelle",
      questions: [
        {
          question: "What is the square root of 64?",
          correctAnswer: ["eight", "8", "08"],
          points: 15,
        },
        {
          question: "Who wrote 'Romeo and Juliet'?",
          correctAnswer: ["William Shakespeare", "Shakespeare", "William"],
          points: 15,
        },
      ],
      acceptMultipleVariations: true,
    },
  ],
};

const a = document.querySelector(".a");
const b = document.querySelector(".b");
const c = document.querySelector(".c");
const d = document.querySelector(".d");
const input = document.querySelector(".input");
const submit = document.querySelector(".submit");
const timer = document.querySelector(".timer");
const totalqst = document.querySelector(".totalqst");
const numbreQst = document.querySelector(".numbre-qst");
const qstText = document.querySelector(".qst-text");
const score = document.querySelector(".score");
const next = document.querySelector(".next");
const reset = document.querySelector(".reset");
const typeQst = document.querySelector(".type-qst");
const pointes = document.querySelector(".pointes");
const main = document.querySelector("main");
const divRsltt = document.querySelector(".rslts");
const scorefinal = document.querySelector(".scorefinal");
const totalqstCorrect = document.querySelector(".totalqstCorrect");

let currentScore = 0;
let currentQstIndex = 0;
let currentTypeIndex = 0;
let corrctqstonly = 0;
let timerForqst = 20; // Timer set to 20 seconds per question
let timerInterval; // Declare the timerInterval variable

function showQst() {
  const currentType = quiz.questionTypes[currentTypeIndex];
  const currentQuestion = currentType.questions[currentQstIndex];
  qstText.textContent = currentQuestion.question;
  typeQst.textContent = currentType.type;
  pointes.textContent = currentQuestion.points;
  [a, b, c, d, input, submit].forEach((el) => el.classList.add("dh"));
  score.textContent = currentScore;
  [a, b, c, d].forEach((btn) => {
    btn.disabled = false; // Enable the buttons for the new question
    btn.style.backgroundColor = "gray"; // Reset button color to gray
  });

  // Show the correct options for QCM and Vrai/Faux questions
  if (currentType.type === "QCM") {
    a.classList.remove("dh");
    b.classList.remove("dh");
    c.classList.remove("dh");
    d.classList.remove("dh");
    input.classList.add("dh");
    a.textContent = currentQuestion.options[0];
    b.textContent = currentQuestion.options[1];
    c.textContent = currentQuestion.options[2];
    d.textContent = currentQuestion.options[3];
  } else if (currentType.type === "Vrai/Faux") {
    a.classList.remove("dh");
    b.classList.remove("dh");
    a.textContent = "True";
    b.textContent = "False";
    input.classList.add("dh");
  } else if (currentType.type === "Réponse Textuelle") {
    input.classList.remove("dh");
    submit.classList.remove("dh");
    input.placeholder = "Type your answer here";
  }

  // Disable next button until an answer is provided
  next.disabled = true;

  // Add listeners for answering questions
  accepAnswer();
}

function accepAnswer() {
  const currentQuestion =
    quiz.questionTypes[currentTypeIndex].questions[currentQstIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  // For QCM and Vrai/Faux
  if (
    quiz.questionTypes[currentTypeIndex].type === "QCM" ||
    quiz.questionTypes[currentTypeIndex].type === "Vrai/Faux"
  ) {
    [a, b, c, d].forEach((btn) => {
      btn.addEventListener("click", handleAnswerClick); // Add fresh listener
    });
  } else if (
    quiz.questionTypes[currentTypeIndex].type === "Réponse Textuelle"
  ) {
    submit.addEventListener("click", handleTextAnswer); // Add fresh listener
  }
}

// Handler functions for answer checking
function handleAnswerClick(event) {
  const currentQuestion =
    quiz.questionTypes[currentTypeIndex].questions[currentQstIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  // Disable all options to prevent further clicks
  [a, b, c, d].forEach((btn) => {
    btn.disabled = true; // Disable the button
  });

  // Reset all button colors to gray for unselected options
  [a, b, c, d].forEach((btn) => {
    if (btn !== event.target) {
      btn.style.backgroundColor = "gray"; // Gray for unselected options
    }
  });

  if (event.target.textContent === correctAnswer) {
    event.target.style.backgroundColor = "green"; // Correct answer
    currentScore += currentQuestion.points;
    corrctqstonly++;
  } else {
    event.target.style.backgroundColor = "red"; // Incorrect answer
    // Highlight the correct answer
    [a, b, c, d].forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.style.backgroundColor = "green"; // Correct answer
      }
    });
  }

  // Disable the "Next" button until the color is reset
  next.disabled = false;

  // Stop the timer when an answer is clicked
  clearInterval(timerInterval);

  setTimeout(() => {
    resetOptionColors();
    next.disabled = false; // Enable next button after answer
  }, 1000);
}

function handleTextAnswer() {
  const currentQuestion =
    quiz.questionTypes[currentTypeIndex].questions[currentQstIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  submit.disabled = true;

  if (
    correctAnswer.some(
      (ans) => ans.toLowerCase() === input.value.trim().toLowerCase()
    )
  ) {
    input.style.backgroundColor = "green"; // Correct answer
    currentScore += currentQuestion.points;
    corrctqstonly++;
  } else {
    input.style.backgroundColor = "red"; // Incorrect answer
    // Highlight the correct answer
  }

  setTimeout(() => {
    input.style.backgroundColor = "";
    input.value = "";
    submit.disabled = false;
    next.disabled = false; // Enable next button after text answer
  }, 1000);

  input.classList.add("dh"); // Hide input field after submitting answer
}

function resetOptionColors() {
  [a, b, c, d].forEach((btn) => {
    btn.style.backgroundColor = ""; // Reset button color
  });

  if (input.style.backgroundColor) {
    input.style.backgroundColor = ""; // Reset input color
  }
}

function timeperqst() {
  // Clear any existing timer intervals to avoid multiple intervals running
  clearInterval(timerInterval);

  // Start a new timer for the current question
  timerInterval = setInterval(() => {
    if (timerForqst <= 0) {
      clearInterval(timerInterval); // Clear the timer when time runs out
      nextQST(); // Move to the next question when time runs out
    } else {
      timer.textContent = timerForqst;
      timerForqst--; // Decrease the timer for the next interval
    }
  }, 1000); // Update the timer every second
}

function nextQST() {
  currentQstIndex++;
  timerForqst = 20; // Reset the timer to 20 seconds for the next question

  if (
    currentQstIndex >= quiz.questionTypes[currentTypeIndex].questions.length
  ) {
    currentQstIndex = 0;
    currentTypeIndex++;

    if (currentTypeIndex >= quiz.questionTypes.length) {
      main.classList.add("dh");
      totalqstCorrect.textContent = `You answered ${corrctqstonly} correct out of ${quiz.numQuestions}`;
      scorefinal.textContent = `Your final score is ${currentScore}`;
      divRsltt.classList.remove("dh");
      return; // End the quiz
    }
  }

  showQst(); // Show the next question
  timeperqst(); // Start the timer for the next question
}

reset.addEventListener("click", () => {
  currentScore = 0;
  corrctqstonly = 0;
  currentQstIndex = 0;
  currentTypeIndex = 0;
  showQst();
  timeperqst();
  divRsltt.classList.add("dh");
  main.classList.remove("dh");
  totalqstCorrect.textContent = "";
  scorefinal.textContent = "";
});

next.addEventListener("click", nextQST);
showQst();
timeperqst();
