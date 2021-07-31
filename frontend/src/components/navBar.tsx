import { Box, Flex, Link } from "@chakra-ui/react";
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
            <NextLink href="/login">
                <Link mr="4" color="white" padding="2">
                    Login
                </Link>
            </NextLink>
        )
    }
    else if(!data?.Me)
    {
        body = (
            <NextLink href="/login">
                <Link mr="4" color="white" padding="2">
                    Login
                </Link>
            </NextLink>
        )
    }
    else
    {
        body = (
            <NextLink href="/user">
                <Link mr="4" color="white" padding="2">
                    Welcome {data.Me.username}
                </Link>
            </NextLink>
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
                <NextLink href="/register">
                    <Link mr="4" color="white" padding="2">
                        Register
                    </Link>
                </NextLink>
            </Box>
        </Flex>
    );
};

export default NavBar;