export function calculateFromStatement(statement) {
  // Convert statement to lowercase to handle case insensitivity
  statement = statement.toLowerCase();

  // Replace words with corresponding operators
  statement = statement
    .replace(
      /\bsum\b|\bsum of\b|\bsumof\b|\bplus\b|\badd\b|\baddition\b| \bfrom\b/g,
      "+"
    )
    .replace(
      /\bminus\b|\bsubtract\b|\bsubtraction\b|\bnegative\b|\bremove\b/g,
      "-"
    )
    .replace(
      /\bproduct\b|\bproduct of\b|\bproductof\b|\bmultiply\b|\bmultiplication\b|\btimes\b|\bmultiplied\b/g,
      "*"
    )
    .replace(/\bdivision\b|\bdivide\b|\bdivided\b/g, "/")
    .replace(/,/g, "")
    .replace(/-/g, " - ") // Add spaces around minus for easier splitting
    .replace(/\+/g, " + ")
    .replace(/\*/g, " * ")
    .replace(/\//g, " / ");

  // Split the statement into tokens
  let tokens = statement.split(" ").filter((token) => token);

  // Convert numbers and handle negative numbers
  let numbers = [];
  let operations = [];

  for (let i = 0; i < tokens.length; i++) {
    if (!isNaN(tokens[i])) {
      numbers.push(parseFloat(tokens[i]));
    } else if (tokens[i] === "-") {
      if (i === 0 || (tokens[i - 1] && isNaN(tokens[i - 1]))) {
        // This is a negative number
        numbers.push(parseFloat(tokens[i] + tokens[i + 1]));
        i++;
      } else {
        operations.push(tokens[i]);
      }
    } else if (["+", "*", "/"].includes(tokens[i])) {
      operations.push(tokens[i]);
    }
  }

  // Check for NaN or undefined numbers and return an error if found
  if (numbers.some((num) => isNaN(num) || num === undefined)) {
    return "Invalid numbers in the statement.";
  }

  // Check for empty operations or mismatch in numbers and operations length
  if (operations.length === 0 || numbers.length !== operations.length + 1) {
    return "Invalid operations in the statement.";
  }

  // Perform the calculation
  let result = numbers[0];
  for (let i = 0; i < operations.length; i++) {
    switch (operations[i]) {
      case "+":
        result += numbers[i + 1];
        break;
      case "-":
        result -= numbers[i + 1];
        break;
      case "*":
        result *= numbers[i + 1];
        break;
      case "/":
        result /= numbers[i + 1];
        break;
      default:
        return "Invalid operation detected.";
    }
  }

  // Check for NaN result and return an error if found
  if (isNaN(result)) {
    return "Calculation resulted in an invalid number.";
  }

  return result;
}

//percentage

export function calculatePercentage(statement) {
  // Convert statement to lowercase to handle case insensitivity
  statement = statement.toLowerCase();

  // Replace the word "percent" with "%" for uniformity
  statement = statement.replace(/percent/g, "%");

  // Regular expression to match percentage expressions like "50% of 200"
  const percentageRegex = /(\d+)%\s+of\s+(\d+)/g;

  // Find all matches in the statement
  let matches = [];
  let match;
  while ((match = percentageRegex.exec(statement)) !== null) {
    matches.push({
      percentage: parseFloat(match[1]),
      base: parseFloat(match[2]),
    });
  }

  // If no matches found, return an error
  if (matches.length === 0) {
    return "Error: No valid percentage expressions found in the statement.";
  }

  // Calculate the results for all matches
  let results = matches.map(
    ({ percentage, base }) => (percentage / 100) * base
  );

  // If there's only one result, return it directly
  if (results.length === 1) {
    return results[0];
  }

  // Otherwise, return an array of results
  return results;
}

// Equation

export function solveEquation(equation) {
  let trimmedStatement = equation.split(" ").join("");
  let extracted = [];
  let equationStarted = false;

  for (let i = 0; i < trimmedStatement.length; i++) {
    // Determine if the equation has started, based on finding a digit or a sign with a digit or variable following it
    if (!equationStarted) {
      if (
        /[0-9]/.test(trimmedStatement[i]) ||
        (trimmedStatement[i] === "-" &&
          /[0-9x]/.test(trimmedStatement[i + 1])) ||
        (trimmedStatement[i] === "+" && /[0-9x]/.test(trimmedStatement[i + 1]))
      ) {
        equationStarted = true;
      }
    }

    // Start extracting only after we've determined the equation has started
    if (equationStarted) {
      if (
        /[0-9x]/.test(trimmedStatement[i]) ||
        trimmedStatement[i] === "-" ||
        trimmedStatement[i] === "+"
      ) {
        extracted.push(trimmedStatement[i]);
      }

      // If current character is part of a number/variable and the next is an operator or equals sign, include the operator
      if (
        /[0-9x]/.test(trimmedStatement[i]) &&
        /[+\-=]/.test(trimmedStatement[i + 1])
      ) {
        extracted.push(trimmedStatement[i + 1]);
        i++; // Skip the operator we've already added
      }
    }
  }

  const extractedEquation = extracted.toString().replace(/,/g, "");
  let variableMatch = extractedEquation.match(/[a-zA-Z]/);
  let variable = variableMatch ? variableMatch[0] : null;

  // Split the equation into left and right parts
  const [left, right] = extractedEquation.split("=");

  // Extract coefficients and constants
  let coefficient = 0;
  let constant = 0;

  // Helper function to process a term
  function processTerm(term, isRightSide) {
    let isNegative = term[0] === "-";
    term = term.replace(/-/g, "").replace(/\+/g, "");

    if (term.includes("x")) {
      let coeff = term.replace("x", "");
      coeff = coeff === "" ? 1 : parseFloat(coeff);
      coeff = isNegative ? -coeff : coeff;
      coefficient += isRightSide ? -coeff : coeff;
    } else {
      let value = parseFloat(term);
      value = isNegative ? -value : value;
      constant += isRightSide ? value : -value;
    }
  }

  // Process left side
  const leftTerms = left.match(/[+-]?[^+-]+/g);
  if (leftTerms) leftTerms.forEach((term) => processTerm(term, false));

  // Process right side
  const rightTerms = right.match(/[+-]?[^+-]+/g);
  if (rightTerms) rightTerms.forEach((term) => processTerm(term, true));

  // Solve for x
  if (coefficient === 0) {
    return constant === 0 ? "Infinite solutions" : "No solution";
  }

  const x = constant / coefficient;
  console.log(x);
  return (`${variable} is equal to ${x}`);
}

//statistics

export function solveStatistics(statement) {
  statement = statement.toLowerCase();

  // Determine the type of calculation requested
  let type;
  if (statement.includes("mean")) {
    type = "mean";
  } else if (statement.includes("median")) {
    type = "median";
  } else if (statement.includes("mode")) {
    type = "mode";
  } else if (statement.includes("standard deviation")) {
    type = "standard deviation";
  } else {
    return "Invalid statement. Please specify mean, median, mode, or standard deviation.";
  }

  // Replace the word "and" with a comma and remove other words
  statement = statement.replace(/\band\b/g, ",").replace(/[^0-9.,-]/g, "");

  // Extract the numbers from the statement
  const numberPattern = /[-+]?[0-9]*\.?[0-9]+/g;
  const numbers = statement.match(numberPattern).map(Number);

  // Perform the calculation based on the type
  switch (type) {
    case "mean":
      return { mean: mean(numbers) };
    case "median":
      return { median: median(numbers) };
    case "mode":
      return { mode: mode(numbers) };
    case "standard deviation":
      return { standardDeviation: standardDeviation(numbers) };
  }

  // Function to calculate the mean
  function mean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }

  // Function to calculate the median
  function median(data) {
    const sorted = data.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Function to calculate the mode
  function mode(data) {
    const frequency = {};
    data.forEach((value) => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter((key) => frequency[key] === maxFreq)
      .map((val) => Number(val));
  }

  // Function to calculate the standard deviation
  function standardDeviation(data) {
    const dataMean = mean(data);
    const squaredDiffs = data.map((value) => (value - dataMean) ** 2);
    const avgSquaredDiff = mean(squaredDiffs);
    return Math.sqrt(avgSquaredDiff);
  }
}
