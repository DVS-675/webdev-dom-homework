import { loginUser, registerUser } from "../api.js";

export function renderLoginComponent({
  setName,
  appEl,
  comments,
  setToken,
  renderComments,
}) {
  let isLoginMode = true;

  const renderForm = () => {
    const commentsHtml =
      comments &&
      comments
        .map((comment, index) => {
          return `<li data-text = '&gt ${comment.text} \n ${
            comment.name
          }' class="comment">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${comment.text}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button data-index = '${index}' class="${
            comment.isLiked ? "like-button -active-like" : "like-button"
          }"></button>
            </div>
          </div>
        </li>`;
        })
        .join("");

    const appHtml = `
            <div class="container">
              <p id = 'waitComment' style="display: none">Комментарии загружаются...</p>
              <ul id="list" class="comments">
                ${commentsHtml}
              </ul>
              <p id = 'addingComment' style="display: none">Комментарий добавляется...</p>
              

            <div class="add-form">
              <h2 class="class">Форма ${
                isLoginMode ? "входа" : "регистрации"
              }</h2>
              ${
                isLoginMode
                  ? ""
                  : `<input
              type="text"
              id="name-input"
              class="add-form-name"
              placeholder="Введите вашe имя"/>
              <br/>`
              }

              <input
              type="text"
              id="login-input"
              class="login-form-name"
              placeholder="Введите ваш логин"/>
              <br/>
              
              <input
                type="password"
                id="password-input"
                class="login-form-name"
                placeholder="Введите ваш пароль"
              />
              
              <div class="login-form-row">
                <button id="login-button" class="login-form-button">${
                  isLoginMode ? "Войти" : "Зарегистрироваться"
                }</button>
                <button id="toggle-button" class="reg-form-button">
                ${isLoginMode ? "Регистрация" : "Вход"}
                </button>
              </div>
            </div>

          </div>`;

    appEl.innerHTML = appHtml;

    document.getElementById("login-button").addEventListener("click", () => {
      if (isLoginMode) {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;
        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setToken(`Bearer ${user.user.token}`);
            setName(user.user.name)
            renderComments();
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        const name = document.getElementById("name-input").value;
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;
        
        if (!name) {
          alert("Введите имя");
          return;
        }

        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
        })
          .then((user) => {
            setToken(`Bearer ${user.user.token}`);
            renderComments();
          })
          .catch((error) => {
            alert(error.message);
          });
          setName(name);
      }
      
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };

  renderForm();
}
