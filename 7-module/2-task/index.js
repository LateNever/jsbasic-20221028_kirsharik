import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.render();
  }

  setTitle(title) {
    const modalTitleEl = this.elem.querySelector('.modal__title');
    modalTitleEl.innerHTML = '';
    modalTitleEl.textContent = title;
  }

  setBody(body) {
    const modalBodyEl = this.elem.querySelector('.modal__body');
    modalBodyEl.innerHTML = '';
    modalBodyEl.append(body);
  }

  render() {

    this.elem = createElement(`
      <div class="modal">
      <!--Прозрачная подложка перекрывающая интерфейс-->
      <div class="modal__overlay"></div>

      <div class="modal__inner">
        <div class="modal__header">
          <!--Кнопка закрытия модального окна-->
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>

          <h3 class="modal__title"></h3>
        </div>

        <div class="modal__body"></div>
      </div>
    `)
  }

  open = () => {
    let body = document.querySelector('body');
    body.append(this.elem);
    body.classList.add('is-modal-open');

    this.closeMethod()
  }

  closeMethod = () => {

    const closeFn = () => {
      let body = document.querySelector('body');
      let modal = this.elem;
      modal.remove();
      body.classList.remove('is-modal-open');
    };

    const closeEsc = (ev) => {
      if (ev.code === 'Escape') {
        closeFn();
        document.removeEventListener('keydown', closeEsc);
      }
    };

    document.addEventListener('keydown', closeEsc);

    let closeBtn = document.querySelector('.modal__close');
    closeBtn.addEventListener('click', function() {
      closeFn();
      document.removeEventListener('keydown', closeEsc);    
    });

    this.close = () => {
      closeFn();
      document.removeEventListener('keydown', closeEsc);
    }

  }

}
