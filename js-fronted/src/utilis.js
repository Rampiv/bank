import { createCard } from './accountsHtml.js';
import Chart from 'chart.js/auto'
import 'chart.js/auto'


export async function createAccoutn(token) {
  const response = await fetch("http://localhost:3000/create-account", {
    method: "POST",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    }
  });
  const data = response.json()
  return data
}

function closeOutside(e) {
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdowncontent = document.getElementById('dropdowncontent');
  if (dropdownBtn) {
    if (!dropdownBtn.contains(e.target) && !dropdowncontent.contains(e.target)) {
      dropdowncontent.classList.add('display-none');
      dropdownBtn.classList.remove('dropdown__btn--clicked')
    }

  }
}

export function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

export function addAccountCardHtml(container, array) {
  [...array].forEach((card) => {
    const tranzactions = card.transactions;
    if (tranzactions.length >= 1) {
      const newCard = createCard(card.account, formatBalance(card.balance), getDateLastTranzaction(tranzactions));
      newCard.setAttribute('data-data', `${new Date(tranzactions[tranzactions.length - 1].date).getDate()}/${new Date(tranzactions[tranzactions.length - 1].date).getMonth()}/${new Date(tranzactions[tranzactions.length - 1].date).getFullYear()}`)
      container.append(newCard)
    } else {
      const newCard = createCard(card.account, formatBalance(card.balance), getDateLastTranzaction('Нет информации'));
      newCard.setAttribute('data-data', `01/01/2001`);
      container.append(newCard)
    }
  })
}

function getDateLastTranzaction(tranzactions) {
  if (tranzactions === 'Нет информации') {
    const data = 'Нет информации'
    return data
  }
  let lastTranzactionDate = new Date(tranzactions[tranzactions.length - 1]);
  if (tranzactions[tranzactions.length - 1].date) {
    lastTranzactionDate = new Date(tranzactions[tranzactions.length - 1].date);
  }
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const monthName = MONTHS[lastTranzactionDate.getMonth()]
  const date = `${lastTranzactionDate.getDate()} ${monthName} ${lastTranzactionDate.getFullYear()}`
  return date
}

export function formatBalance(balance) {
  return balance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}

function dropdownClicked(btn) {
  [...document.querySelectorAll('.dropdown__content-btn')]
    .forEach((card) => [
      card.classList.remove('dropdown__content-btn--clicked')
    ])
  btn.classList.add('dropdown__content-btn--clicked');
}

function sortCards(type) {
  const container = document.getElementById('accoutCardsContainter');
  const array = [...document.querySelectorAll('.accoutn__card-container')]
  switch (type) {
    case 'number':
      if (array.length > 1) {
        const newArray = array.sort((a, b) => a.querySelector('.account__card-accoutn').textContent - b.querySelector('.account__card-accoutn').textContent);
        container.textContent = '';
        newArray.forEach((card) => {
          container.append(card)
        })
      }
      break;
    case 'balance':
      if (array.length > 1) {
        const newArray = array.sort((b, a) => parseFloat(a.querySelector('.account__card-balance').textContent.match(/[\d+\.]/g).join('')) - parseFloat(b.querySelector('.account__card-balance').textContent.match(/[\d+\.]/g).join('')));
        container.textContent = '';
        newArray.forEach((card) => {
          container.append(card)
        })
      }
      break;
    case 'data':
      if (array.length > 1) {
        const newArray = array.sort(function (b, a) {
          return new Date(a.getAttribute('data-data')) - new Date(b.getAttribute('data-data'))
        });
        container.textContent = '';
        newArray.forEach((card) => {
          container.append(card)
        })
      }

  }
}

export function activeHeaderBtn(btn) {
  document.querySelectorAll('.header__btn').forEach((btn) => { btn.classList.remove('header__btn-active') })
  btn.classList.add('header__btn-active');
}

export async function getToken(login, password) {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: login,
      password: password
    })
  });
  const data = response.json()
  return data
}

export async function getAccounts(token) {
  const response = await fetch('http://localhost:3000/accounts', {
    method: "GET",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    }
  })
  const data = response.json();
  return data
}

export async function getAccount(id, token) {
  const response = await fetch(`http://localhost:3000/account/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    }
  })
  const data = response.json();
  return data
}

export function addEventSort() {
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdowncontent = document.getElementById('dropdowncontent');
  dropdownBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdowncontent.classList.toggle('display-none');
    dropdownBtn.classList.toggle('dropdown__btn--clicked')
  })

  document.addEventListener("click", closeOutside)

  const sortNumber = document.getElementById('sortNumber');
  sortNumber.addEventListener('click', () => {
    dropdownClicked(sortNumber);
    sortCards('number');
  })

  const sortBalance = document.getElementById('sortBalance');
  sortBalance.addEventListener('click', () => {
    dropdownClicked(sortBalance)
    sortCards('balance')
  })

  const sortTranzaction = document.getElementById('sortTranzaction');
  sortTranzaction.addEventListener('click', () => {
    dropdownClicked(sortTranzaction)
    sortCards('data')
  })
}

export function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('ru-RU', {
    month: 'long',
  });
}

export function createChart(container, newArray) {
  let chartStatus = Chart.getChart('chartContainer');
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  new Chart(container, {
    type: 'bar',
    data: {
      labels: newArray.map(item => item.monthName),
      datasets: [{
        label: '',
        data: newArray.map(item => item.amountTrs),
        backgroundColor: 'rgba(17, 106, 204, 1)',
      }]
    },
    options: {
      maintainAspectRatio: false,
      barPercentage: 0.8,
      categoryPercentage: 1,
      plugins: {
        legend: {
          display: false,
        },

      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            color: 'rgba(0, 0, 0, 1)'
          },
          ticks: {
            padding: -25,
            mirror: true,
          },
        },
        y: {
          grid: {
            display: false
          },
          position: 'right',
          ticks: {
            maxTicksLimit: 2,
            padding: 25,
          },
          border: {
            color: 'rgba(0, 0, 0, 1)'
          },
          max: 3000,
        }
      },
    }
  });
  Chart.defaults.font.family = "Work Sans", 'sans-serif';
  Chart.defaults.font.size = 20;
  Chart.defaults.font.weight = 500;
}

export function createChartTransactionsRatio(container, array1, array2) {
  let chartStatus = Chart.getChart('chartRatioContainer');
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  const data = {
    labels: array1.map(item => item.monthName),
    datasets: [{
      type: 'bar',
      label: 'out',
      data: array1.map(item => item.amountTrs),
      backgroundColor: 'rgba(253, 78, 93, 1)',
      bezierCurve: false,
    },
    {
      type: 'bar',
      label: 'in',
      data: array2.map(item => item.amountTrs),
      backgroundColor: 'rgba(118, 202, 102, 1)',
      bezierCurve: false,
    }
    ]
  }
  new Chart(container, {
    type: 'bar',
    data: data,
    options: {
      maintainAspectRatio: false,
      // barPercentage: 0.8,
      // categoryPercentage: 2,
      plugins: {
        legend: {
          display: false,
        },

      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            color: 'rgba(0, 0, 0, 1)'
          },
          ticks: {
            padding: -25,
            mirror: true,
          },
          stacked: true,
        },
        y: {
          grid: {
            display: false
          },
          position: 'right',
          ticks: {
            maxTicksLimit: 4,
            padding: 25,
          },
          border: {
            color: 'rgba(0, 0, 0, 1)'
          },
          max: 3000,
          stacked: true,
        }
      },
    }
  });
  Chart.defaults.font.family = "Work Sans", 'sans-serif';
  Chart.defaults.font.size = 20;
  Chart.defaults.font.weight = 500;
}

export async function createNewTransfer(from, to, amount) {
  const response = await fetch("http://localhost:3000/transfer-funds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from,
      to: to,
      amount: amount
    })
  })
  const data = response.json()
}

export async function getOwnCurrencies(token) {
  const response = await fetch('http://localhost:3000/currencies', {
    method: "GET",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    }
  })
  const data = response.json();
  return data
}

export function isInteger(num) {
  return (num ^ 0) === num;
}
