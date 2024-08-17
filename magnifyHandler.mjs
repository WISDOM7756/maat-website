export const handleClickMagnify = (element, elementText, elementIcon, isFocused) => {
    element.addEventListener("click", (e) => {
        e.preventDefault();
        if (element.classList.contains(`${isFocused}`)) {
          element.classList.remove(`${isFocused}`);
          element.classList.remove(`${isFocused}`);
          elementText.classList.remove("hidden");
          elementIcon.classList.remove("toggled");
        } else {
          element.classList.add(`${isFocused}`);
          element.classList.add(`${isFocused}`);
          elementText.classList.add("hidden");
          elementIcon.classList.add("toggled");
        }
      });
}