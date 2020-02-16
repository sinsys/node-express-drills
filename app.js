const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

// Challenge 1
app.use('/sum', (req, res) => {

  // Validate our values and ensure we got one for each
  if(!req.query.a) {
    return res
          .status(400)
          .send('You must supply a query value for a');
  }

  if(!req.query.b) {
    return res
          .status(400)
          .send('You must supply a query value for b');
  }

  // Parse our our query parameter strings to be integers
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  // Construct the message and add the values together
  const msg = `The sum of ${a} and ${b} is ${a+b}`;
  res
    .status(200)
    .send(msg);
})

// Challenge 2
app.use('/cipher', (req, res) => {

  // Validate our values and ensure we got one for each
  if( !req.query.text ) {
    return res
      .status(400)
      .send('You must supply a text query value!');
  };

  if( !req.query.shift ) {
    return res
      .status(400)
      .send('You must supply a shift query value!');
  };

  // Define our consts for conversion
  // We decodeURIComponent to ensure user can use spaces and special characters in their query
  // While testing, you can use the following as a text query parameter to test out a lot of special characters
  /* 
  %E1%B6%98%20get%20%E1%B6%99%E1%B6%9A%E1%B6%B8%20a%20%E1%B5%AF%E1%B5%B0%E1%B5%B4%20real%20%E1%B5%B6%E1%B5%B9%E1%B5%BC%20output%20%E1%B5%BD%E1%B5%BE%E1%B5%BF
  */
  const text = decodeURIComponent(req.query.text);

  const shift = parseInt(req.query.shift);
  // Expected shift = 4

  // Ensure that they actually provided an integer for their shift query value
  if( Number.isNaN(shift) ) {
    return res
      .status(400)
      .send('The shift query value must be a number!');
  }

  // Convert the string to an array
  const textSplit = text.split('');
  // Expected text = ['F', 'O', 'o', ' ', 'B', 'a', 'R']

  const convertCharCodes = textSplit.map((letter => {

    // Identify the letter code for each letter in the array
    const letterCode = letter.charCodeAt(0);

    // Establish floor and ceil variables
    let floor, ceil;

    // Identify if the letter is lowercase a-z
    if( letterCode >= 97 && letterCode <= 122 ) {
      floor = 'a'.charCodeAt(0);
      ceil = 'z'.charCodeAt(0);
    // Identify if the letter is uppercase A-Z
    } else if ( letterCode >= 65 && letterCode <= 90) {
      floor = 'A'.charCodeAt(0);
      ceil = 'Z'.charCodeAt(0);
    // Letter is not a-z or A-Z so just return the character code
    } else {
      return letter;
    }

    // Find the real shift from the floor (+ or - away)
    // We use modulus to ensure it does not exceed -25 or 25 original letter code
    let letterShift = (letterCode - floor + shift) % 26;

    let finalCode;
    ( letterShift >= 0 )
      // If it is positive or 0, add the shift to our floor
      ? finalCode = floor + letterShift
      // If it is negative, add the negative number to our ceil
      // We add the +1 because negative shifts end up -1 of true charCode
      : finalCode = ceil + letterShift + 1;

    // Return the actual character we desire
    return String.fromCharCode(finalCode);
  }))
  
  // Construct the message by joining all returned characters from our previous map
  const msg = `Our converted message is: ${convertCharCodes.join('')}`;

  res
    .status(200)
    .send(msg);
});

// Drill 3
app.get('/lotto', (req, res) => {

  // Validate a numbers query param was provided
  if( !req.query.numbers ) {
    return res
      .status(400)
      .res('You must provide a numbers query value!');
  }

  // Make sure that numbers is an array
  if( !Array.isArray(req.query.numbers )) {
    return res
      .status(400)
      .send('You must provide a numbers array!');
  };

  // Gather our provided numbers array
  const numbers = req.query.numbers;

  // Add any values for numbers that are integers between 1-20
  const queryNums = numbers
    .map((number =>
      parseInt(number)
    ))
    .filter((number =>
      !Number.isNaN(number) &&
      number >= 1 &&
      number <= 20
    ));

  // We need to check that we have exactly 6 numbers
  if( queryNums.length !== 6 ) {
    return res
      .status(400)
      .send(`You need exactly 6 numbers in your numbers array. You have ${queryNums.length} numbers!`)
  };

  // Our query params look good. Let's roll!

  // Function to create an array with 6 random numbers from a min, max argument (called with 1, 20)
  const makeRandomArray = (min, max) => {
    // Create a base array for all numbers between set min and max
    const arrVals = Array(max)
                    .fill(min)
                    .map((_, i) =>
                      i + 1
    )
    // Set up a temporary array to store our 6 random winning numbers
    const tempArr = [];

    // Loop through our base array
    for( let i=0; i<6; i++ ) {
      // Define a random number based on the base array's length
      const randomNum = Math.floor(Math.random() * arrVals.length);
      // Add that number to our temporary winning numbers array
      tempArr.push(arrVals[randomNum]);
      // Remove that number from our base array so it cannot be selected again
      arrVals.splice(randomNum, 1);
    }
    // Return our 6 winning numbers and sort them numerically (easier to read)
    return tempArr.sort(
      (a, b) => a - b
    );
  }

  // Actually pass in our arguments to make our winning numbers array
  const winningNumbers = makeRandomArray(1, 20);

  // Compare our query param numbers with the winning numbers
  const matchedNums = winningNumbers.filter((number) => {
    return (
      // Return the value if our query included the same number as the winning numbers
      queryNums.includes(number)
    )
  });

  // Define a response message
  let msg;

  switch( matchedNums.length ) {
    case 0:
      msg = `You didn't match a single number... Don't go to Vegas...`;
      break;
    case 4:
      msg = `You matched (${matchedNums.join(', ')}) to the winning numbers! You win a free ticket!`;
      break;
    case 5:
      msg = `You matched (${matchedNums.join(', ')}) to the winning numbers! You win $100.00!`;
      break;
    case 6:
      msg = `Unbelievable! You matched (${matchedNums.join(', ')}) to the winning numbers! You win the mega millions!`;
      break;
    default:
      msg = `You only matched (${matchedNums.join(', ')}) to the winning numbers. Better luck next time!`;
  }

  // Let the user know what their selected numbers and the winning numbers were
  const viewNums = `
    Your selected numbers were:\n(${queryNums.join(' - ')})
    The winning numbers were:\n(${winningNumbers.join(' - ')})
  `;
  
  res
    .status(200)
    .send(msg + viewNums);
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});