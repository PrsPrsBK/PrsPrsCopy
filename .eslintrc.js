module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "func-style": [
      "error",
      "expression",
      {"allowArrowFunctions": true}
    ],
    "indent": [
      "error",
      2,
      {"SwitchCase": 1}
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "no-console": [
      "error",
      {"allow": ["log", "debug"]}
    ],
    "no-use-before-define": [
      "error",
      {"functions": true,
        "classes": true,
        "variables": true}
    ],
    "prefer-const": [
      "error", {
        "ignoreReadBeforeAssign": true
      }
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
