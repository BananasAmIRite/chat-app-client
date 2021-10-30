export function createTime(time: number) {
  time = time - new Date().getTimezoneOffset() * 60 * 1000;
  const dateValue = time % (24 * 60 * 60 * 1000);
  let hourValue = Math.floor((dateValue % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  let minValue = Math.floor(((dateValue % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / (60 * 1000)).toString();
  let ap;

  if (hourValue > 12) {
    hourValue = hourValue % 12;
    ap = 'PM';
  } else {
    ap = 'AM';
  }

  if (minValue.length === 1) minValue = `0${minValue}`;

  return `${hourValue}:${minValue} ${ap}`;
}

export function createDate(d: Date);
export function createDate(d: string);
export function createDate(d: string | Date) {
  const date = new Date(d);
  const currentDate = new Date();
  if (
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate() &&
    currentDate.getFullYear() === date.getFullYear()
  ) {
    // same day, same month, same year
    return `Today at ${createTime(date.getTime())}`;
  } else if (
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() === date.getDate() + 1 &&
    currentDate.getFullYear() === date.getFullYear()
  ) {
    // yesterday, same month, same year
    return `Yesterday at ${createTime(date.getTime())}`;
  } else {
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  }
}
