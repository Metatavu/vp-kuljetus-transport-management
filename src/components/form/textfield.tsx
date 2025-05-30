import { TextField, TextFieldProps } from "@mui/material";
import { useFieldContext } from "hooks/form";

type Props = Omit<TextFieldProps, "name" | "value" | "onChange" | "onBlur">;

export function FormTextField(props: Props) {
  const field = useFieldContext<string | undefined>();

  return (
    <TextField
      name={field.name}
      value={field.state.value ?? ""}
      onChange={(e) => field.handleChange(e.target.value ?? undefined)}
      onBlur={field.handleBlur}
      error={!!field.state.meta.errors.length}
      helperText={field.state.meta.errors.map((error) => error.message).join(", ")}
      {...props}
    />
  );
}
