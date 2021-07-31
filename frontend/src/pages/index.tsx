import { Box, Flex } from "@chakra-ui/react";
import NavBar from "../components/navBar"

const Index = () => (
  <>
    <NavBar/>
    <Flex>
      <h1 style={{margin:"auto", padding:"40px", fontSize: "50px"}}>
        Main Page
      </h1>
    </Flex>
  </>
);

export default Index
