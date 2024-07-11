module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
	],
	"overrides": [
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true,
		},
	},
	"plugins": [
		"@typescript-eslint",
	],
	"rules": {
		"indent": [ "error", "tab" ],
		"linebreak-style": [ "error", "windows" ],
		"quotes": [ "error", "double" ],
		"semi": [ "error", "always" ],
		"array-bracket-newline": [ "error", "consistent" ],
		"object-curly-newline": [
			"error",
			{
				"consistent": true,
			},
		],
		"function-paren-newline": [ "error", "consistent" ],
		"comma-dangle": [ "error", "always-multiline" ],
		"array-bracket-spacing": [ "error", "always" ],
		"object-curly-spacing": [ "error", "always" ],
		"comma-spacing": [ "error", { "before": false, "after": true } ],
		"react/react-in-jsx-scope": "off",
	},
};
