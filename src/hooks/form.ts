import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormCheckbox } from "components/form/checkbox";
import { FormRadioGroup } from "components/form/radio-group";
import { FormSubmitButton } from "components/form/submit-button";
import { FormTextField } from "components/form/textfield";

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FormTextField,
    FormCheckbox,
    FormRadioGroup,
  },
  formComponents: {
    FormSubmitButton,
  },
  fieldContext,
  formContext,
});
