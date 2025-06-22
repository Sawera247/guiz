// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBd404zvXubn77KN-OoLLiCklVfG0sO9U",
  authDomain: "quiz-b10f2.firebaseapp.com",
  databaseURL: "https://quiz-b10f2-default-rtdb.firebaseio.com", // Important!
  projectId: "quiz-b10f2",
  storageBucket: "quiz-b10f2.appspot.com",
  messagingSenderId: "1061168548048",
  appId: "1:1061168548048:web:74c3f6bb0b1dd71124f6d5",
  measurementId: "G-F03BG4F52K"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ DOM elements
let start = document.querySelector('.start');
let begin = document.querySelector('.begin');
let endPage = document.querySelector('.end');
let endH1 = document.querySelector('.end h1');
let endP1 = document.querySelector('.end p:nth-of-type(1)');
let endBtn = document.querySelector('.end button');
let scoreList = document.querySelector('.score-list');

let score = 0;
let timerTimeout;

// ✅ Start quiz
start.addEventListener('click', function() {
    showMcq(document.querySelector('.mcq1'));
    begin.style.display = "none";
});

// ✅ Show MCQ
function showMcq(mcqDiv) {
    mcqDiv.style.display = 'block';
    startTimer(mcqDiv);
}

// ✅ Timer bar
function startTimer(mcqDiv) {
    let fillBar = mcqDiv.querySelector('.fill');
    fillBar.style.width = '100%';
    fillBar.style.animation = 'none';
    void fillBar.offsetWidth; 
    fillBar.style.animation = 'shrink 10s linear forwards';

    timerTimeout = setTimeout(() => {
        moveToNext(mcqDiv);
    }, 10000);
}

// ✅ Move to next question
function moveToNext(currentMcq) {
    currentMcq.style.display = 'none';
    clearTimeout(timerTimeout);

    let nextMcq = currentMcq.nextElementSibling;
    while (nextMcq && !nextMcq.className.includes('mcq')) {
        nextMcq = nextMcq.nextElementSibling;
    }

    if (nextMcq && nextMcq.className.includes('mcq')) {
        showMcq(nextMcq);
    } else {
        showEnd();
    }
}

// ✅ Show end page + save + fetch scores
function showEnd() {
    endPage.style.display = 'block';

    if (score >= 4) {
        endH1.textContent = "You did a great job!";
    } else if (score >= 2) {
        endH1.textContent = "Not bad!";
    } else {
        endH1.textContent = "Try again!";
    }
    endP1.textContent = `Score: ${score}/5`;
    endBtn.textContent = "Wanna Try Again?";

    // Save to Firebase
    db.ref('scores').push({
        score: score,
        time: new Date().toISOString()
    }).then(() => {
        console.log("Score saved successfully.");
        fetchScores();
    }).catch((err) => {
        console.error("Failed to save score:", err);
    });

    endBtn.addEventListener('click', function() {
        location.reload();
    });
}

// ✅ Fetch + display scores
function fetchScores() {
    db.ref('scores').once('value')
    .then(snapshot => {
        scoreList.innerHTML = '';
        snapshot.forEach(child => {
            const data = child.val();
            console.log("Fetched score:", data);
            let li = document.createElement('li');
            li.textContent = `Score: ${data.score}, Time: ${new Date(data.time).toLocaleString()}`;
            scoreList.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Failed to fetch scores:", err);
    });
}

// ✅ Option click
let allOptions = document.querySelectorAll('ol li');

allOptions.forEach(function(option) {
    option.addEventListener('click', function() {
        let parentOptions = option.parentElement.querySelectorAll('li');
        parentOptions.forEach(function(opt) {
            opt.style.backgroundColor = '';
            opt.style.color = '';
        });

        if (option.classList.contains('correct')) {
            option.style.backgroundColor = 'green';
            option.style.color = 'white';
            score++;
        } else {
            option.style.backgroundColor = 'red';
            option.style.color = 'white';
        }

        clearTimeout(timerTimeout);

        setTimeout(() => {
            moveToNext(option.closest('div'));
        }, 1000);
    });
});
