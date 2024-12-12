import { el, svg, mount } from 'redom';

export function createHeader() {
  return el('header.header',
    el('div.container',
      el('div.header__container.flex', [
        el('h1.text-reset.header__h1.work-sans-ligth', 'Coin.'),
        el('div.header__btns-block.flex.display-none#headerNav', [
          el('button.btn-reset.header__btn.ubuntu-medium.header__btn-atms#atmsBtn', 'Банкоматы'),
          el('button.btn-reset.header__btn.ubuntu-medium.header__btn-accounts#accountsBtn', { href: 'accounts' }, 'Счета'),
          el('button.btn-reset.header__btn.ubuntu-medium.header__btn-currencies#currenciesBtn', { href: 'currencies' }, 'Валюты'),
          el('button.btn-reset.header__btn.ubuntu-medium.header__btn-exit#exitBtn', 'Выйти'),
        ])
      ])
    )
  )
}

export function createEnter() {
  return el('main',
    el('div.container',
      el('div.main__entery-container.flex',
        el('div.main__entry-card.flex', [
          el('h2.text-reset.work-sans-bold.main__entry-h2', 'Вход в аккаунт'),
          el('form', [
            el('div.form__login.form__container.flex',
              [
                el('label.text-reset.form__label.ubuntu-medium', { htmlFor: 'loginInput' }, 'Логин'),
                el('input.form__input.ubuntu-regular', { id: 'loginInput', placeholder: 'Placeholder' })
              ]
            ),
            el('div.form__password.form__container.flex',
              [
                el('label.text-reset.form__label.ubuntu-medium', { htmlFor: 'passwordInput' }, 'Пароль'),
                el('input.form__input.ubuntu-regular', { id: 'passwordInput', placeholder: 'Placeholder' })
              ],
            ),
            el('button.btn-reset.btn-primary.ubuntu-medium.form__btn#enterBtn', { type: 'submit' }, 'Войти')
          ])
        ])
      )
    ))
}

export function addNotify(type, message) {
  if (type == 'warning' || type == 'error' || type == 'success' || type == 'information') {
    if (!document.querySelector('.notification-container')) {
      const drawing =
        svg("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          svg('path', { d: "M12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41L12.59 0Z", fill: "#BA0000" })
        )


      const notify = el(`div.notification-container.opacity.flex.${type}`,
        [
          el('p.text-reset.ubuntu-regular.notification__text', `${message}`),
          el('button.btn-reset.btn-notification#btnNotify')
        ]
      )
      mount(document.body, notify)
      mount(document.getElementById('btnNotify'), drawing)
      document.querySelector('.notification-container').classList.add('opacity')


      setTimeout(() => {
        if (document.querySelector('.notification-container')) {
          document.querySelector('.notification-container').classList.remove('opacity')
        }
      }, 2000)
    } else {
      document.querySelector('.notification-container').classList.add('opacity')
      setTimeout(() => {
        document.querySelector('.notification-container').classList.remove('opacity')
      }, 2000)
    }
  } else {
    alert('Разработчик неправильно прописал оповещение')
  }
}
