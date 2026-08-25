const globals = require("globals");

module.exports = [
    {
        files: ["**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: globals.node
        },

        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "double"]
        }
    },

    {
        files: ["tests/**/*.js"],

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            }
        }
    }
];