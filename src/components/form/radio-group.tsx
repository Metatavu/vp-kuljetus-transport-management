import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useFieldContext } from "hooks/form";

export type RadioOption<T = string> = { value: T; label: string };

type Props<T> = {
  options: RadioOption<T>[];
  row?: boolean;
  labelPlacement?: "start" | "end" | "top" | "bottom";
};

export function FormRadioGroup<T>({ options, row, labelPlacement }: Props<T>) {
  const field = useFieldContext<T>();

  return (
    <RadioGroup
      row={row}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value as T)}
      onBlur={field.handleBlur}
    >
      {options.map(({ label, value }, index) => (
        <FormControlLabel
          // biome-ignore lint/suspicious/noArrayIndexKey: Order never changes
          key={index}
          value={value}
          label={label}
          control={<Radio />}
          labelPlacement={labelPlacement}
        />
      ))}
    </RadioGroup>
  );
}
