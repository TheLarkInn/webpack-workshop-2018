export default function makeImage(url) {
  var image = document.createElement('img');
  image.src = url;
  return image;
}