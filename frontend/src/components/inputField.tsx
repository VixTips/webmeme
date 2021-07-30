import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    name: string
};


//strip off size...
const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) =>
{
    const [field] = useField(props);

    return (
        <FormControl>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input 
                {...field}
                {...props}
                onChange={field.onChange}
                id={field.name}
            />
        </FormControl>
    );
}


export default InputField;
