import { useState, useCallback, useRef } from 'react';
import { z } from 'zod';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

interface UseSecureFormOptions<T> {
  initialValues: T;
  schema: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Secure form hook with Zod validation
 */
export function useSecureForm<T extends Record<string, unknown>>({
  initialValues,
  schema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseSecureFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false,
  });

  const submitAttempted = useRef(false);

  const validateField = useCallback(
    (name: keyof T, value: unknown): string | undefined => {
      try {
        // For single field validation, we validate the entire form and extract field error
        const testValues = { ...state.values, [name]: value };
        schema.parse(testValues);
        return undefined;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(e => e.path[0] === name);
          return fieldError?.message;
        }
        return 'Valor inválido';
      }
    },
    [schema, state.values]
  );

  const validateForm = useCallback((): boolean => {
    try {
      schema.parse(state.values);
      setState(prev => ({ ...prev, errors: {}, isValid: true }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as keyof T;
          if (!errors[field]) {
            errors[field] = err.message;
          }
        });
        setState(prev => ({ ...prev, errors, isValid: false }));
      }
      return false;
    }
  }, [schema, state.values]);

  const setFieldValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setState(prev => {
        const newValues = { ...prev.values, [name]: value };
        let newErrors = prev.errors;
        
        if (validateOnChange || submitAttempted.current) {
          const error = validateField(name, value);
          newErrors = { ...prev.errors, [name]: error };
        }
        
        return {
          ...prev,
          values: newValues,
          errors: newErrors,
        };
      });
    },
    [validateField, validateOnChange]
  );

  const setFieldTouched = useCallback(
    (name: keyof T) => {
      setState(prev => {
        let newErrors = prev.errors;
        
        if (validateOnBlur) {
          const error = validateField(name, prev.values[name]);
          newErrors = { ...prev.errors, [name]: error };
        }
        
        return {
          ...prev,
          touched: { ...prev.touched, [name]: true },
          errors: newErrors,
        };
      });
    },
    [validateField, validateOnBlur]
  );

  const handleChange = useCallback(
    (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : e.target.value;
      setFieldValue(name, value as T[keyof T]);
    },
    [setFieldValue]
  );

  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setFieldTouched(name);
    },
    [setFieldTouched]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      submitAttempted.current = true;

      if (!validateForm()) {
        return;
      }

      setState(prev => ({ ...prev, isSubmitting: true }));

      try {
        await onSubmit(state.values);
      } catch (error) {
        // Error handling is delegated to the onSubmit function
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }));
      }
    },
    [validateForm, onSubmit, state.values]
  );

  const reset = useCallback(() => {
    submitAttempted.current = false;
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
    });
  }, [initialValues]);

  const setValues = useCallback((values: Partial<T>) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, ...values },
    }));
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    reset,
    setValues,
    getFieldProps: (name: keyof T) => ({
      value: state.values[name],
      onChange: handleChange(name),
      onBlur: handleBlur(name),
      'aria-invalid': !!state.errors[name] && state.touched[name],
      'aria-describedby': state.errors[name] ? `${String(name)}-error` : undefined,
    }),
    getFieldError: (name: keyof T) => 
      state.touched[name] || submitAttempted.current ? state.errors[name] : undefined,
  };
}
