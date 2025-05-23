import { Checkbox, FormControlLabel } from "@mui/material";
import { useFieldContext } from "hooks/form";

type Props = {
  label: string;
  labelPlacement?: "start" | "end" | "top" | "bottom";
};

export function FormCheckbox({ label, labelPlacement }: Props) {
  const field = useFieldContext<boolean>();

  return (
    <FormControlLabel
      name={field.name}
      label={label}
      labelPlacement={labelPlacement}
      control={
        <Checkbox
          checked={field.state.value}
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
        />
      }
    />
  );
}
