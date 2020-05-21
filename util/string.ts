export const truncate = (str: string, length: number = 50) =>
  str.trim().length > length
    ? `${str.trim().substring(0, length)}...`
    : str.trim();
