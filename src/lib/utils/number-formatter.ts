const numberFormatter = (num: number, digits: number = 2) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: ' K' },
    { value: 1e6, symbol: ' M' },
    { value: 1e9, symbol: ' B' },
    { value: 1e12, symbol: ' T' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find((lookupItem) => num >= lookupItem.value);
  let value = '0';
  let unit = '0';
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
