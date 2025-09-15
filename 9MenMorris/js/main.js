document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");
  let currentPlayer = "PlayerOne";
  let playerOneCount = 0;
  let playerTwoCount = 0;
  let lastActiveButton = null;
  let maxActiveReached = false;
  let removeMode = false;

  let lastCombinations = [];
  let maxCount = 18;

  // Porownuje czy podane tablice o tej samej dlugosci maja te same elementy

  // areArraysTheSame([1,2,3], [1,2,3]) -> true
  function areArraysTheSame(arr1, arr2) {
    for (let x = 0; x < arr1.length; x++) {
      if (arr1[x] !== arr2[x]) return false;
    }

    return true;
  }

  // areCombinationInArray([[1,2,3], [3,2,1]], [3,2,1]) -> true
  // Sprawdza czy array znajduje sie w arrayOfArrays
  function isCombinationInArray(arrayOfArrays, array) {
    for (let x = 0; x < arrayOfArrays.length; x++) {
      if (areArraysTheSame(arrayOfArrays[x], array)) return true;
    }

    return false;
  }

  function checkThreeActiveButtons() {
    // Lista wszystkich możliwych kombinacji przycisków do sprawdzenia
    const combinations = [
      ["BtnOneActive", "BtnTwoActive", "BtnThreeActive"],
      ["BtnOneActive", "BtnFourActive", "BtnSixActive"],
      ["BtnMidOneActive", "BtnMidFourActive", "BtnMidSixActive"],
      ["BtnEndOneActive", "BtnEndFourActive", "BtnEndSixActive"],
      ["BtnMidOneActive", "BtnMidTwoActive", "BtnMidThreeActive"],
      ["BtnEndOneActive", "BtnEndTwoActive", "BtnEndThreeActive"],
      ["BtnThreeActive", "BtnFiveActive", "BtnEightActive"],
      ["BtnMidThreeActive", "BtnMidFiveActive", "BtnMidEightActive"],
      ["BtnEndThreeActive", "BtnEndFiveActive", "BtnEndEightActive"],
      ["BtnSixActive", "BtnSevenActive", "BtnEightActive"],
      ["BtnMidSixActive", "BtnMidSevenActive", "BtnMidEightActive"],
      ["BtnEndSixActive", "BtnEndSevenActive", "BtnEndEightActive"],
      ["BtnTwoActive", "BtnMidTwoActive", "BtnEndTwoActive"],
      ["BtnFourActive", "BtnMidFourActive", "BtnEndFourActive"],
      ["BtnFiveActive", "BtnMidFiveActive", "BtnEndFiveActive"],
      ["BtnSevenActive", "BtnMidSevenActive", "BtnEndSevenActive"],
      // Możesz dodać więcej kombinacji przycisków tutaj, jeśli chcesz
    ];

    const newLastCombinations = [];

    // Funkcja pomocnicza do sprawdzenia, czy wszystkie przyciski z danej kombinacji są aktywne i należą do tego samego gracza
    function checkCombination(buttonClasses) {
      const buttons = buttonClasses.map((cls) =>
        document.querySelector(`.${cls}`)
      );

      // Sprawdzamy, czy wszystkie trzy przyciski istnieją
      if (buttons.every((btn) => btn !== null)) {
        const isPlayerOne = buttons.every((btn) =>
          btn.classList.contains("PlayerOne")
        );
        const isPlayerTwo = buttons.every((btn) =>
          btn.classList.contains("PlayerTwo")
        );

        // Jeśli wszystkie przyciski należą do tego samego gracza, przygotowujemy nasłuch na kolejny kliknięty przycisk
        if (isPlayerOne || isPlayerTwo) {
          newLastCombinations.push(buttons);

          // jesli kombinacja wystapila w ostatniej rundzie, zignoruj ja
          // inaczej mowiac, jezeli lastCombinations zawiera aktualna kombinacje przyciskow
          if (isCombinationInArray(lastCombinations, buttons)) return;

          console.log(
            `Kombinacja ${buttonClasses.join(
              ", "
            )} jest aktywna i należy do tego samego gracza!`
          );
          removeMode = true;
          // Teraz czekamy na kliknięcie następnego przycisku
          // document.addEventListener('click', handleNextButtonClick, { once: true });
        }
      }
    }

    // Sprawdzanie każdej kombinacji
    combinations.forEach(checkCombination);

    lastCombinations = newLastCombinations;
  }
  // Funkcja obsługująca kliknięcie na kolejny przycisk
  function handleNextButtonClick(event) {
    console.log("handleNextButtonClick");
    const clickedButton = event.target;

    // Sprawdzamy, czy kliknięty element jest przyciskiem
    if (
      clickedButton.tagName === "BUTTON" &&
      clickedButton.classList.contains("BtnActive")
    ) {
      removeClasses(clickedButton); // Usuwamy klasy z klikniętego przycisku
      maxCount--;
    }
  }

  function addClasses(button) {
    button.classList.add("BtnActive", currentPlayer);
    button.classList.forEach((cls) => {
      if (cls.startsWith("Btn") && cls !== "BtnActive") {
        button.classList.add(`${cls}Active`);
      }
    });
  }

  function removeClasses(button) {
    button.classList.remove("BtnActive", "PlayerOne", "PlayerTwo");
    button.classList.forEach((cls) => {
      if (cls.startsWith("Btn") && cls.endsWith("Active")) {
        button.classList.remove(cls);
      }
    });
  }

  function swapClasses(activeButton, inactiveButton) {
    removeClasses(activeButton);
    addClasses(inactiveButton);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      console.log("button clicked");
      if (removeMode) {
        handleNextButtonClick(event);
        removeMode = false;
        currentPlayer =
          currentPlayer === "PlayerOne" ? "PlayerTwo" : "PlayerOne";
        return;
      }
      const activeButtonsCount = document.querySelectorAll(".BtnActive").length;

      // Prevent overwriting buttons
      if (
        (button.classList.contains("PlayerOne") &&
          currentPlayer === "PlayerTwo") ||
        (button.classList.contains("PlayerTwo") &&
          currentPlayer === "PlayerOne")
      ) {
        return;
      }

      if (
        button.classList.contains("BtnActive") &&
        activeButtonsCount >= maxCount
      ) {
        removeClasses(button);

        // Decrement the counter for the current player
        if (currentPlayer === "PlayerOne") {
          playerOneCount--;
        } else {
          playerTwoCount--;
        }

        lastActiveButton = button;
        maxActiveReached = false; // Allow adding buttons again if count drops below 18
      } else {
        if (maxActiveReached) {
          return; // Prevent adding more buttons if max active buttons reached
        }

        if (lastActiveButton) {
          if (lastActiveButton === button) {
            // If the same button is clicked again, toggle its classes
            if (button.classList.contains("BtnActive")) {
              removeClasses(button);
              lastActiveButton = null;
            } else {
              addClasses(button);
              lastActiveButton = button;
            }
          } else {
            // Check if lastActiveButton is BtnOne and the new button is BtnTwo or BtnFour
            if (
              lastActiveButton.classList.contains("BtnOne") &&
              !(
                button.classList.contains("BtnTwo") ||
                button.classList.contains("BtnFour")
              )
            ) {
              return;
            }

            // Check if lastActiveButton is BtnTwo and the new button is BtnOne, BtnThree, or BtnMidTwo
            if (
              lastActiveButton.classList.contains("BtnTwo") &&
              !(
                button.classList.contains("BtnOne") ||
                button.classList.contains("BtnThree") ||
                button.classList.contains("BtnMidTwo")
              )
            ) {
              return;
            }

            // Check if lastActiveButton is BtnThree and the new button is BtnTwo or BtnFive
            if (
              lastActiveButton.classList.contains("BtnThree") &&
              !(
                button.classList.contains("BtnTwo") ||
                button.classList.contains("BtnFive")
              )
            ) {
              return;
            }
            // Check if lastActiveButton is BtnThree and the new button is BtnTwo or BtnFive
            if (
              lastActiveButton.classList.contains("BtnFive") &&
              !(
                button.classList.contains("BtnThree") ||
                button.classList.contains("BtnMidFive") ||
                button.classList.contains("BtnEight")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnEight") &&
              !(
                button.classList.contains("BtnFive") ||
                button.classList.contains("BtnSeven")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnSeven") &&
              !(
                button.classList.contains("BtnMidSeven") ||
                button.classList.contains("BtnSix") ||
                button.classList.contains("BtnEight")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnSix") &&
              !(
                button.classList.contains("BtnSeven") ||
                button.classList.contains("BtnFour")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnFour") &&
              !(
                button.classList.contains("BtnSix") ||
                button.classList.contains("BtnMidFour") ||
                button.classList.contains("BtnOne")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidOne") &&
              !(
                button.classList.contains("BtnMidTwo") ||
                button.classList.contains("BtnMidFour")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidTwo") &&
              !(
                button.classList.contains("BtnMidOne") ||
                button.classList.contains("BtnTwo") ||
                button.classList.contains("BtnEndTwo") ||
                button.classList.contains("BtnMidThree")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidThree") &&
              !(
                button.classList.contains("BtnMidTwo") ||
                button.classList.contains("BtnMidFive")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidFive") &&
              !(
                button.classList.contains("BtnMidThree") ||
                button.classList.contains("BtnFive") ||
                button.classList.contains("BtnEndFive") ||
                button.classList.contains("BtnMidEight")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidEight") &&
              !(
                button.classList.contains("BtnMidFive") ||
                button.classList.contains("BtnMidSeven")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidSeven") &&
              !(
                button.classList.contains("BtnMidEight") ||
                button.classList.contains("BtnSeven") ||
                button.classList.contains("BtnEndSeven") ||
                button.classList.contains("BtnMidSix")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidSix") &&
              !(
                button.classList.contains("BtnMidSeven") ||
                button.classList.contains("BtnMidFour")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnMidFour") &&
              !(
                button.classList.contains("BtnMidSix") ||
                button.classList.contains("BtnFour") ||
                button.classList.contains("BtnEndFour") ||
                button.classList.contains("BtnMidOne")
              )
            ) {
              return;
            }

            if (
              lastActiveButton.classList.contains("BtnEndOne") &&
              !(
                button.classList.contains("BtnEndFour") ||
                button.classList.contains("BtnEndTwo")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnEndTwo") &&
              !(
                button.classList.contains("BtnEndOne") ||
                button.classList.contains("BtnMidTwo") ||
                button.classList.contains("BtnEndThree")
              )
            ) {
              return;
            }

            if (
              lastActiveButton.classList.contains("BtnEndThree") &&
              !(
                button.classList.contains("BtnEndTwo") ||
                button.classList.contains("BtnEndFive")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnEndFive") &&
              !(
                button.classList.contains("BtnEndThree") ||
                button.classList.contains("BtnMidFive") ||
                button.classList.contains("BtnEndEight")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnEndEight") &&
              !(
                button.classList.contains("BtnEndFive") ||
                button.classList.contains("BtnEndSeven")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnEndSeven") &&
              !(
                button.classList.contains("BtnEndEight") ||
                button.classList.contains("BtnMidSeven") ||
                button.classList.contains("BtnEndSix")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnEndSix") &&
              !(
                button.classList.contains("BtnEndSeven") ||
                button.classList.contains("BtnEndFour")
              )
            ) {
              return;
            }
            if (
              lastActiveButton.classList.contains("BtnEndFour") &&
              !(
                button.classList.contains("BtnEndSix") ||
                button.classList.contains("BtnMidFour") ||
                button.classList.contains("BtnEndOne")
              )
            ) {
              return;
            }

            swapClasses(lastActiveButton, button);
            lastActiveButton = null;

            // Increment the counter for the current player
            if (currentPlayer === "PlayerOne") {
              playerOneCount++;
            } else {
              playerTwoCount++;
            }

            // Toggle the current player
            currentPlayer =
              currentPlayer === "PlayerOne" ? "PlayerTwo" : "PlayerOne";
          }
        } else {
          if (activeButtonsCount < maxCount) {
            addClasses(button);

            // Increment the counter for the current player
            if (currentPlayer === "PlayerOne") {
              playerOneCount++;
            } else {
              playerTwoCount++;
            }

            // Toggle the current player
            currentPlayer =
              currentPlayer === "PlayerOne" ? "PlayerTwo" : "PlayerOne";
          }

          if (activeButtonsCount + 1 >= maxCount) {
            maxActiveReached = true; // Set the flag when max active buttons are reached
          }
        }
      }
      checkThreeActiveButtons();
    });
  });
});
