import vuePlugin from 'eslint-plugin-vue'; // 引入 Vue 插件
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'; // 引入 @typescript-eslint 插件
import vueParser from 'vue-eslint-parser'; // 引入 vue-eslint-parser
import tsParser from '@typescript-eslint/parser'; // 引入 TypeScript 解析器

export default [
    {
        files: ['packages/**/*.ts', 'packages/**/*.tsx', 'packages/**/*.vue'],
        languageOptions: {
            parser: vueParser,  // 使用 vue-eslint-parser 来解析 .vue 文件
            parserOptions: {
                parser: tsParser,  // 为 .vue 文件内的 TypeScript 代码配置解析器
                ecmaVersion: 2020,  // 支持 ECMAScript 2020 特性
                sourceType: 'module',  // 允许使用 ES 模块（import/export）
                ecmaFeatures: {
                    jsx: true,  // 启用 JSX 支持（如果你使用 Vue 中的 JSX）
                },
            },
        },
        plugins: {
            vue: vuePlugin,  // Vue 插件
            '@typescript-eslint': typescriptEslintPlugin,  // TypeScript 插件
        },
        rules: {
            // Vue 规则
            'vue/no-unused-vars': 'warn',  // Vue 中的未使用变量警告
            'vue/no-unused-components': 'warn',  // 警告未使用的组件

            // TypeScript 规则
            '@typescript-eslint/no-unused-vars': 'error',  // TypeScript 中的未使用变量警告
            '@typescript-eslint/no-explicit-any': 'warn',  // 禁用显式的 any 类型
            '@typescript-eslint/explicit-module-boundary-types': 'warn',  // 强制定义函数返回类型
            '@typescript-eslint/no-inferrable-types': 'warn',
            'quotes': ['error', 'double']
        },
    },
];
