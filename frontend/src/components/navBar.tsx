import { Box } from "@chakra-ui/react";

interface navBarProps
{

}

const NavBar: React.FC<navBarProps> = () =>
{

    return (
        <Box background="teal" padding="2">
            Navigation Bar
        </Box>
    );
};

export default NavBar;