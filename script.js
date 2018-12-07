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
let hitButton = {
    player1 : document.getElementById('hit-me'),
    player2 : document.getElementById('hit-me2')
};
let stayButton = document.getElementById('stay');
let newGameButton = document.getElementById('new-game-button');
let gameResultArea = document.getElementById('game-result');
let splitButton = document.getElementById('split');

//Game variables
let gameStarted = false,
    game1over = false,
    game2over = false,
    gameOver = {
        player1: false,
        player2: false,
        general: false
    },
    playerWin = false,
    cards = {},
    dealerCards= [],
    playerScore = {},
    dealerScore =0,
    deck =[],
    shuffledDeck = [],
    splitmode = false;


hitButton.player1.style.display = 'none';
stayButton.style.display = 'none';
hitButton.player2.style.display = 'none';
splitButton.style.display = 'none';
showStatus();

function clearGameIfNeeded() {
    if (checkIfGameOver()){
        clearGame();
    }
}

function hitMe(playerName) {
    splitButton.style.display = 'none';
    playerScore[playerName] = getNewCardAndCalcScore(cards[playerName]);
    showStatus();
    checkIfBlackJack();
    clearGameIfNeeded();
    checkIfsomeoneLost();
    clearGameIfNeeded();
}
hitButton["player1"].addEventListener('click', function() {
    hitMe("player1");
});

hitButton.player2.addEventListener('click', function() {
    hitMe("player2");
});

function getNewCardAndCalcScore(relevantPlayerCards){
    let newCard = getNextCard(shuffledDeck);
    relevantPlayerCards.push(newCard);
    return calculateScore(relevantPlayerCards);
}

function checkIfGameOver(){
    if (gameOver.player1 && gameOver.player2){
        gameOver.general = true;
    }
    return gameOver.general;
}

stayButton.addEventListener('click', function(){
    dealersMove();
    showStatus();
    checkIfsomeoneLost();
    clearGameIfNeeded();
    checkIfSomeoneWon();
    clearGameIfNeeded();
});


function checkIfsomeoneLost(){
    if (dealerScore > 21) {
        gameResultArea.innerText = "Dealer lost!"
        gameOver.general = true;
        return;
    }

    for (let player in playerScore){
        if (playerScore[player]  > 21 && !gameOver[player]) {
            gameResultArea.innerText += "Dealer Won " + player + "\n";
            hitButton[player].style.display = "none";
            gameOver[player] = true;
        }
    }
}

function checkIfBlackJack() {

    let BJ = {};
    for (let player in playerScore) {
        if (cards[player].length === 2 && playerScore[player] === 21 && !gameOver[player]) {
            BJ[player] = true;
            hitButton[player].style.display ='none';
        }
    }
    if (dealerScore === 21) {
        BJ.dealer = true;
        gameOver.dealer = true;
        for (let player in playerScore){
            gameOver[player] =true;
        }
    }

    for (let player in BJ) {
        gameResultArea.innerText += player + " got BJ! \n\n"
        gameOver[player] =true;
    }
}

function checkIfSomeoneWon() {
    for (let player in cards) {
        if ((dealerScore > playerScore[player]) && !gameOver[player] ){
            gameResultArea.innerText += "Dealer Won " + player;
            gameOver[player] = true;
        } else {
            if ((dealerScore < playerScore[player]) && !gameOver[player] ){
                gameResultArea.innerText += "Dealer lost " + player;
                gameOver[player] = true;
            }
        }
    }
    for (let player in cards) {
        if (!gameOver[player]){
            gameResultArea.innerText = "This time no one won :("
        }
    }
    clearGame();
}


newGameButton.addEventListener('click', function(){
    gameStarted = true,
    gameOver = {
     player1 : false,
     player2 : true,
     general : false
    }

    newGameButton.style.display = 'none';
    hitButton.player1.style.display = 'inline';
    stayButton.style.display = 'inline';
    gameResultArea.innerText = [];

    deck = createDeck(allTypes, allValues)
    shuffledDeck = shuffleDeck(deck);
    cards.player1 = [getNextCard(shuffledDeck) , getNextCard(shuffledDeck)];
    dealerCards = [getNextCard(shuffledDeck), getNextCard(shuffledDeck)];
    playerScore.player1 = calculateScore(cards.player1);
    dealerScore = calculateScore(dealerCards);

    showStatus();
    checkIfBlackJack(playerScore);
    clearGameIfNeeded();

    if (cards.player1[1].value === cards.player1[0].value) {
        splitButton.style.display = 'inline';
    }

});


splitButton.addEventListener('click', function(){
    gameOver.player2 = false;
    hitButton.player2.style.display = 'inline';
    splitButton.style.display = 'none';
    splitmode = true;
    cards.player2 = cards.player1.splice(1);
    playerScore.player1 = calculateScore(cards.player1);
    playerScore.player2  = calculateScore(cards.player2);

    showStatus();
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
    // displaying players and dealers cards
    let dealerCardsText  = "dealer has: \n";
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardsText += createTheCardText(dealerCards[i]) + '\n';
    }
    dealerCardsText += "Score: " + dealerScore + "\n\n";


    let playerCardsText  = [];

    for (let player in cards) {
        playerCardsText += "\n" + player + " has: \n";
        for (let i = 0; i < cards[player].length; i++) {
            playerCardsText += createTheCardText(cards[player][i]) + '\n';
        }
        playerCardsText += "Score: " + playerScore[player] + "\n\n";

    }
    textArea.innerText = playerCardsText + dealerCardsText


    for (let i = 0; i < cards.player1.length; i++) {
        playerCardsText += createTheCardText(cards.player1[i]) + '\n';
    }

};

function clearGame(){
    gameStarted = false;
    gameOver = {
        player1: false,
        player2: true,
        general: false
    };
    playerWin = false;
    splitmode =false;
    cards = {};
    dealerCards= [];
    playerScore = {};
    dealerScore =0;
    splitmode = false;
    deck =[];
    hitButton.player1.style.display = "none";
    stayButton.style.display= "none";
    hitButton.player2.style.display = 'none';
    newGameButton.style.display ="inline"
}

function calculateScore(hand) {
    let aceCounter = 0;
    let handScore = 0;
    for (let i = 0; i < hand.length; i++ ){
        let currentCardValue = hand[i].value;
        if (currentCardValue === "Ace") {
            aceCounter++;
        }
        handScore += allScores[currentCardValue];
    }
    for (let i = 0; i < aceCounter; i++) {
        if (handScore + 10 <= 21){
            handScore += 10;
        } else {
            break;
        }
    }
    return handScore;
};

function dealersMove() {
    while (dealerScore < 17 || (playerScore.player1 >= 17 && getNumberOfPlayers() === 1)) {
        if (dealerScore >= playerScore.player1){
            break;
        }
        let newCard = getNextCard(shuffledDeck);
        dealerCards.push(newCard);
        dealerScore = calculateScore(dealerCards);
        if (dealerScore >= 21 || dealerScore >= playerScore.player1){
            break;
        }
    }
}

function getNumberOfPlayers() {
    let size = 0;
    for (let key in playerScore) {
        if (playerScore.hasOwnProperty(key)) size++;
    }
    return size;
};