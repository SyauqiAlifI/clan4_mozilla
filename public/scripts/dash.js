const classes = ['', 'item--medium', 'item--large'];
const images = Array.from(document.getElementsByClassName("imgItem"));
images.forEach((image) => {
  const randomClass = classes[Math.floor(Math.random() * classes.length)];
  if (randomClass) {
    image.classList.add(randomClass);
  }
});