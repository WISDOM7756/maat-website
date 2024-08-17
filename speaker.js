// microphone.onclick = () => {
//   synth.cancel();
  
//   textToSpeech("Ready to receive a command.");
//   prompt.value = "";
// };

recognition.onresult = (event) => {
  const word = event.results[0][0].transcript;
  prompt.value = word;
  question.innerText = prompt.value;

  const statement = prompt.value;
  if (statement.includes("percentage") || statement.includes("%")) {
    const result = calculatePercentage(statement);
    answer.innerText = `Your answer is ${result}`;
    textToSpeech(answer.innerText);
  } else {
    const result = calculateFromStatement(statement);
    answer.innerText = `Your answer is ${result}`;
    textToSpeech(answer.innerText);
  }
  //   console.log(`Confidence: ${event.results[0][0].confidence}`);
};

recognition.onspeechend = () => {
  recognition.stop();
  workspace.focus();
};

// recognition.onnomatch = (event) => {
//   textToSpeech("I didn't recognize that color.");
// };

recognition.onerror = (event) => {
  textToSpeech(`Error occurred in recognition: ${event.error}`);
};
