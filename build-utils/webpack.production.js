module.exports = (env) => {
  console.log(env);
  return {
    output: {
      filename: '[chunkhash].js',
    },
  };
};
