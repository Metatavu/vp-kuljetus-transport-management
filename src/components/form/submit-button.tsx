import { LoadingButton } from "@mui/lab";
import { useFormContext } from "hooks/form";

type Props = {
  label: string;
};

export function FormSubmitButton({ label }: Props) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting, canSubmit: state.canSubmit })}>
      {({ canSubmit, isSubmitting }) => (
        <LoadingButton loading={isSubmitting} disabled={!canSubmit} type="submit" variant="contained">
          {label}
        </LoadingButton>
      )}
    </form.Subscribe>
  );
}
