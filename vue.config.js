module.exports = {
	transpileDependencies: ["vuetify"],
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				appId: "com.electron.lore-tracker",
				productName: "Lore Tracker",
				win: {
					target: ["nsis", "portable"],
				},
				nsis: {
					license: "LICENSE",
					artifactName: "${productName}_${version}_Installer.${ext}",
					oneClick: false,
					perMachine: false,
					allowToChangeInstallationDirectory: true
				},
				portable: {
					artifactName: "${productName}_${version}_Portable.${ext}",
				},
			},
		},
	},
};
