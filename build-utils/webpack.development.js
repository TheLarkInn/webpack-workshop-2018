module.exports = (env) => {
  console.log(env);
  return {
    output: {
      filename: 'development-bundle.js',
    },
  };
};
