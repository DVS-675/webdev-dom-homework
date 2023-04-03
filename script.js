import {
  changeLikesListener,
  validateInput,
  addCommentWithEnter,
  editComment,
  buttonBlock,
  deleteComment,
  renderComments,
} from "./formActions.js";

export const buttonElement = document.getElementById("add-button");
export const deleteButtonElement = document.getElementById("delete-button");
export const listElement = document.getElementById("list");
export const nameInputElement = document.getElementById("name-input");
export const textInputElement = document.getElementById("text-input");
export const mainForm = document.querySelector(".add-form");
export const addCommentText = document.getElementById("addingComment");
export const waitCommentMessage = document.getElementById("waitComment");
export let comments = [];

//GET запрос с сервера
waitCommentMessage.style.display = "inline";
const fetchGetAndRender = () => {
  return fetch(
    "https://webdev-hw-api.vercel.app/api/v1/dmitrii-vasin/comments",
    {
      method: "GET",
    }
  )
    .then((response) => {
      if (response.status === 201 || response.status === 200) {
        return response.json();
      } else {
        return Promise.reject("Сервер упал");
      }
    })

    .then((responseData) => {
      const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
        hour: "numeric",
        minute: "2-digit",
      };
      console.log(responseData);
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;"),
          date: new Date(comment.date).toLocaleString("ru-RU", options),
          text: comment.text.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
          likes: comment.likes,
          isLiked: false,
        };
      });
      waitCommentMessage.style.display = "none";
      comments = appComments;
      renderComments();
    })
    .catch((error) => {
      waitCommentMessage.style.display = "none";
      if (error === "Сервер упал") {
        alert("Сервер сломался, попробуй позже");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
      console.warn(error);
    });
};

//Добавление комментария, POST запрос с GET

buttonElement.addEventListener("click", () => {
  nameInputElement.classList.remove("error");
  textInputElement.classList.remove("error");

  if (nameInputElement.value === "" || textInputElement.value === "") {
    nameInputElement.classList.add("error");
    textInputElement.classList.add("error");
    return;
  }
  addCommentText.style.display = "inline";
  mainForm.style.display = "none";
  buttonElement.disabled = true;
  buttonElement.textContent = "Загружаю...";
  fetch("https://webdev-hw-api.vercel.app/api/v1/dmitrii-vasin/comments", {
    method: "POST",
    body: JSON.stringify({
      name: nameInputElement.value,
      text: textInputElement.value,
      date: new Date(),
      forceError: true,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 400) {
        return Promise.reject("Короткий текст");
      } else if (response.status === 500) {
        return Promise.reject("Сервер упал");
      }
    })

    .then(() => {
      return fetchGetAndRender();
    })
    .then(() => {
      addCommentText.style.display = "none";
      mainForm.style.display = "flex";
      buttonElement.disabled = false;
      buttonElement.textContent = "Написать";
      nameInputElement.value = "";
      textInputElement.value = "";
    })
    .catch((error) => {
      addCommentText.style.display = "none";
      mainForm.style.display = "flex";
      buttonElement.disabled = false;
      buttonElement.textContent = "Написать";
      if (error === "Короткий текст") {
        alert("Имя и комментарий должны быть не короче 3 символов");
      } else if (error === "Сервер упал") {
        alert("Сервер сломался, попробуй позже");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
      console.warn(error);
    });

  renderComments();
});

fetchGetAndRender();
changeLikesListener();
editComment();
validateInput();
renderComments();
buttonBlock();
deleteComment();
addCommentWithEnter();
console.log("It works!");
