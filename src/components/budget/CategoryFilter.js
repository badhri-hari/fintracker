import React, { useState, useEffect, useContext } from "react";
import {
  Select,
  Box,
  FormLabel,
  Button,
  Heading,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { ThemeContext } from "../settings/ThemeContext";

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  const { colorMode } = useContext(ThemeContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const categoriesQuery = query(
        collection(db, "categories"),
        where("userId", "==", auth?.currentUser?.uid)
      );

      try {
        const querySnapshot = await getDocs(categoriesQuery);
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().categoryName,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    onSelectCategory(selectedValue);
  };

  const handleClearFilter = () => {
    onSelectCategory("");
  };

  return (
    <Box>
      <Box textAlign="center">
        <Heading size="md" mb="7.5px">
          By Category
        </Heading>
      </Box>
      <Divider
        my="4px"
        borderColor={colorMode === "dark" ? "gray.100" : "gray.700"}
      />
      <FormLabel mb="0px" mt="7.5px" fontSize="xs">
        Category
      </FormLabel>
      <Select
        bg={`${colorMode === "dark" ? "rgb(110, 110, 110)" : ""}`}
        placeholder="Select a category"
        value={selectedCategory}
        onChange={handleCategoryChange}
        mt={"1px"}
        mb={"3px"}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <VStack spacing={4}>
        <Button
          onClick={handleClearFilter}
          size="sm"
          mt="2"
          bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "gray.200"}`}
        >
          Clear Filter
        </Button>
      </VStack>
    </Box>
  );
}
