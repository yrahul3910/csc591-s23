module.exports = {
    'root': true,
    'env': {
        'browser': true,
        'node': true,
        'mocha': true
    },
    'extends': ['eslint:recommended'],
    'parserOptions': {
        'ecmaVersion': 7,
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true
        },
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 1
    }
};
