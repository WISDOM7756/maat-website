hints.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech(hints.textContent);
  }
};

hints.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

question.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech(question.textContent);
  }
};

question.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

answer.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech(answer.textContent);
  }
};

answer.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

workspace.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech(
      "This is your workspace. It contains your question and answer."
    );
  }
};

workspace.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

voiceSettingBtn.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech(
      "Settings button. Click here to change my voice or increase and decrease the speed of my voice"
    );
  }
};

voiceSettingBtn.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

magnifierBtn.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech(
      "Magnify button. Click here to toggle on or off the magnifying glass"
    );
  }
};

magnifierBtn.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

deafModeBtn.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech(
      "Deaf mode button. Click here to enable or disable deaf mode. Remember, deaf mode turns off voice assistant."
    );
  }
};

deafModeBtn.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

microphone.onmouseenter = (e) => {
  e.preventDefault();
  synth.cancel();
  if (DeafModeOff) {
    textToSpeech("Click here to start speaking");
  }
};

microphone.onmouseleave = (e) => {
  e.preventDefault();
  synth.cancel();
};

pitch.onchange = () => {
  pitchValue.textContent = pitch.value;
};

rate.onchange = () => {
  rateValue.textContent = rate.value;
};
