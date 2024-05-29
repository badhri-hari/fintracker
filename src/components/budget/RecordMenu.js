import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { MdMoreVert } from "react-icons/md";

import DeleteTransactionModal from "./DeleteTransactionModal";
import EditTransactionModal from "./EditTransactionModal";

export default function RecordMenu({
  transactionId,
  transactionRecordName,
  transactionDate,
  transactionAmount,
  transactionCategory,
}) {
  const [isDeleteTransactionsModalOpen, setIsDeleteTransactionsModalOpen] =
    useState(false);
  const [isEditTransactionsModalOpen, setIsEditTransactionsModalOpen] =
    useState(false);

  const openDeleteTransactionsModal = () => {
    setIsDeleteTransactionsModalOpen(true);
  };

  const closeDeleteTransactionsModal = () => {
    setIsDeleteTransactionsModalOpen(false);
  };

  const openEditTransactionsModal = () => {
    setIsEditTransactionsModalOpen(true);
  };

  const closeEditTransactionsModal = () => {
    setIsEditTransactionsModalOpen(false);
  };

  return (
    <Menu>
      <Tooltip
        hasArrow
        bg="gray.600"
        color="white"
        label="Options to edit or delete this transaction"
        openDelay={500}
        closeDelay={50}
        placement="left"
        aria-label="Tooltip to let you know that if you click on this menu, you can see the options to edit or delete this specific transaction."
      >
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<MdMoreVert />}
          variant="ghost"
          size="sm"
        />
      </Tooltip>
      <MenuList>
        <MenuItem icon={<DeleteIcon />} onClick={openDeleteTransactionsModal}>
          Delete Transaction
        </MenuItem>

        <MenuItem icon={<EditIcon />} onClick={openEditTransactionsModal}>
          Edit Transaction
        </MenuItem>
      </MenuList>

      {isDeleteTransactionsModalOpen && (
        <DeleteTransactionModal
          transactionId={transactionId}
          transactionRecordName={transactionRecordName}
          transactionDate={transactionDate}
          onClose={closeDeleteTransactionsModal}
        />
      )}

      {isEditTransactionsModalOpen && (
        <EditTransactionModal
          transactionId={transactionId}
          transactionRecordName={transactionRecordName}
          transactionDate={transactionDate}
          transactionCategory={transactionCategory}
          transactionAmount={transactionAmount}
          onClose={closeEditTransactionsModal}
        />
      )}
    </Menu>
  );
}
