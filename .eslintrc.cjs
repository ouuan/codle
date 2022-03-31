module.exports = {
  root: true,
  env: {
    browser: true,
    es2015: true,
  },
  extends: [
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  rules: {
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          './*.ts',
        ],
      },
    ],

    semi: 0,
    '@typescript-eslint/semi': 2,

    '@typescript-eslint/explicit-module-boundary-types': 0,

    '@typescript-eslint/no-explicit-any': 0,

    '@typescript-eslint/type-annotation-spacing': 2,

    'no-inner-declarations': 0,

    'max-statements-per-line': ['error', { max: 1 }],

    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 2,

    // for generic type parameters
    'no-spaced-func': 0,
    'func-call-spacing': 0,
    '@typescript-eslint/func-call-spacing': 2,

    // parameters with public/protected/private in class constructor
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 2,

    indent: 0,
    '@typescript-eslint/indent': [
      'error',
      2,
    ],

    'vue/block-lang': ['error',
      {
        script: {
          lang: 'ts',
        },
      },
    ],

    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: false,
    }],

    'vue/no-export-in-script-setup': 2,

    'vue/no-reserved-component-names': ['error', {
      disallowVue3BuiltInComponents: true,
    }],

    'vue/no-template-target-blank': 2,

    'vue/no-unregistered-components': 2,

    'vue/no-unused-refs': 2,

    'vue/no-useless-mustaches': 2,

    'vue/no-useless-v-bind': 2,

    'vue/no-v-text': 2,

    'vue/padding-line-between-blocks': 2,

    'vue/v-for-delimiter-style': ['error', 'of'],

    'vue/valid-define-emits': 2,

    'vue/valid-define-props': 2,

    'vue/valid-next-tick': 2,
  },
};
