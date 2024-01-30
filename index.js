document.addEventListener("DOMContentLoaded", function () {
  const createCardBtn = document.getElementById("createCardBtn");
  const flashcardContainer = document.getElementById("flashcardContainer");
  const flashcardForm = document.getElementById("flashcardForm");

  // Load existing flashcards from localStorage
  loadFlashcards();

  createCardBtn.addEventListener("click", function () {
    // flashcardForm.style.display = "block"; // Remove this line
  });

  flashcardForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const wordInput = document.getElementById("word");
    const meaningInput = document.getElementById("meaning");
    const imageUrlInput = document.getElementById("imageUrl");

    const word = wordInput.value;
    const meaning = meaningInput.value;
    const imageUrl = imageUrlInput.value;

    if (word && meaning) {
      createFlashcard(word, meaning, imageUrl);
      // Save the flashcards to localStorage
      saveFlashcards();

      // Reset input values
      wordInput.value = "";
      meaningInput.value = "";
      imageUrlInput.value = "";
    } else {
      alert("Please enter both word and meaning.");
    }
  });

  flashcardContainer.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("delete")) {
      deleteFlashcard(target.parentElement);
      // Save the flashcards to localStorage after deletion
      saveFlashcards();
    } else if (target.classList.contains("edit")) {
      editFlashcard(target.parentElement);
      // Save the flashcards to localStorage after editing
      saveFlashcards();
    }
  });

  // Ask for confirmation before leaving the page
  window.addEventListener("beforeunload", function (event) {
    const flashcards = Array.from(document.querySelectorAll(".flashcard"));
    const flashcardData = flashcards.map((card) => card.innerHTML);

    if (flashcardData.length > 0) {
      const confirmationMessage =
        "You have unsaved changes. Are you sure you want to leave the page?";
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  });

  function createFlashcard(word, meaning, imageUrl) {
    const flashcard = document.createElement("div");
    flashcard.classList.add("flashcard", "rotate"); // Add 'rotate' class

    const content = `<strong>${word}</strong><br>${meaning}`;
    const imageTag = imageUrl
      ? `<img src="${imageUrl}" alt="${word}" class="flashcard-image" />`
      : "";

    flashcard.innerHTML = `${imageTag}${content}<br><button class="edit">Edit</button><button class="delete">Delete</button>`;

    flashcardContainer.appendChild(flashcard);
  }

  function deleteFlashcard(flashcard) {
    flashcard.remove();
  }

  function editFlashcard(flashcard) {
    const existingContent = flashcard.innerHTML.split(
      '<br><button class="edit">Edit</button><button class="delete">Delete</button>'
    )[0];
    const word = prompt(
      "Edit the word:",
      existingContent.match(/<strong>(.*?)<\/strong>/)[1]
    );
    const meaning = prompt(
      "Edit the meaning:",
      existingContent.split("<br>")[1]
    );
    const imageUrl = flashcard.querySelector(".flashcard-image")?.src || "";

    const newImageUrl = prompt("Edit the image URL:", imageUrl);

    if (word !== null && meaning !== null) {
      const wordElement = document.createElement("strong");
      wordElement.innerHTML = word;

      const meaningElement = document.createElement("p");
      meaningElement.innerHTML = meaning;

      const imageElement = document.createElement("img");
      imageElement.src = newImageUrl;
      imageElement.alt = word;
      imageElement.className = "flashcard-image";

      flashcard.innerHTML = "";
      flashcard.appendChild(imageElement);
      flashcard.appendChild(wordElement);
      flashcard.appendChild(meaningElement);
      flashcard.innerHTML += `<br><button class="edit">Edit</button><button class="delete">Delete</button>`;
    } else {
      alert("Please enter both word and meaning.");
    }
  }

  function saveFlashcards() {
    const flashcards = Array.from(document.querySelectorAll(".flashcard"));
    const flashcardData = flashcards.map((card) => card.innerHTML);

    localStorage.setItem("flashcards", JSON.stringify(flashcardData));
  }

  function loadFlashcards() {
    const flashcardData = localStorage.getItem("flashcards");

    if (flashcardData) {
      const flashcards = JSON.parse(flashcardData);
      flashcards.forEach((card) => {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard", "rotate"); // Add 'rotate' class
        flashcard.innerHTML = card;
        flashcardContainer.appendChild(flashcard);
      });
    }
  }
});
