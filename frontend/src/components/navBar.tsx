import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { responsePathAsArray } from "graphql";
import NextLink from 'next/link'
import { useMeQuery } from '../generated/graphql';
interface navBarProps
{

}

const NavBar: React.FC<navBarProps> = () =>
{

    const [{data, fetching}] = useMeQuery();

    console.log(data);

    let body = null;

    if (fetching)
    {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr="4" color="white" padding="2">
                        Login
                    </Link>
                </NextLink>
                <NextLink href="/register">
                    <Link mr="4" color="white" padding="2">
                        Register
                    </Link>
                </NextLink>
            </>
        )
    }
    else if(!data?.Me)
    {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr="4" color="white" padding="2">
                        Login
                    </Link>
                </NextLink>
                <NextLink href="/register">
                    <Link mr="4" color="white" padding="2">
                        Register
                    </Link>
                </NextLink>
            </>
        )
    }
    else
    {
        body = (
            <>
            <Flex>
                <Box mr="4" color="white" >Welcome {data.Me.username}</Box>
                <Button mr="4" color="white" variant="link">Logout</Button>
            </Flex>
            </>
        )
    }

    return (
        <Flex background="teal" padding="2">
            <Box mr="auto">
            <NextLink href="/">
                    <Link mr="auto" color="white" padding="2">
                        Home
                    </Link>
                </NextLink>
            </Box>
            <Box ml="auto">
                { body }
            </Box>
        </Flex>
    );
};

export default NavBar;