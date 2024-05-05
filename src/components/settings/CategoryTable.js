import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import {
  Input,
  Table,
  Thead,
  Tr,
  useToast,
  Th,
  Tbody,
  Td,
  IconButton,
  Button,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, CheckIcon } from "@chakra-ui/icons";

import DeleteCategoryModal from "./DeleteCategoryModal";

export default function CategoryTable() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentCategoryName, setCurrentCategoryName] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      const categoryDatabase = query(
        collection(db, "categories"),
        where("userId", "==", auth?.currentUser?.uid)
      );
      const unsubscribe = onSnapshot(categoryDatabase, (querySnapshot) => {
        const categories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categories);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") {
      toast({
        title: "Oops!",
        description: "The category name cannot be blank.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }

    const newCategoryId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    try {
      await setDoc(doc(db, "categories", newCategoryId), {
        name: newCategoryName,
        categoryId: newCategoryId,
        userId: auth?.currentUser?.uid,
        dateCreated: new Date(),
      });

      setNewCategoryName("");

      toast({
        title: "Success!",
        description: `${newCategoryName} was created successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    } catch (error) {
      toast({
        title: "Uh oh!",
        description:
          "There was an error adding the category, please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  };

  const handleEditCategory = async (id) => {
    if (editingCategoryName.trim() === "") {
      toast({
        title: "Oops!",
        description: "The category name cannot be blank.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }

    const categoryRef = doc(db, "categories", id);
    const batch = writeBatch(db);

    batch.update(categoryRef, { name: editingCategoryName });

    try {
      await batch.commit();

      setEditingCategory(null);
      setEditingCategoryName("");

      toast({
        title: "Success!",
        description: `The category name was changed successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    } catch (error) {
      toast({
        title: "Uh oh!",
        description:
          "There was an error while updating the category, please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => { // handleDeleteCategory requires the 'categoryId' of the category that is to be deleted
    const batch = writeBatch(db);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("categoryId", "==", categoryId)
    );

    const transactionsToBeDeleted0 = await getDocs(transactionsQuery); // The transactions which belong to the category are fetched

    transactionsToBeDeleted0.forEach((transactionDoc) => {
      const transactionsToBeDeleted1 = doc(db, "transactions", transactionDoc.id);
      batch.delete(transactionsToBeDeleted1);
    });

    const categoryToBeDeleted = doc(db, "categories", categoryId); // The category itself is removed from the database
    batch.delete(categoryToBeDeleted);

    try {
      await batch.commit(); // If the promise is successfully returned, then the success message is displayed
      toast({
        title: "Success!",
        description: `The category and its associated transactions were deleted successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    } catch (error) {
      console.error("Error deleting category:", error) // Displays an error message in the console
      toast({
        title: "Uh oh!",
        description:
          "There was an error while deleting the category and its transactions, please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    }

    setIsDeleteModalOpen(false); // Closes the delete modal regardless of whether the category deletion was successful or not
  };

  const openDeleteModal = (categoryId, categoryName) => {
    setCurrentCategoryId(categoryId);
    setCurrentCategoryName(categoryName);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <Table variant="simple" border="1px" borderColor="gray.500">
      <Thead>
        <Tr>
          <Th border="1px" borderColor="gray.500">
            Category
          </Th>
          <Th border="1px" borderColor="gray.500">
            Actions
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {categories.map((category) => (
          <Tr key={category.id}>
            <Td border="1px" borderColor="gray.500">
              {editingCategory === category.id ? (
                <Input
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
              ) : (
                category.name
              )}
            </Td>
            <Td border="1px" borderColor="gray.500">
              {editingCategory === category.id ? (
                <IconButton
                  aria-label="Confirm Edit"
                  icon={<CheckIcon />}
                  onClick={() => handleEditCategory(category.id)}
                />
              ) : (
                <HStack spacing={0}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    onClick={() => {
                      setEditingCategory(category.id);
                      setEditingCategoryName(category.name);
                    }}
                  />
                  <IconButton
                    ml="15px"
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => openDeleteModal(category.id, category.name)}
                  />
                </HStack>
              )}
            </Td>
          </Tr>
        ))}
        <Tr>
          <Td border="1px" borderColor="gray.500">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New Category"
            />
          </Td>
          <Td border="1px" borderColor="gray.500">
            <Button onClick={handleAddCategory}>
              Add <AddIcon ml="8px" />
            </Button>
          </Td>
        </Tr>
      </Tbody>
      {isDeleteModalOpen && (
        <DeleteCategoryModal
          categoryId={currentCategoryId}
          categoryName={currentCategoryName}
          onClose={closeDeleteModal}
          onDelete={() => handleDeleteCategory(currentCategoryId)}
        />
      )}
    </Table>
  );
}
