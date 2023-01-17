export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.elem = this.render();
    // this.sliderChangeEvStart();
  }

  render() {
    const sliderDiv = document.createElement('div');
    sliderDiv.classList.add('slider');

    //Ползунок слайдера с активным значением
    const sliderThumbDiv = document.createElement('div');
    sliderThumbDiv.classList.add('slider__thumb');

    const sliderValueDiv = document.createElement('span');
    sliderValueDiv.classList.add('slider__value');
    sliderValueDiv.innerHTML = this.value;

    sliderThumbDiv.append(sliderValueDiv);

    //Заполненная часть слайдера
    const sliderProgressDiv = document.createElement('div');
    sliderProgressDiv.classList.add('slider__progress');
    sliderProgressDiv.style.width = 0;

    //Шаги слайдера
    const sliderStepsDiv = document.createElement('div');
    sliderStepsDiv.classList.add('slider__steps');
    for (let i = 0; i < this.steps; i++) {
      let step = document.createElement('span');
      if (i === 0) {
        step.classList.add('slider__step-active');
      }
      sliderStepsDiv.append(step)};

    //Сборка верстки
    sliderDiv.append(sliderThumbDiv);
    sliderDiv.append(sliderProgressDiv);
    sliderDiv.append(sliderStepsDiv);

    //обработчик изменения значения
    let segments = this.steps - 1;

    sliderDiv.addEventListener('click', function(ev) {
      let left = ev.clientX - sliderDiv.getBoundingClientRect().left;
      let leftRelative = left / sliderDiv.offsetWidth;
      let approximateValue = leftRelative * segments;
      let value = Math.abs(Math.round(approximateValue));

      sliderValueDiv.innerHTML = value;

      sliderThumbDiv.style.left = (100*value/segments + '%');

      sliderProgressDiv.style.width = (100*value/segments + '%');

      for (let i = 0; i < sliderStepsDiv.childNodes.length; i++) {
        sliderStepsDiv.childNodes[i].classList.remove('slider__step-active')
      };
      sliderStepsDiv.childNodes[value].classList.add('slider__step-active');

      const sliderChangeEv = new CustomEvent('slider-change', {
        detail: value,
        bubbles: true
      });
  
      sliderDiv.dispatchEvent(sliderChangeEv);

    })

    return sliderDiv;

  }

  // sliderChangeEvStart() {
  //   const sliderChangeEv = new CustomEvent('slider-change', {
  //     detail: this.value,
  //     bubbles: true
  //   });

  //   // console.log(sliderChangeEv);

  //   this.elem.dispatchEvent(sliderChangeEv);
  // }
  
}
