module.exports = [
      { ignores: ['node_modules/**', '.next/**'] },
      // Spread Next's predefined flat config (it exports an array)
      ...require('eslint-config-next/core-web-vitals'),
];
