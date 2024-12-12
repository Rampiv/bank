import { el } from 'redom';

export function accountDetails() {
  return el('main',
    el('div.container',
      el('div.main__account-container.flex',
        [
          el('div.account__title-containter.flex',
            [
              el('h2.text-reset.work-sans-bold.accounts__h2', 'Просмотр счёта'),
              el('button.btn-reset.btn-primary.account__btn.account__btn-back.ubuntu-medium#returnBtn', { href: '/accounts' }, 'Вернуться назад')
            ]
          ),
          el('div.account__text-container.flex',
            [
              el('p.text-reset.accoutn__id.work-sans-regular#accoutnId', '№'),
              el('div.account__balance-container.flex',
                [
                  el('p.text-reset.account__text-balance.work-sans-bold', 'Баланс'),
                  el('p.text-reset.work-sans-regular.account__text-balance#accountBalance')
                ]
              )

            ]
          ),
          el('div.account__details-containers#detailsBlocks'
          )
        ]
      )
    ))
}

export function accountHtml() {
  return el('main',
    el('div.container',
      [
        el('div.main__accounts-container.flex',
          el('div.accounts__title.flex',
            [
              el('h2.text-reset.work-sans-bold.accounts__h2', 'Ваши счета'),
              el('div.dropdown',
                [
                  el('button.btn-reset.dropdown__btn.ubuntu-regular#dropdownBtn', 'Сортировка'),
                  el('div.dropdown__content.display-none#dropdowncontent',
                    [
                      el('button.btn-reset.dropdown__content-btn.ubuntu-regular#sortNumber', 'По номеру'),
                      el('button.btn-reset.dropdown__content-btn.ubuntu-regular#sortBalance', 'По балансу'),
                      el('button.btn-reset.dropdown__content-btn.ubuntu-regular#sortTranzaction', 'По последней транзакции'),
                    ])
                ]),
            ]
          ),
          el('button.btn-reset.btn-primary.account__btn.ubuntu-medium#createAccountBtn', 'Создать новый счет')
        ),
        el('div.main__accounts-CardsContainer.flex#accoutCardsContainter')
      ]
    ))
}

export function createBalance() {
  return el('a.account__details-container.account__details-balance.flex#balanceContainer', { href: '#' },
    [
      el('h3.text-reset.work-sans-bold.account__h3', 'Динамика баланса'),
      el('canvas.accoutn__chart-container#chartContainer')
    ]
  )
}

export function createHystory(send, recip, balance, color, date) {
  return el('tr.table__body-row',
    [
      el('td.table__body.ubuntu-regular.table__accountSend', `${send}`),
      el('td.table__body.ubuntu-regular.table__accountRecip', `${recip}`),
      el(`td.table__body.ubuntu-regular.table__balance.${color}`, `${balance}`),
      el('td.table__body.ubuntu-regular.table__date', `${date}`),
    ]
  )
}

export function createTransaction() {
  return el('div.account__details-container.flex#transactionContainer',
    [
      el('h3.text-reset.work-sans-bold.account__h3', 'Новый перевод'),
      el('form.account__form.flex',
        [
          el('div.account__inputTransfer-container.flex',
            [
              el('label.text-reset.account__transfer-text.ubuntu-medium', { htmlFor: 'inputNewTransferAccount' }, 'Номер счёта получателя'),
              el('input.form__input.ubuntu-regular', { id: 'inputNewTransferAccount', placeholder: 'Placeholder' }),
              el('span.triangle')
            ]
          ),
          el('div.account__inputTransfer-container.flex',
            [
              el('label.text-reset.account__transfer-text.ubuntu-medium', { htmlFor: 'inputNewTransferAmount' }, 'Сумма перевода'),
              el('input.form__input.ubuntu-regular', { id: 'inputNewTransferAmount', placeholder: 'Placeholder' })
            ]
          ),
          el('button.btn-reset.btn-primary.ubuntu-medium.account__transfer-btn#accountTransferBtn', { type: 'submit' }, 'Отправить')
        ]
      )
    ]
  )
}

export function createHystoryContainer() {
  return el('div.account__details-container.account__details-history',
    [
      el('h3.text-reset.work-sans-bold.account__h3.account__h3-history', 'История переводов'),
      el('table.account__history-table',
        [
          el('thead',
            el('tr.table__title-row',
              [
                el('th.table__title.ubuntu-medium.table__accountSend', 'Счет отправителя'),
                el('th.table__title.ubuntu-medium.table__accountRecip', 'Счет получателя'),
                el('th.table__title.ubuntu-medium.table__balance', 'Сумма'),
                el('th.table__title.ubuntu-medium.table__date', 'Дата'),
              ]
            )
          ),
          el('tbody#tableBody'
          )
        ]
      )
    ]
  )
}

export function createTransactionsRatio() {
  return el('a.account__details-container.account__details-balance.flex#transactionsRatioContainer', { href: '#' },
    [
      el('h3.text-reset.work-sans-bold.account__h3', 'Соотношение входящих исходящих транзакций'),
      el('canvas.accoutn__chart-container#chartRatioContainer')
    ]
  )
}

export function createCard(account, balance, date) {
  return el('div.accoutn__card-container.flex',
    [
      el('div.accoutn__text-container',
        [
          el('p.text-reset.account__card-accoutn.ubuntu-medium', `${account}`),
          el('p.text-reset.account__card-balance.ubuntu-regular', `${balance} ₽`),
          el('p.text-reset.account__card-tranzactionText.work-sans-bold', 'Последняя транзакция:'),
          el('p.text-reset.account__card-tranzactionDate.work-sans-regular', `${date}`),
        ]
      ),
      el('button.btn-reset.account__card-btn.btn-primary.ubuntu-medium', { href: `/account/${account}` }, 'Открыть')
    ]
  )
}
