import next from "eslint-config-next";

export default [
  { ignores: [".next/**", "node_modules/**", "_source-photos/**", "public/**", "next-env.d.ts"] },
  ...next,
];
