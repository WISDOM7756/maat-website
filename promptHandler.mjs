import {
  solveEquation,
  solveStatistics,
  calculateFromStatement,
  calculatePercentage,
} from "./arithmetic.mjs";

export const handleKeyUp = (prompt, question) => {
  prompt.addEventListener("keyup", function (e) {
    // Update the question text based on the prompt value
    if (prompt.value === "") {
      question.innerText = "Any thing you type or say will show up here";
    } else {
      question.innerText = prompt.value;
    }
  });
};

export const handleKeyDown = (prompt, answer, workspace) => {
  prompt.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      workspace.focus();
      const statement = prompt.value;
      if (statement.includes("percentage") || statement.includes("%")) {
        const result = calculatePercentage(statement);
        answer.innerText = `Your answer is ${result}`;
      } else if (
        statement.includes("equation") ||
        statement.includes("equations") ||
        statement.includes("Equations") ||
        statement.includes("Equation") ||
        statement.includes("solve")
      ) {
        const result = solveEquation(statement);
        answer.innerText = result;
      } else if (
        statement.includes("mean") ||
        statement.includes("median") ||
        statement.includes("mode") ||
        statement.includes("variance") ||
        statement.includes("standard deviation")
      ) {
        const result = solveStatistics(statement);
        try {
          for (let key in result) {
            if (result.hasOwnProperty(key)) {
              answer.innerText = key + " is " + result[key];
            }
          }
        } catch (error) {
          answer.innerText = "invalid statement";
        }

        console.log(result);
      } else {
        const result = calculateFromStatement(statement);
        answer.innerText = `Your answer is ${result}`;
      }
    }
  });
};
