import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.render();
  }

  render() {
    const productGridDiv = createElement(`<div class="products-grid">`);
    const productGridInnerDiv = createElement(`<div class="products-grid__inner">`);
    productGridDiv.append(productGridInnerDiv);

    this.products.forEach(function(item) {
      let card = new ProductCard(item);
      productGridInnerDiv.append(card.elem);
    })

    return productGridDiv
  }

  updateFilter = (filters) => {

    Object.assign(this.filters, filters);
    let filtersRes = this.filters;

    function filterProduct(item) {
    
    let checkNuts = ( !(filtersRes.noNuts === item.nuts) || (filtersRes.noNuts === undefined) );
    let checkVegeterian = (filtersRes.vegeterianOnly === item.vegeterian) || (filtersRes.vegeterianOnly === undefined);
    if (filtersRes.vegeterianOnly === false) checkVegeterian = true;
    let checkSpiciness = (filtersRes.maxSpiciness >= item.spiciness) || (filtersRes.maxSpiciness == undefined);
    let checkCategory = (filtersRes.category === item.category) || (filtersRes.category === undefined) || (filtersRes.category === '');

    if (checkNuts && checkVegeterian && checkSpiciness && checkCategory) {
      return true}
    else {
      return false}
    }

    let productsFiltered = this.products.filter(item => filterProduct(item));

    let productGridFilteredInnerDiv = this.elem.querySelector('.products-grid__inner');

    productGridFilteredInnerDiv.innerHTML = '';

    productsFiltered.forEach(function(item) {
        let card = new ProductCard(item);
        productGridFilteredInnerDiv.append(card.elem);
      })
  }
}