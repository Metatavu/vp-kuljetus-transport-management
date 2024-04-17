namespace DataValidation {
  export const validateValueIsNotUndefinedNorNull = <T>(value: null | undefined | T): value is T => {
    return value !== null && value !== undefined;
  };
}

export default DataValidation;