module.exports = {
  extends: ["@cybozu/eslint-config/presets/typescript-prettier"],
  globals: {
    kintone: false,
  },
  rules: {
    "no-case-declarations": "off",
  },
};
