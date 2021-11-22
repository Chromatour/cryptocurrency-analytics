const numberFormatter = (num: number, digits: number = 2) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: ' K' },
    { value: 1e6, symbol: ' M' },
    { value: 1e9, symbol: ' B' },
    { value: 1e12, symbol: ' T' },
  ];
  const rx: RegExp = /\.0+$|(\.[0-9]*[1-9])0+$/;

  // Find the closest smaller value-symbol -pair
  const item: { value: number, symbol: string }
  | undefined = lookup.slice().reverse().find((lookupItem) => num >= lookupItem.value);

  // Initialise value and unit to situation no pair is found
  let value: string = num.toString();
  let unit: string = '';

  // Format value to match correct order of magnitude prefix
  if (item) {
    value = (num / item.value).toFixed(digits).replace(rx, '$1');
    unit = item.symbol;
  }

  const valueWithUnit: { value: string, unit: string } = {
    value,
    unit,
  };
  return valueWithUnit;
};

export default numberFormatter;
