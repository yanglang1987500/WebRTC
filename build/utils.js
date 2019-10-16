const env = process.env.NODE_ENV || "development";
const isDevelopment = env === "development";
const publicPath = isDevelopment ? "" : "/scripts/react/";

module.exports = {
  isDevelopment,
  env,
  publicPath
};
