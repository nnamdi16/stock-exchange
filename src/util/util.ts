export const getAmount = (value: string) => {
  return parseFloat(value);
};

export const addMinutesToDate = (
  minutes: number,
  date: Date = new Date(),
): Date => {
  const newDate: Date = new Date(date);

  return new Date(newDate.setMinutes(newDate.getMinutes() + minutes));
};

export const subtractMinutesFromDate = (
  minutes: number,
  date: Date = new Date(),
): Date => {
  const newDate: Date = new Date(date);

  return new Date(newDate.setMinutes(newDate.getMinutes() - minutes));
};
