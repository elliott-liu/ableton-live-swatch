/**
 * @type {import("prettier").Config &
 *        import("prettier-plugin-tailwindcss").PluginOptions &
 *        import("@trivago/prettier-plugin-sort-imports").PluginConfig}
 */
const config = {
	semi: true,
	singleQuote: false,
	tabWidth: 2,
	useTabs: true,
	plugins: [
		"@trivago/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	tailwindFunctions: ["clsx", "cn", "cva"],
	tailwindStylesheet: "./app/globals.css",
};

export default config;
