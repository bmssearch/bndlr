module.exports = {
  packagerConfig: {
    icon: "./public/app_icon",
    platform: ["win32", "darwin"],
    protocols: [
      {
        name: "bndlr",
        schemes: ["bndlr"],
      },
    ],
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "bmssearch",
          name: "bndlr",
        },
        prerelease: true,
      },
    },
  ],
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "bndlr",
        iconUrl:
          "https://www.dropbox.com/s/irc2mk6l7n8zrm6/app_icon_win.ico?dl=1",
      },
    },
    {
      name: "@electron-forge/maker-zip",
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/renderer/main/index.html",
              js: "./src/renderer/main/index.ts",
              name: "main_window",
              preload: {
                js: "./src/api/preload.ts",
              },
            },
            {
              html: "./src/renderer/preferences/index.html",
              js: "./src/renderer/preferences/index.tsx",
              name: "preferences_window",
              preload: {
                js: "./src/api/preload.ts",
              },
            },
          ],
        },
      },
    ],
  ],
};
