/* eslint-disable */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "module:react-native-dotenv",
      // "module-resolver",
      {
        moduleName: "@env",
        path: ".env",
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        // alias: {
        //   "^@firebase/(.*)": "@firebase/\\1",
        // }
      }
    ]
  ]
};
