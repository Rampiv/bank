import "./index.css";
import "./media.css";
import "./normalize.css";

import Navigo from 'navigo';
import { createHeader, createEnter, addNotify } from './createHtml.js';
import {
  accountDetails, accountHtml, createBalance, createHystory,
  createTransaction, createHystoryContainer, createTransactionsRatio, createCard
} from './accountsHtml.js'
import { currenciesHtml, addOwnCurrensyHtml, addOptionsCurrencies } from './currensyHtml.js'

import {
  createAccoutn, getCookie, setCookie, deleteCookie, addAccountCardHtml,
  activeHeaderBtn, getToken, getAccounts, getAccount, addEventSort, formatBalance,
  getMonthName, createChart, createNewTransfer, createChartTransactionsRatio, getOwnCurrencies,
  isInteger
} from './utilis.js'

const body = document.querySelector('body');
body.innerHTML = ''
body.append(createHeader(), createEnter());
const loginInput = document.getElementById('loginInput');
const passwordInput = document.getElementById('passwordInput');
const enterBtn = document.getElementById('enterBtn');


const router = new Navigo('/');

router
  // .on('/', () => {
  //   body.innerHTML = ''
  //   body.append(createHeader(), createEnter());
  // })
  .on('accounts', () => {
    body.innerHTML = '';
    body.append(createHeader(), accountHtml());
    const headerNav = document.getElementById('headerNav');
    headerNav.classList.remove('display-none');
    const accountsBtn = document.getElementById('accountsBtn');
    headerBtnEvent();
    activeHeaderBtn(accountsBtn)
    const accoutCardsContainter = document.getElementById('accoutCardsContainter');
    addEventSort();
    const token = getCookie('TOKEN_KEY')
    // добавляем карточки
    getAccounts(token).then((result) => {
      accoutCardsContainter.innerHTML = ''
      addAccountCardHtml(accoutCardsContainter, result.payload)
      const btnsArray = document.querySelectorAll('.account__card-btn');
      addEventAccountDetails(btnsArray)
    });

    document.getElementById('createAccountBtn').addEventListener('click', () => {
      createAccoutn(token).then(() => {
        accoutCardsContainter.innerHTML = ''
        getAccounts(token).then((result) => {
          addAccountCardHtml(accoutCardsContainter, result.payload);
          const btnsArray = document.querySelectorAll('.account__card-btn');
          addEventAccountDetails(btnsArray)
        });
      })
    })
  })
  .on('/account/:id', ({ data }) => {
    body.innerHTML = ''
    body.append(createHeader(), accountDetails())
    const headerNav = document.getElementById('headerNav');
    headerBtnEvent()
    const returnBtn = document.getElementById('returnBtn');
    addEventAccountReturn(returnBtn);
    headerNav.classList.remove('display-none');
    const accountId = document.getElementById('accoutnId');
    const accountBalance = document.getElementById('accountBalance');
    const token = getCookie('TOKEN_KEY');
    accountId.textContent = `№ ${data.id}`;
    getAccount(data.id, token).then((result) => {

      accountBalance.textContent = `${formatBalance(result.payload.balance)} ₽`
      // Создание диаграммы
      const newArray = []
      result.payload.transactions.forEach((item) => {
        // Создание массива для диаграммы
        const amount = Math.floor(item.amount);
        const date = new Date(item.date).getMonth();
        const find = newArray.some(el => {
          return el.monthName === date
        })
        if (!find) {
          newArray.push({ monthName: date, amountTrs: amount })
        } else {
          for (let i = 0; i < newArray.length - 1; i++) {
            if (newArray[i].monthName === date) {
              newArray[i].amountTrs += amount
            }
          }
        }
      })
      newArray.sort(function (a, b) {
        return a.monthName - b.monthName
      })
      newArray.map(item => {
        const month = getMonthName(item.monthName + 1).substring(0, 3);
        item.monthName = month;
      })

      // Помещаем блоки в контейнер
      const detailsBlocks = document.getElementById('detailsBlocks');
      detailsBlocks.append(createTransaction(), createBalance(), createHystoryContainer())

      // Кнопка новый перевод
      document.getElementById('accountTransferBtn').addEventListener('click', (e) => {
        e.preventDefault()
        const to = document.getElementById('inputNewTransferAccount').value;
        const amount = document.getElementById('inputNewTransferAmount').value;

        if (to) {
          if (amount) {
            if (amount < result.payload.balance) {
              createNewTransfer(result.payload.account, to, amount);
              result.payload.balance -= amount;
              accountBalance.textContent = `${formatBalance(result.payload.balance)} ₽`
              historyRefresh();
              addNotify('success', 'Перевод отправлен')
            } else addNotify('error', 'Перевод не отправлен. Не хватает золота')
          } else addNotify('warning', 'Не введена сумма')
        } else addNotify('warning', 'Не введен счет')

        document.getElementById('inputNewTransferAccount').value = '';
        document.getElementById('inputNewTransferAmount').value = '';
      });

      // Создаем chart
      const chartContainer = document.getElementById('chartContainer');
      createChart(chartContainer, newArray)

      // Работа над блоком с историей
      function historyRefresh() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = ''
        for (let i = 0; i < result.payload.transactions.length; i++) {
          const historyDate = `${new Date(result.payload.transactions[i].date).getDate()}.${new Date(result.payload.transactions[i].date).getMonth() + 1}.${new Date(result.payload.transactions[i].date).getFullYear()}`;
          const to = result.payload.transactions[i].to;
          const from = result.payload.transactions[i].from;
          if (from === result.payload.account) {
            const amount = `- ${formatBalance(result.payload.transactions[i].amount)} ₽`
            tbody.append(createHystory(from, to, amount, 'red', historyDate))
          } else {
            const amount = `+ ${formatBalance(result.payload.transactions[i].amount)} ₽`
            tbody.append(createHystory(from, to, amount, 'green', historyDate))
          }
        }
      }
      historyRefresh()

      // Видоизменяем страницу при нажатии на контейнер с динамикой баланса
      const balanceContainer = document.getElementById('balanceContainer');
      balanceContainer.addEventListener('click', (e) => {
        e.onclick = null;
        detailsBlocks.removeChild(document.getElementById('transactionContainer'));
        balanceContainer.style.width = '100%';
        balanceContainer.parentNode.insertBefore(createTransactionsRatio(), balanceContainer.nextSibling);
        const transactionsRatioContainer = document.getElementById('transactionsRatioContainer')
        transactionsRatioContainer.style.width = '100%';

        // создаем новые массивы: МИЛЛИАРД МАССИВОВ, ЧТОБ ЛАГАЛО КАК ПРОДУКЦИЯ РОСТЕЛЕКОМА
        const incomingTransactions = [];
        const outgoingTransactions = [];
        const finalIncTrs = [];
        const finalOutTrs = [];
        const from = result.payload.account;
        // разделяем изначальный массив на 2
        result.payload.transactions.forEach(item => {
          if (from == item.from) {
            outgoingTransactions.push(item)
          } else incomingTransactions.push(item)
        })
        // преобразуем массивы
        incomingTransactions.map((item) => {
          const date = new Date(item.date).getMonth();
          const amount = Math.floor(item.amount);
          return { 'monthName': date, 'amountTrs': amount }
        }).forEach((item) => {
          const amount = item.amountTrs;
          const date = item.monthName
          const find = finalIncTrs.some(el => {
            return el.monthName === date
          })
          if (!find) {
            finalIncTrs.push({ monthName: date, amountTrs: amount })
          } else {
            for (let i = 0; i < finalIncTrs.length - 1; i++) {
              if (finalIncTrs[i].monthName === date) {
                finalIncTrs[i].amountTrs += amount
              }
            }
          }
        })
        outgoingTransactions.map((item) => {
          const date = new Date(item.date).getMonth();
          const amount = Math.floor(item.amount);
          const obj = { 'monthName': date, 'amountTrs': amount };
          return obj
        }).forEach((item) => {
          const amount = item.amountTrs;
          const date = item.monthName
          const find = finalOutTrs.some(el => {
            return el.monthName === date
          })
          if (!find) {
            finalOutTrs.push({ monthName: date, amountTrs: amount })
          } else {
            for (let i = 0; i < finalOutTrs.length - 1; i++) {
              if (finalOutTrs[i].monthName === date) {
                finalOutTrs[i].amountTrs += amount
              }
            }
          }
        })

        finalIncTrs.sort(function (a, b) {
          return a.monthName - b.monthName
        })
        finalOutTrs.sort(function (a, b) {
          return a.monthName - b.monthName
        })

        finalIncTrs.map(item => {
          const month = getMonthName(item.monthName + 1).substring(0, 3);
          item.monthName = month;
        });
        finalOutTrs.map(item => {
          const month = getMonthName(item.monthName + 1).substring(0, 3);
          item.monthName = month;
        })
        const chartRatioContainer = document.getElementById('chartRatioContainer')
        createChartTransactionsRatio(chartRatioContainer, finalOutTrs, finalIncTrs)
        balanceContainer.classList.add('inactive')
        transactionsRatioContainer.classList.add('inactive')
      })
    })
  })
  .on('/currencies', () => {
    body.innerHTML = ''
    body.append(createHeader(), currenciesHtml());
    const currenciesBtn = document.getElementById('currenciesBtn')
    headerBtnEvent()
    activeHeaderBtn(currenciesBtn)
    const headerNav = document.getElementById('headerNav');
    headerNav.classList.remove('display-none');

    const currensyFromSelect = document.getElementById('currensyFromSelect')
    const token = getCookie('TOKEN_KEY')
    getOwnCurrencies(token).then(result => {
      for (let item in result.payload) {
        let num = result.payload[item].amount
        if (!isInteger(result.payload[item].amount)) {
          num = result.payload[item].amount.toFixed(2)
        }
        addOwnCurrensyHtml(result.payload[item].code, num)

        currensyFromSelect.append(addOptionsCurrencies(result.payload[item].code))
      }
    })


  })

router.resolve();


enterBtn.addEventListener('click', async (e) => {
  e.preventDefault()
  const login = 'developer';
  const password = 'skillbox';
  // const login = loginInput.value;
  // const password = passwordInput.value;
  getToken(login, password).then(result => {
    if (!result.error) {
      setCookie('TOKEN_KEY', result.payload.token, {})
      router.navigate(accountsBtn.getAttribute('href'))
      addNotify('success', 'Авторизация прошла успешно')
    } else {
      addNotify('error', 'Неправильный логин или пароль')
    }
  }).catch((err) => {
    console.log(err);
  })
})




// Чтобы 2 раза не импортировать navigo, не буду переносить функции в utilis.js
function addEventAccountDetails(btnsArray) {
  [...btnsArray].forEach((btn) => {
    btn.addEventListener('click', () => {
      router.navigate(btn.getAttribute('href'))
    })
  })
}

function headerBtnEvent() {
  const accountsBtn = document.getElementById('accountsBtn');
  const exitBtn = document.getElementById('exitBtn');
  const currenciesBtn = document.getElementById('currenciesBtn');

  accountsBtn.addEventListener('click', () => {
    router.navigate(accountsBtn.getAttribute('href'))
  })

  currenciesBtn.addEventListener('click', () => {
    router.navigate(currenciesBtn.getAttribute('href'))
  })

  exitBtn.addEventListener('click', () => {
    body.innerHTML = ''
    body.append(createHeader(), createEnter());
    deleteCookie('TOKEN_KEY');
    router.navigate('/')
  })
}

function addEventAccountReturn(returnBtn) {
  returnBtn.addEventListener('click', () => {
    router.navigate(returnBtn.getAttribute('href'));
  })
}
