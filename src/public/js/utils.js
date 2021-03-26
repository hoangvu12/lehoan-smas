HTMLElement.prototype.append = function (html) {
  this.insertAdjacentHTML("beforeend", html);
};

function findObjectInArray(array, property, value) {
  return array.find((object) => object[property] === value);
}
