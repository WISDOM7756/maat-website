export const handleClickVoice = (element, elementText, elementIcon, setting, isFocused) => {
    element.addEventListener("click", (e) => {
        e.preventDefault();
        if (element.classList.contains(`${isFocused}`)) {
          element.classList.remove(`${isFocused}`);
          elementText.classList.remove("hidden");
          elementIcon.classList.remove("toggled");
          setting.classList.add("hidden");
        } else {
          element.classList.add(`${isFocused}`);
          elementText.classList.add("hidden");
          elementIcon.classList.add("toggled");
          setting.classList.remove("hidden");
        }
      });
}