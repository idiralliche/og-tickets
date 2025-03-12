module.exports = {
  jest: {
    configure: (jestConfig) => {
      return {
        ...jestConfig,
        // Map both "react-router-dom" and "react-router/dom" to the correct module path
        moduleNameMapper: {
          '^react-router-dom$': require.resolve('react-router-dom'),
          '^react-router/dom$': require.resolve('react-router-dom'),
        },
        moduleDirectories: ['node_modules', 'src'],
      };
    },
  },
};
