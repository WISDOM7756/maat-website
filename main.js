import { handleClickDeaf } from "./deafModeHandler.mjs";
import { handleClickMagnify } from "./magnifyHandler.mjs";
import { handleKeyDown, handleKeyUp } from "./promptHandler.mjs";
import { handleClickVoice } from "./voiceSettingHandler.mjs";
import {
  calculateFromStatement,
  calculatePercentage,
  solveEquation,
  solveStatistics,
} from "./arithmetic.mjs";

const mic = document.getElementById("microphone");
const textInput = document.getElementById("text-input");

const voiceSettingBtn = document.getElementById("voice-setting");
const voiceSettingBtnText = document.getElementById("voice-setting-text");
const voiceSettingBtnIcon = document.getElementById("voice-setting-icon");

const magnifierBtn = document.getElementById("magnifier");
const magnifierBtnText = document.getElementById("magnifier-text");
const magnifierBtnIcon = document.getElementById("magnifier-icon");

const deafModeBtn = document.getElementById("deafmode");
const deafModeBtnText = document.getElementById("deafmode-text");
const deafModeBtnIcon = document.getElementById("deafmode-icon");

const setting = document.getElementById("setting");

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const prompt = document.getElementById("prompt");
const workspace = document.getElementById("workspace");

const hints = document.getElementById("hints");

const voiceSelect = document.querySelector("select");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

const isFocused = "focus";
let DeafModeOff = true;
const user = window.localStorage.getItem("user");
let isBusy = false;

const promptQuestion = prompt.value;

const synth = window.speechSynthesis;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

let listeningForKeyword = false;

const keywords = ["hello", "hi", "hey", "yo", "whats up" /* … */];
const grammar = `#JSGF V1.0; grammar keywords; public <keywords> = ${keywords.join(
  " | "
)};`;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let keywordsHTML = "";
keywords.forEach((keyword, i) => {
  keywordsHTML += `<span> ${keyword}, </span>`;
});

let voices = [];
let speechQueue = [];
let isSpeaking = false;

function populateVoiceList() {
  voices = synth.getVoices();

  for (const voice of voices) {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;

    if (voice.default) {
      option.textContent += " — DEFAULT";
    }

    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

const textToSpeech = (element, onEndCallback, retryCount = 0) => {
  if (isSpeaking) {
    speechQueue.push({ element, onEndCallback });
    return;
  }

  isSpeaking = true;
  const utterThis = new SpeechSynthesisUtterance(element);
  const selectedOption =
    voiceSelect.selectedOptions[0].getAttribute("data-name");
  for (const voice of voices) {
    if (voice.name === selectedOption) {
      utterThis.voice = voice;
    }
  }
  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;
  utterThis.onend = () => {
    isSpeaking = false;
    if (onEndCallback) onEndCallback();
    if (speechQueue.length > 0) {
      const next = speechQueue.shift();
      textToSpeech(next.element, next.onEndCallback);
    }
  };

  utterThis.onerror = (event) => {
    console.error(`SpeechSynthesisUtterance.onerror: ${event.error}`);
    isSpeaking = false;
    if (retryCount < 3) {
      setTimeout(() => {
        textToSpeech(element, onEndCallback, retryCount + 1);
      }, 500);
    }
  };

  try {
    synth.speak(utterThis);
  } catch (error) {
    console.error(`speechSynthesis.speak error: ${error}`);
    isSpeaking = false;
    if (retryCount < 3) {
      setTimeout(() => {
        textToSpeech(element, onEndCallback, retryCount + 1);
      }, 500);
    }
  }
  // if (onEndCallback) {
  //   utterThis.onend = onEndCallback;
  // }

  // console.log(utterThis);
  // synth.speak(utterThis);
};

const regex =
  /\bsum\b|\bsum of\b|\bsumof\b|\bplus\b|\badd\b|\bminus\b|\bsubtract\b|[-]|\baddition\b|\bsubtraction\b|\bnegative\b|\bpositive\b|\bproduct\b|\bproduct of\b|\bproductof\b|[*]|\bmultiply\b|\bmultiplication\b|\btimes\b|\bmultiplied\b|\bdivision\b|\bdivide\b|\bdivided\b|[/]|\bfrom\b|\bremove\b/gi;

const hint =
  (hints.innerHTML = `Tap on the microphone at the center of the screen to initiate chat.<br /> On first load you will be asked for your name.<br /> please wait for the beep before speaking to the app.`);
const loadingScreen = document.getElementById("loading-screen");
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  setTimeout(() => {
    loadingScreen.style.display = "none";

    if (prompt.value === "") {
      question.innerText = "Any thing you type or say will show up here";
    } else {
      question.innerText = prompt.value;
    }

    mic.onclick = () => {
      if (user) {
        synth.cancel();
        textToSpeech(`Hello ${user}, what can i do for you?`, () => {
          recognition.start();
        });

        isBusy = false;

        recognition.onresult = (event) => {
          const word = event.results[0][0].transcript;
          prompt.value = word;
          question.innerText = prompt.value;

          const statement = prompt.value;
          if (statement.includes("percentage") || statement.includes("%")) {
            const result = calculatePercentage(statement);
            answer.innerText = `Your answer is ${result}`;
            textToSpeech(answer.innerText);
          } else if (
            statement.includes("equation") ||
            statement.includes("equations") ||
            statement.includes("Equations") ||
            statement.includes("Equation") ||
            statement.includes("solve")
          ) {
            const result = solveEquation(statement);
            answer.innerText = result;
            textToSpeech(answer.innerText);
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
            textToSpeech(answer.innerText);
            console.log(result);
          } else if (statement.includes("change my name")) {
            recognition.stop();
            textToSpeech(`What is your new name?`, () => {
              recognition.start();
            });
            recognition.onresult = (event) => {
              const word = event.results[0][0].transcript;
              window.localStorage.setItem("user", word);
              textToSpeech(`Your new name is ${word}`, () => {
                isBusy = false;
              });
            };

            recognition.onspeechend = () => {
              if (isBusy) {
                recognition.start();
              }
            };

            recognition.onerror = (event) => {
              textToSpeech(
                "I cannot understand you. Please give me a valid name",
                () => {
                  recognition.start();
                }
              );
            };
          } else {
            console.log("ooo");
            const result = calculateFromStatement(statement);
            answer.innerText = `Your answer is ${result}`;
            textToSpeech(answer.innerText);
          }
        };

        recognition.onspeechend = () => {
          workspace.focus();
        };

        recognition.onerror = (event) => {
          textToSpeech(`Error occurred in recognition: ${event.error}`);
        };
      } else {
        synth.cancel();
        isBusy = true;

        textToSpeech("Hello, tell me your name please.", () => {
          recognition.start();
        });

        recognition.onresult = (event) => {
          const word = event.results[0][0].transcript;
          window.localStorage.setItem("user", word);
          textToSpeech(`Your name is ${word}`, () => {
            isBusy = false;
          });
        };

        recognition.onspeechend = () => {
          if (isBusy) {
            recognition.start();
          }
        };

        recognition.onerror = (event) => {
          textToSpeech(
            "I cannot understand you. Please give me a valid name",
            () => {
              recognition.start();
            }
          );
        };
      }
    };

    // if (isBusy === false) {
    //   setTimeout(() => {
    //     readHints;
    //     setInterval(readHints, 60000); // 60 seconds interval
    //   }, 2000);
    // }

    //prompt handler
    handleKeyUp(prompt, question);
    handleKeyDown(prompt, answer, workspace);

    //voice settings
    handleClickVoice(
      voiceSettingBtn,
      voiceSettingBtnText,
      voiceSettingBtnIcon,
      setting,
      isFocused
    );

    // magnifier
    handleClickMagnify(
      magnifierBtn,
      magnifierBtnText,
      magnifierBtnIcon,
      isFocused
    );

    //deafmode
    handleClickDeaf(
      deafModeBtn,
      deafModeBtnText,
      deafModeBtnIcon,
      mic,
      textInput,
      DeafModeOff,
      isFocused,
      synth
    );

    pitch.onchange = () => {
      pitchValue.textContent = pitch.value;
    };

    rate.onchange = () => {
      rateValue.textContent = rate.value;
    };
  }, 5000);
});
