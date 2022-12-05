import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = this.render();
  }

  render() {
    // корневой контенер меню
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('ribbon');
    
    // добавляем кнопки переключения
    const ribbonArrowLeft = document.createElement('button');
    ribbonArrowLeft.classList.add('ribbon__arrow', 'ribbon__arrow_left');
    ribbonArrowLeft.innerHTML = '<img src="/assets/images/icons/angle-icon.svg" alt="icon">'

    const ribbonArrowRight = document.createElement('button');
    ribbonArrowRight.classList.add('ribbon__arrow', 'ribbon__arrow_right', 'ribbon__arrow_visible');
    ribbonArrowRight.innerHTML = '<img src="/assets/images/icons/angle-icon.svg" alt="icon">'

    // добавляем див с категориями
    const ribbonInnerDiv = document.createElement('nav');
    ribbonInnerDiv.classList.add('ribbon__inner')

    this.categories.forEach(elem => {
      const categoryHtml = createElement(`
        <a href="#" class="ribbon__item" data-id=${elem.id}>${elem.name}</a>
      `);

      ribbonInnerDiv.append(categoryHtml);

    });

    // собираем верстку
    categoriesDiv.append(ribbonArrowLeft);
    categoriesDiv.append(ribbonInnerDiv);
    categoriesDiv.append(ribbonArrowRight);

    // прокрутка
    ribbonArrowRight.addEventListener('click', function() {
      ribbonInnerDiv.scrollBy(350, 0);
    });
  
    ribbonArrowLeft.addEventListener('click', function() {
      ribbonInnerDiv.scrollBy(-350, 0);
    });
    
    // отключение стрелок
    ribbonInnerDiv.addEventListener('scroll', function() {

      let scrollLeft = ribbonInnerDiv.scrollLeft;
      if (scrollLeft == 0) {ribbonArrowLeft.classList.remove('ribbon__arrow_visible')} 
      else ribbonArrowLeft.classList.add('ribbon__arrow_visible');

      let scrollWidth = ribbonInnerDiv.scrollWidth;
      let clientWidth = ribbonInnerDiv.clientWidth;
      let scrollRight = scrollWidth - scrollLeft - clientWidth;
      if (scrollRight < 1) {ribbonArrowRight.classList.toggle('ribbon__arrow_visible')}
      else ribbonArrowRight.classList.add('ribbon__arrow_visible');
    })

    // выбор категории
    categoriesDiv.addEventListener('click', function(ev) {
      const ribbonItems = document.querySelectorAll('.ribbon__item_active');
      ribbonItems.forEach(item => item.classList.remove('ribbon__item_active'));

      let ribbonItem = ev.target.closest('.ribbon__item');
      if (!ribbonItem) return;
      ev.preventDefault();

      ribbonItem.classList.add('ribbon__item_active');

      const ribbonSelectEv = new CustomEvent("ribbon-select", {
        detail: ribbonItem.dataset.id,
        bubbles: true
      });
  
      this.dispatchEvent(ribbonSelectEv);
    })

    return categoriesDiv;
  } // render
} // class RibbonMenu
