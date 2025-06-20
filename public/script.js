let start = document.querySelector('.start');
let begin = document.querySelector('.begin');
let mcq1 = document.querySelector('.mcq1');
let endPage = document.querySelector('.end');
let endH1 = document.querySelector('.end h1');
let endP1 = document.querySelector('.end p:nth-of-type(1)');
let endBtn = document.querySelector('.end button');

let score = 0;

start.addEventListener('click', function(){
    mcq1.style.display = "block";
    begin.style.display = "none";
});

let allOptions = document.querySelectorAll('ol li');

allOptions.forEach(function(option){
    option.addEventListener('click', function(){
        let parentOptions = option.parentElement.querySelectorAll('li');
        parentOptions.forEach(function(opt){
            opt.style.backgroundColor = '';
            opt.style.color = '';
        });

        if(option.classList.contains('correct')){
            option.style.backgroundColor = 'green';
            option.style.color = 'white';
            score++;
        } else {
            option.style.backgroundColor = 'red';
            option.style.color = 'white';
        }

        let currentMcq = option.closest('div');
        let nextMcq = currentMcq.nextElementSibling;

        setTimeout(function(){
            currentMcq.style.display = 'none';

            if(nextMcq && nextMcq.className.includes('mcq')){
                nextMcq.style.display = 'block';
            } else {
                endPage.style.display = 'block';

                if(score >= 4){
                    endH1.textContent = "You did a great job!";
                } else if(score >= 2){
                    endH1.textContent = "Not bad!";
                } else {
                    endH1.textContent = "Try again!";
                }

                endP1.textContent = `Score: ${score}/5`;
                endBtn.textContent = "Wanna Try Again?";

                endBtn.addEventListener('click', function(){
                    location.reload();
                });
            }
        }, 1000);
    });
});
