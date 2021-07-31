import React from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, Flex, Heading} from '@chakra-ui/react';
import Wrapper from '../components/wrapper';
import InputField from '../components/inputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NavBar from '../components/navBar';

interface registerProps
{

}

const Register: React.FC<registerProps> = () =>
{
    const [_, register] = useRegisterMutation();

    const router = useRouter()

    return (
        <>
            <NavBar/>
            <Heading textAlign="center"> Register </Heading>
            <Wrapper variant="small"> 
                <Formik 
                    initialValues={ {username: "", password: ""} }
                    onSubmit=
                    { 
                    async (value, {setErrors}) => 
                        {
                            console.log(value);
                            const resp = await register(value);

                            console.log(resp.data);

                            if (resp.data?.Register.errors)
                            {
                                setErrors( toErrorMap(resp.data.Register.errors))
                            } 
                            else if (resp.data?.Register.user)
                            {
                                router.push("/")
                            }
                        }
                    }
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
        </>
    );
}

export default Register;
