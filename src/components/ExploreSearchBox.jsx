import React, { useEffect, useState } from "react";
import { Input, Box } from "@chakra-ui/react";

const ExploreSearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(searchTerm);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  return (
    <Box>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />
    </Box>
  );
};

export default ExploreSearchBox;
