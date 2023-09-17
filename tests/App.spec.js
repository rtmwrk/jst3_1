// Импортируем объект с данными пользователя
import { user } from "../auth/user.js";

const { test, expect } = require("@playwright/test");

// Формируем случайную цифровую строку
// Пароли в негативных тестах будем формировать с использованием такой строки
const symbolRandom = String(Math.floor(Math.random() * 100));

// --- Функциональный позитивный тест формы входа на ресурс "Netology.ru" ---
// Задаем верные имя пользователя и пароль, входим в "Личный кабинет"
test("Netology.ru login page => functional positive test", async ({ page }) => {
  test.setTimeout(300000);
  // Переходим на страницу авторизации
  await page.goto("https://netology.ru/?modal=sign_in");
  // Заполняем поля формы
  await page.getByPlaceholder("Email").fill(user.email);
  await page.getByPlaceholder("Пароль").fill(user.password);
  // Нижимаем кнопку
  await page.getByTestId("login-submit-btn").click();
  // Ожидаем сообщения об успешной регистрации
  await expect(page).toHaveURL("https://netology.ru/profile", {
    timeout: 30000,
  });
});

// --- Функциональный нетивный тест формы входа на ресурс "Netology.ru" ---
// Задаем ошибочные имя пользователя и пароль, выходим на ошибку
test("Netology.ru login page => functional negative test", async ({ page }) => {
  test.setTimeout(300000);
  // Переходим на страницу авторизации
  await page.goto("https://netology.ru/?modal=sign_in");
  // Переходим в поле "Email" формы регистрации
  await page.getByPlaceholder("Email").click();
  await page.screenshot({ path: `./test-results/Step 1. Goto page.png` });
  // Заполняем поля формы данными, добавляя к верному значению случайный символ
  await page.getByPlaceholder("Email").fill(user.email);
  await page.screenshot({ path: `./test-results/Step 2. Fill email.png` });

  console.log(user.password + symbolRandom);

  // Переходим в поле "Password" формы регистрации
  await page.getByPlaceholder("Пароль").click();
  await page.getByPlaceholder("Пароль").fill(user.password + symbolRandom);
  await page.screenshot({ path: `./test-results/Step 3. Fill password.png` });

  // Нижимаем кнопку
  await page.getByTestId("login-submit-btn").click();

  // Ожидаем сообщения об ошибке
  const locator = await page.getByTestId("login-error-hint");
  await expect(locator).toHaveText("Вы ввели неправильно логин или пароль", {
    timeout: 30000,
  });
  await page.screenshot({ path: `./test-results/Step 4. Error window.png` });
});
