//BlackJack
//by olga 
"use strict"

//card variables
let allTypes = ["hearts", "spades", "diamond", "clubs"];
let allValues = ["Ace", "King", "Queen", "Jack",
    "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let allScores = {
    "Ace": 1,
    "King": 10,
    "Queen": 10,
    "Jack": 10,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
};

//DOM varivariables
let textArea = document.getElementById('text-area');
let hitButton = document.getElementById('hit-me');
let stayButton = document.getElementById('stay');
let newGameButton = document.getElementById('new-game-button');
let gameResultArea = document.getElementById('game-result');

//Game variables
let gameStarted = false,
    gameOver = false,
    playerWin = false,
    playerCards = [],
    dealerCards= [],
    playerScore = 0,
    dealerScore =0,
    deck =[],
    shuffledDeck = []; 



hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

hitButton.addEventListener('click', function() {
    let newCard = getNextCard(shuffledDeck);
    playerCards.push(newCard);
    playerScore = calculateScore(playerCards);
    showStatus(); 
    checkIfsomeoneLost(); 
    if (gameOver) {
        clearGame();
    }
});



stayButton.addEventListener('click', function(){
    dealersMove(); 
    showStatus();  
    checkIfsomeoneLost();
    if (gameOver) {
        clearGame();
     } else {
        checkIfSomeoneWon();
     } 

});


function checkIfsomeoneLost(){
    if (dealerScore > 21){
        gameResultArea.innerText = "You Win!"
        gameOver =true;
          
    } else if (playerScore > 21) {
        gameResultArea.innerText = "Dealer Won"
        gameOver = true;  
    }
}

function checkIfBlackJack() {
    if ((playerScore === 21) || (dealerScore === 21)){
        if ((playerScore === 21) && (dealerScore === 21)){
                gameResultArea.innerText = "Two black Jacks?! What are the odds?"
                clearGame();
                return;
        } else if (playerScore === 21) {
            gameResultArea.innerText = "You Win!"
            clearGame();
            return;
        } else {
            gameResultArea.innerText = "Dealer Won"
            clearGame();
        }
        
    }
}

function checkIfSomeoneWon(){
    if (playerScore > dealerScore) {
        gameResultArea.innerText = "You Win!"
        clearGame();
        return; 
    } else if (dealerScore > playerScore){
        gameResultArea.innerText = "Dealer Won"
        clearGame();
        return;
    }
    gameResultArea.innerText = "This time no one won :("
    clearGame();
}


newGameButton.addEventListener('click', function(){
    gameStarted = true,
    gameOver = false,
    playerWin = false,
    

    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    gameResultArea.innerText = [];

    deck = createDeck(allTypes, allValues)
    shuffledDeck = shuffleDeck(deck);
    playerCards = [getNextCard(shuffledDeck) , getNextCard(shuffledDeck)];
    dealerCards = [getNextCard(shuffledDeck), getNextCard(shuffledDeck)];
    playerScore = calculateScore(playerCards);
    dealerScore = calculateScore(dealerCards);

    showStatus();
    checkIfBlackJack();
});




function createDeck(types, values){
    let deck = []; 
    let currType = null;
    let currValue = null;
    for (let typeInd = 0; typeInd < types.length; typeInd++){
        for (let valueInd = 0; valueInd < values.length; valueInd++){
              currType = types[typeInd];
              currValue = values[valueInd];
              let card ={
                type : currType,
                value : currValue   
              };

              deck.push(card); 
              
        }  
     }
     return deck; 
}

function getNextCard(deck){
    let pickedCard = deck.shift();
    return pickedCard;
}

function shuffleDeck(deck) {
    let deckSize = deck.length;
    let shuffledDeck = [];
    let temp = null;
    for (let i = deckSize - 1; i >= 0; i--){
        let random = Math.ceil((Math.random() * i));
        temp = deck[i];
        let currCard = deck[random];
        shuffledDeck.push(currCard);
        deck[i] = currCard;
        deck[random] = temp;      
    }
    return shuffledDeck;
}

function createTheCardText(card) {
    let cardText = card.value + " of " + card.type;
    return cardText;
};


function showStatus(){
    if (!gameStarted){
        textArea.innerText = "Welcome Mr. S";
        return;
    } 
    // disaplaying players and dealers cards
    let playerCardsText  = [];

    for (let i = 0; i < playerCards.length; i++) {
        playerCardsText += createTheCardText(playerCards[i]) + '\n';
    }

    let dealerCardsText  = [];
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardsText += createTheCardText(dealerCards[i]) + '\n';
    }

    textArea.innerText = "Player has: \n" + playerCardsText 
                        +"Score: " + playerScore + "\n\n"
                        + "Dealer has: \n" + dealerCardsText 
                        +"Score: " + dealerScore + "\n\n";
    
};

function clearGame(){
    gameStarted = false;
    gameOver = false;
    playerWin = false;
    playerCards = [];
    dealerCards= [];
    playerScore = 0;
    dealerScore =0;
    deck =[];
    hitButton.style.display = "none";
    stayButton.style.display= "none";
    newGameButton.style.display ="inline"

}


function calculateScore(hand) {
    let handScore = 0;
    for (let i = 0; i < hand.length; i++ ){
        let currentCardValue = hand[i].value;
        handScore += allScores[currentCardValue];
        if (currentCardValue === "Ace" && (handScore + 10)<= 21){
            handScore += 10;
        }
    }
    return handScore;
};

function dealersMove(){
    while (dealerScore < 18) {
        let newCard = getNextCard(shuffledDeck);
        dealerCards.push(newCard);
        dealerScore = calculateScore(dealerCards); 
    }
}

//console.log("welcome!");
//console.log("Your cards are: " + createTheCardText(playerCards[0]) + " and " + createTheCardText(playerCards[1]));