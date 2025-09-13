import { type Config } from "prettier";

const config: Config = {
  trailingComma: "all",
  tabWidth: 4,
  semi: true,
  singleQuote: true,
  objectWrap: "collapse",
  quoteProps: "as-needed",
  bracketSameLine: false,
  endOfLine: "lf",
  printWidth: 80,
  arrowParens: "always",
};

export default config;