import React from 'react'
import { Form, Formik } from 'formik'
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box, Button, Input } from '@chakra-ui/react';
import Wrapper from '../components/wrapper';
import InputField from '../components/inputField';

interface registerProps
{

}

const Register: React.FC<registerProps> = () =>
{
    return (
        <Wrapper variant="small"> 
            <Formik 
                initialValues={ {username: "", password: ""} }
                onSubmit={ (value) => {console.log(value)} }
            >
            {
                ({isSubmitting}) => 
                (
                    <Form>
                        <InputField
                            name="username"
                            placeholder=""
                            label="Username"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder=""
                                label="Password"
                                type="password"
                            />
                        </Box>
                            <Button mt={4} type="submit" 
                            color="teal" isLoading={isSubmitting}>
                                Register
                            </Button>
                    </Form>
                )
            }
            </Formik>
        </Wrapper>
    );
}

export default Register;
