import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

function ChatLoading() {
  return (
    <Stack>
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
      <Skeleton height="45px" borderRadius="lg" />
    </Stack>
  );
}

export default ChatLoading;
