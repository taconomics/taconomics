import { Box, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { Field } from "formik";
import React from "react";

export default function InputValidator(props: { name, placeholder?, label, w?, validate?, children? }) {
    let { name, placeholder, label, w, validate,children } = props;
    validate = validate ? validate : validateString;
    placeholder = placeholder!=undefined ? placeholder : "Undefined";
    w = w ? w : "100%";
    
    children = children ? children : <Input backgroundColor="white"/>;

    
    const m = <Field name={name} validate={validate}>
        {({ field, form }) => {
           let newchildren = React.cloneElement(children,{id:name,placeholder:placeholder,...field})
            return (<FormControl isInvalid={form.errors[name] && form.touched[name]}>
                <FormLabel htmlFor={name}>{label}</FormLabel>
                {newchildren}
                <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
            </FormControl>)

        }}
    </Field>;
    return <Box w={w}>{m}</Box>;
}

function validateString(value) {
    let error
    if (!value) {
        error = "Field is required"
    }
    return error
}