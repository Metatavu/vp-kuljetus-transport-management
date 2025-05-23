import { LoadingButton } from "@mui/lab";
import { useFormContext } from "hooks/form";

type Props = {
  label: string;
};

export function FormSubmitButton({ label }: Props) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
        canSubmit: state.canSubmit,
        isDirty: state.isDirty,
        isDefaultValue: state.isDefaultValue,
      })}
    >
      {({ canSubmit, isSubmitting, isDirty, isDefaultValue }) => (
        <LoadingButton
          loading={isSubmitting}
          disabled={!canSubmit || !isDirty || isDefaultValue}
          type="submit"
          variant="contained"
        >
          {label}
        </LoadingButton>
      )}
    </form.Subscribe>
  );
}
