import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  VStack,
  Image,
  Text,
  Heading,
  Divider,
  AbsoluteCenter,
  Skeleton,
  Card,
  CardFooter,
  Link,
  CardBody,
  Stack,
} from "@chakra-ui/react";

import { ThemeContext } from "../settings/ThemeContext";

export default function News() {
  const { colorMode } = useContext(ThemeContext);

  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3001/news/api", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data.articles);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <VStack
      bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "white"}`}
      borderColor="white"
      borderRadius="20px"
      p="10px"
      spacing={4}
      flex={1}
      h="100%"
      overflowY="auto"
    >
      <Box position="relative" w="100%" p="16px">
        <Divider borderColor="black" borderWidth="1px" />
        <AbsoluteCenter
          bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "white"}`}
          px="4"
          fontSize="2xl"
        >
          <Heading
            size="lg"
            bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "white"}`}
          >
            Latest Financial News
          </Heading>
        </AbsoluteCenter>
      </Box>
      {isLoading ? (
        <>
          <Skeleton height="200px" width="100%" fadeDuration={1} />
          <Skeleton height="200px" width="100%" fadeDuration={1} />
          <Skeleton height="200px" width="100%" fadeDuration={1} />
        </>
      ) : (
        news.map((article, index) => (
          <Box
            key={index}
            bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "gray.200"}`}
            borderRadius="lg"
            shadow="xl"
            p="6"
            m="2"
            borderWidth="1px"
            position="relative"
          >
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              maxH="250px"
              bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "gray.200"}`}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "100%", sm: "200px" }}
                src={article.urlToImage}
                alt="News Image"
              />
              <Stack>
                <CardBody>
                  <Heading size="md" noOfLines={4}>
                    {article.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.500" mt={2} mb={2}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Text>
                  <Text py="2" noOfLines={5}>
                    {article.description}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Link href={article.url} isExternal color="blue.500" mt={-12}>
                    Read more
                  </Link>
                </CardFooter>
              </Stack>
            </Card>
          </Box>
        ))
      )}
    </VStack>
  );
}
