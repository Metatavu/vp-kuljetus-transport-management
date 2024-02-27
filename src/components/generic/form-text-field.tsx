import { TextField, TextFieldProps } from "@mui/material";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface CustomGenericFormTextFieldProps {
  clearErrors?: () => void;
  forceError?: boolean;
}

interface GenericTextfieldProps<T extends FieldValues> extends UseControllerProps<T> {
  textFieldProps: TextFieldProps;
  customProps?: CustomGenericFormTextFieldProps;
  children?: React.ReactNode;
  callbackFunction?: () => void;
}

const GenericFormTextfield = <T extends FieldValues>({
  name,
  control,
  rules,
  textFieldProps,
  children,
  customProps,
  callbackFunction,
}: GenericTextfieldProps<T>) => (
  <Controller
    rules={rules}
    name={name}
    control={control}
    render={({ field: { ref, onChange, ...field }, fieldState }) => (
      <TextField
        {...field}
        {...textFieldProps}
        inputRef={ref}
        onChange={(event) => {
          onChange(event);
          callbackFunction?.();
          customProps?.clearErrors?.();
        }}
        required={!!rules?.required}
        error={customProps?.forceError || fieldState.error !== undefined}
        helperText={fieldState.error !== undefined ? fieldState.error.message : null}
      >
        {children}
      </TextField>
    )}
  />
);

export default GenericFormTextfield;
