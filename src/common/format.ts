export const percentFormat = (value: number) => `${value}%`;
export const reversedPercentFormat = (value: number) => `${100 - value}%`;
export const camelToKebabCase = (value: string) => value.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
export const camelToTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.replace(/[A-Z]/g, (c) => ` ${c}`).slice(1);
export const kebabToTitleCase = (value: string) => value.replace(/(^\w|-\w)/g, (s) => s.replace(/-/, " ").toUpperCase());
export const kebabToPascalCase = (value: string) => value.replace(/(^\w|-\w)/g, kebabReplacer);
export const kebabToCamelCase = (value: string) => value.replace(/-\w/g, kebabReplacer);

const kebabReplacer = (substring: string) => substring.replace(/-/, "").toUpperCase();

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
};
