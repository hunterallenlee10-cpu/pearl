import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "node_modules/**", "_source-photos/**", "public/**", "next-env.d.ts"] },
  ...next,
];

export default config;
