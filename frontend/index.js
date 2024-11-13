import { backend } from "declarations/backend";

const diceContainer = document.getElementById('diceContainer');
const rollButton = document.getElementById('rollButton');
const diceCount = document.getElementById('diceCount');
const historyContainer = document.getElementById('historyContainer');

// Dice face Unicode characters
const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

async function rollDice() {
    try {
        rollButton.disabled = true;
        rollButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Rolling...';
        
        // Clear existing dice
        diceContainer.innerHTML = '<div class="rolling-dice">🎲</div>';
        
        // Get number of dice to roll
        const count = parseInt(diceCount.value);
        
        // Call backend
        const results = await backend.rollDice(count);
        
        // Display results
        displayResults(results);
        
        // Update history
        await updateHistory();
        
        rollButton.disabled = false;
        rollButton.textContent = 'Roll Dice';
    } catch (error) {
        console.error('Error rolling dice:', error);
        rollButton.disabled = false;
        rollButton.textContent = 'Roll Dice';
    }
}

function displayResults(results) {
    diceContainer.innerHTML = '';
    results.forEach(result => {
        const die = document.createElement('div');
        die.className = 'die';
        die.textContent = diceFaces[result - 1];
        diceContainer.appendChild(die);
    });
}

async function updateHistory() {
    try {
        const history = await backend.getHistory();
        historyContainer.innerHTML = '';
        
        history.reverse().forEach((roll, index) => {
            const rollDiv = document.createElement('div');
            rollDiv.className = 'history-item';
            const diceStr = roll.map(die => diceFaces[die - 1]).join(' ');
            rollDiv.textContent = `Roll ${history.length - index}: ${diceStr}`;
            historyContainer.appendChild(rollDiv);
        });
    } catch (error) {
        console.error('Error updating history:', error);
    }
}

rollButton.addEventListener('click', rollDice);

// Initial history load
updateHistory();
