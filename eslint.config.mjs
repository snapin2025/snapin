// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import query from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends('next/core-web-vitals', 'next/typescript'), {
  plugins: {
    '@tanstack/query': query,
    prettier,
  },
  rules: {
    // Включаем рекомендуемые правила
    ...query.configs.recommended.rules,
    'prettier/prettier': 'warn',
  },
}, prettierConfig, {
  ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
}, ...storybook.configs["flat/recommended"]];

export default eslintConfig;
