
const areas = [...document.querySelectorAll('.area')];
const img = document.createElement('img');
const board = document.querySelector('.board');
const endPageElement = document.getElementById('end-page');
const restartButton = document.getElementById('restart-btn');
const scoreReportButton = document.getElementById('score-report-btn');

let trialCount = 0;
let startTime;
const timeTakenArray = []

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');


// Event listener for the start button click
startButton.addEventListener('click', startGame);
// Function to start the game
function startGame() {
  startScreen.style.display = 'none'; // Hide the start screen
  board.style.display = 'grid'; // Show the game board
  run(); // Start the game
}


function run() {
  if (trialCount >= 5) {
    // If x trials are reached, stop further execution
    document.getElementById('end-page').style.display = 'block';
    board.style.display = 'none';;

        // Handle restart button click
    restartButton.addEventListener('click', () => {
      // Reset the trial count and hide the end page
      trialCount = 0;
      endPageElement.style.display = 'none';
      board.style.display = 'grid';
      // Restart the game
      run();
    });

    // Handle score report button click
    scoreReportButton.addEventListener('click', () => {
       // Generate the score report HTML content
       const scoreDetails = generateScoreDetails();
       // Create a new page with the score information
       const newPageContent = `
         <!DOCTYPE html>
         <html>
         <head>
         <link rel="stylesheet" href="scoreReport.css">
         </head>
         <body>
          <div class='score-container' 
            <div class= "header">
               <h1>Score Report</h1>
            </div>
             <div class='score-value'  id="score-details"> ${scoreDetails}
            </div>
           </div>  
        </body>
       </html>
     `;
     // Open the new page in a new window or tab
     const newWindow = window.open('', '_blank');
     newWindow.document.open();
     newWindow.document.write(newPageContent);
     newWindow.document.close();
   });


    return;

  }
  // Choose a random area square
  const i = Math.floor(Math.random() * areas.length);
  const area = areas[i];

  // Setting my prompt icon
  img.classList.add('prompt');
  img.src = 'assets/download.png';

  if (area.contains(img)) {
    area.removeChild(img);}

  // Add the img to the new random area 
  area.appendChild(img);
  // Start the timer when the image appears
  startTime = Date.now();

  trialCount++;

  // Makes it so whenever the prompt icon is clicked, the icon disappears and the function is run again with the icon in a new area
  img.addEventListener('click', () => {
    // Stop the timer when the correct click happens
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    timeTakenArray.push(timeTaken);

    // Remove the img from the current area immediately
    area.removeChild(img);
    // Run the function again after a short delay
    setTimeout(run, 600);
  });

 
  



}

// Call the run() function once to place the initial prompt icon
run();





// Now we need to keep track of all the clicks, to use for a feedback report.
// clickValuesArray will store all the click values, 0 if the user misses the prompt icon and 1 if get it
const clickValuesArray = [];
document.addEventListener('click', function(event) {
  const clickedElement= event.target;
  const clickedValue= clickedElement === img ? 1:0;
  clickValuesArray.push(clickedValue);
})
console.log(clickValuesArray)

function calculateAverage(array) {
  if (array.length === 0) {return 0;  }
  const sum = array.reduce((acc, currentValue) => acc + currentValue, 0);

  const average = sum / array.length;
  const roundedAverage = Number(average.toFixed(3));

  return roundedAverage;
}

function countZeros(array) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === 0) {
      count++;
    }
  }
  return count;
}

function countOnes(array) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === 1) {
      count++;
    }
  }
  return count;
}

function generateScoreDetails() {
  
  return `<p>Array Size: ${areas.length} <p> <p>Number of marks: ${clickValuesArray.length}</p>
  <p>Number of correct marks: ${countOnes(clickValuesArray)}</p>
  <p>Number of Incorrect Marks: ${countZeros(clickValuesArray)}</p>
  <p>Time Taken to Click the correct mark: ${timeTakenArray}</p>  
  <p>Average: ${calculateAverage(clickValuesArray)}</p>`
  ;
}
