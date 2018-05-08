const makeImage = (url, height = 100, width = 100) => {
  const image = document.createElement("img");

  image.height = height;
  image.width = width;
  image.src = url;
  return image;
};

export default makeImage;
