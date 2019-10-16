const makeImage = (url, height = 100, width = 100) => {
    const img = document.createElement('img')
    img.src = url
    img.height = height
    img.width = width
    return img
}

export default makeImage