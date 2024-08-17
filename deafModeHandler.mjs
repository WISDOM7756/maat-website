export const handleClickDeaf = (element, elementText, elementIcon, mic, input, DeafModeOff, isFocused, synth) => {
    element.addEventListener("click", (e) => {
        e.preventDefault();
        if (element.classList.contains(`${isFocused}`)) {
          element.classList.remove(`${isFocused}`);
          element.classList.remove(`${isFocused}`);
          elementText.classList.remove("hidden");
          elementIcon.classList.remove("toggled");
      
          DeafModeOff = true;
      
          if (!input.classList.contains("hidden")) {
            input.classList.add("hidden");
          }
      
          if (mic.classList.contains("hidden")) {
            mic.classList.remove("hidden");
          }
        } else {
          element.classList.add(`${isFocused}`);
          element.classList.add(`${isFocused}`);
          elementText.classList.add("hidden");
          elementIcon.classList.add("toggled");
          synth.cancel();
          DeafModeOff = false;
      
          if (!mic.classList.contains("hidden")) {
            mic.classList.add("hidden");
          }
      
          if (input.classList.contains("hidden")) {
            input.classList.remove("hidden");
          }
        }
      });
}