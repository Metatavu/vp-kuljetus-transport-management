import { useEffect, useState } from "react";

type Props<T> = {
  promise: Promise<T>;
  valueGetter: (promiseResult: T) => string;
};

const AsyncDataGridCell = <T,>({ promise, valueGetter }: Props<T>) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const getValue = async (promise: Promise<T>) => setValue(valueGetter(await promise));

  useEffect(() => {
    getValue(promise);
  }, [promise, getValue]);

  return <>{value}</>;
};

export default AsyncDataGridCell;
