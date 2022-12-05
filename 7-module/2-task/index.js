import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
  }

  setTitle(title) {
    return (this.modalTitle = title);
  }

  setBody(body) {
    return (this.modalBody = body);
  }

  render() {

    const modalDiv = createElement(`
      <div class="modal">
      <!--Прозрачная подложка перекрывающая интерфейс-->
      <div class="modal__overlay"></div>

      <div class="modal__inner">
        <div class="modal__header">
          <!--Кнопка закрытия модального окна-->
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>

          <h3 class="modal__title">
            ${this.modalTitle}
          </h3>
        </div>

        <div class="modal__body">
          ${this.modalBody.innerHTML}
        </div>
      </div>
    `)

    return modalDiv;
  }

  open() {
    let body = document.querySelector('body');
    body.append(this.render());
    body.classList.add('is-modal-open');

    this.closeMethod()
  }

  closeMethod() {

    function closeFn() {
      let body = document.querySelector('body');
      let modal = document.querySelector('.modal');
      modal.remove();
      body.classList.remove('is-modal-open');
    };

    function closeEsc(ev) {
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

    this.close = function () {
      closeFn();
      document.removeEventListener('keydown', closeEsc);
    }

  }

}
