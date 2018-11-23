// We need an array with all the cards in

let card = document.getElementsByClassName('card');
let cards = [...card];

// deck of all cards in the game
const deck = document.querySelector('.deck');

//declaring the move counter variables;
//and getting the correct part of our HTML
let moves = 0;
let counter = document.querySelector('.moves'); 

//declaring the variable of matched cards
let matchedCard = document.getElementsByClassName('match');

// Modal to appear when the game ends
let modal = document.getElementsByClassName('overlay');

// close icon in our end game modal
let closeIcon = document.querySelector('.close');

// array for open cards
let openedCards = [];

// variables for the game timer
let second = 0;
let minute = 0;
let interval;
let timer = document.querySelector('.timer');

//This toggles open, show and disabled classes. This lets us show the 
//card, disable it whilst it's being shown, and then closing it when we
// inevitably get it wrong.

//Fisher Yates (aka Knuth) Shuffle

let shuffle = function(array){
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random()*currentIndex);
        currentIndex -=1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
//example 
//let array = [1,2,3,4,5];
//currentIndex = 5,
//in the first iteration of the while loop, randomIndex could be 2,
//then currentIndex = 4,
//temporaryIndex = array[4];
//we then swap array[4] with array[2];
//the loop then runs again and we end up with array = [4,1,5,2,3]

window.onload = startGame(); //when the page is loaded, shuffle cards


function startGame(){
    let shuffledCards = shuffle(cards); //our array of cards is shuffled
    for (let i = 0; i<shuffledCards.length;i++){
        deck.innerHTML = '';
        [].forEach.call(shuffledCards,function(item){
            deck.appendChild(item);
        });
        //remove any existing classes
        cards[i].classList.remove('show','open','match','disabled');
    }

    //reset the moves
    moves=0;
    counter.innerHTML = moves;

    //reset the timer
    let timer =document.querySelector('.timer');
    timer.innerHTML = '0 mins 0 secs';
    clearInterval(interval);
}



// We need to add some class to our cards to allow us to display them
function displayCard(){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled")
}

//Add a second event listener to our loop from earlier, and then
//add "opened cards" to an array and check if matched.

function cardOpen(){
    openedCards.push(this);
    if (openedCards.length === 2){
        moveCounter();
        if (openedCards[0].type === openedCards[1].type){
            matched(); //to be defined later
        } else {
            unmatched(); // to be defined later
        }

    }
};


// for when the cards match

function matched(){
    openedCards[0].classList.add('match'); 
    openedCards[1].classList.add('match');
    openedCards[0].classList.remove('show','open'); //keep disabled
    openedCards[1].classList.remove('show','open');
    openedCards=[]; //remove the cards from the openedCards array
};

// for when the cards don't match

function unmatched(){
    openedCards[0].classList.add('unmatched');
    openedCards[1].classList.add('unmatched');
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove('show','open','unmatched');
        openedCards[1].classList.remove('show','open','unmatched')
        enable();
        openedCards = []
    },1500);
}


// disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards,function(card){
        card.classList.add('disabled');
    })
}

//remove the disable class from all cards, but then disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}

//When two cards are selected we want the move counter to go up by one

function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start the timer after the first move
    if (moves==1){
        second=0;
        minute=0;
        startTimer();
    }
}

//Game timer

function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute + 'mins '+ second + 'secs';
        second++;
        if(second === 60){
            minute++;
            second = 0;
        }
    },1000) //rewrites the time every 1000ms (or every second)
}




//a function to display the modal when all cards match

function congratulations(){
    if (matchedCard.length === cards.length){
        clearInterval(interval);
        finalTime = timer.innerHTML;
        //display endgame modal
        modal[0].classList.add("show");
        //show no. of moves and time on modal
        document.getElementById('finalMove').innerHTML = moves;
        document.getElementById('totalTime').innerHTML = finalTime;
        //closeicon on modal
        closeModal();
    }
}


//Close icon on modal
function closeModal(){
    closeIcon.addEventListener('click', function(e){
        modal[0].classList.remove('show');
        startGame();
    })
}
//Allow player to play again
function playAgain(){
    modal[0].classList.remove('show');
    startGame();
}



// We need to add an event listener to every card
// Lets use a loop

for (let i = 0; i < cards.length;i++){
    cards[i].addEventListener('click', displayCard);
    cards[i].addEventListener('click', cardOpen);
    cards[i].addEventListener('click', congratulations);
};









