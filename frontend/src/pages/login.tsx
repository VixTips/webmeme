import React from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, Heading} from '@chakra-ui/react';
import Wrapper from '../components/wrapper';
import InputField from '../components/inputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NavBar from '../components/navBar';

interface loginProps
{

}

const Login: React.FC<loginProps> = () =>
{
    const [_, login] = useLoginMutation();

    const router = useRouter()

    return (
        <>
            <NavBar/>
            <Heading textAlign="center"> Login </Heading>
            <Wrapper variant="small"> 
                <Formik 
                    initialValues={ {username: "", password: ""} }
                    onSubmit=
                    { 
                    async (value, {setErrors}) => 
                        {
                            console.log(value);
                            const resp = await login({loginOptions: value});

                            console.log(resp.data);

                            if (resp.data?.Login.errors)
                            {
                                setErrors( toErrorMap(resp.data.Login.errors))
                            } 
                            else if (resp.data?.Login.user)
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
                                    Login
                                </Button>
                        </Form>
                    )
                }
                </Formik>
            </Wrapper>
        </>
    );
}

export default Login;
