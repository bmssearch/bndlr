module.exports = {
  packagerConfig: {
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
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
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
