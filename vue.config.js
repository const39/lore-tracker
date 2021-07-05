module.exports = {
	transpileDependencies: ["vuetify"],
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				appId: "com.electron.lore-tracker",
				win: {
					target: [
						{
							target: "nsis",
						},
						{
							target: "portable",
						},
					],
				},
			},
		},
	},
};
