
export const type = <T>(obj: T) => {
  const type = Object.prototype.toString.call(obj);
  return type.substring(8, type.length - 1);
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};