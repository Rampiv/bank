import { el } from 'redom';

export function currenciesHtml() {
  return el('main',
    el('div.container',
      [
        el('div.main__accounts-container.flex',
          el('div.accounts__title.flex',
            el('h2.text-reset.work-sans-bold.accounts__h2', 'Валютный обмен')
          )
        ),
        el('div.main__currencies-container.flex#currenciesContainter',
          [
            el('div.currensies__common.flex',
              [
                el('div.currencies-block.flex',
                  [
                    el('h3.text-reset.accout__h3.work-sans-bold.currencies__h3', 'Ваши валюты'),
                    el('div.currencies__own-container.flex#ownCurrencies',
                      el('div.currensy__row',
                        [
                          el('p.text-reset.work-sans-medium.currency__name', 'ETH'),
                          el('span.separator'),
                          el('p.text-reset.work-sans-regular.currency__amount', '6.3213213211')
                        ]
                      )
                    )
                  ]
                ),
                el('div.currensy__change',
                  [
                    el('h3.text-reset.accout__h3.work-sans-bold.currencies__h3', 'Обмен валюты'),
                    el('form.currency__form.flex',
                      [
                        el('div.currency__inputs-container',
                          [
                            el('div.currensy__fromto-container',
                              [
                                el('span.text-reset', 'Из'),

                                el('select#currensyFromSelect'),
                                el('span.text-reset', 'в'),
                                el('select#currensyToSelect', addOptionsCurrenciesAll())
                              ]
                            ),
                            el('div.currensy__amount-container',
                              [
                                el('label', { for: 'currensyAmountInput' }, 'Сумма'),
                                el('input#currensyAmountInput')
                              ]
                            )
                          ]
                        ),
                        el('button.btn-reset.btn-primary#currensyBtn', 'Обменять')
                      ]
                    )
                  ]
                )
              ]
            ),
            el('div.currensies__common', '2222222222222')
          ]
        )
      ]
    ))
}

export function addOwnCurrensyHtml(code, amount) {
  const ownCurrencies = document.getElementById('ownCurrencies');
  const newCurrensy = el('div.currensy__row',
    [
      el('p.text-reset.work-sans-medium.currency__name', `${code}`),
      el('span.separator'),
      el('p.text-reset.work-sans-regular.currency__amount', `${amount}`)
    ]
  )
  ownCurrencies.append(newCurrensy)
}

export function addOptionsCurrencies(type) {
  return el('option', `${type}`)
}

function addOptionsCurrenciesAll() {
  return [
    el('option', 'ETH'),
    el('option', 'AUD'),
    el('option', 'BTC'),
    el('option', 'BYR'),
    el('option', 'CAD'),
    el('option', 'CHF'),
    el('option', 'CNH'),
    el('option', 'ETH'),
    el('option', 'EUR'),
    el('option', 'GBP'),
    el('option', 'HKD'),
    el('option', 'JPY'),
    el('option', 'NZD'),
    el('option', 'RUB'),
    el('option', 'UAH'),
    el('option', 'USD'),
  ]
}
