const toNumericStringWithDivider = (value: number, divider = " ") =>
  `${value}`
    .replace(/\s/g, "")
    .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${divider}`);

export default toNumericStringWithDivider;
