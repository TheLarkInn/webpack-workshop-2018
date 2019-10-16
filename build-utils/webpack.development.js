module.exports = () => {
  return {
    module: {
      rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
}