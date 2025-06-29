const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "brainAgriculture",
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {},
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "brainAgriculture",
      filename: "remoteEntry.js",
      exposes: {
        "./AppComponent": "./src/app/app.component.ts",
        "./DashboardModule": "./src/app/features/dashboard/dashboard.module.ts",
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        "@ngrx/store": { singleton: true, strictVersion: true },
        "@ngrx/effects": { singleton: true, strictVersion: true },
      },
    }),
  ],
};
