import { useEffect, useRef } from "react";
import { socket, connectSocket, disconnectSocket } from "../lib/socket";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export const useSocket = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const setCurrentUserId = useChatStore((state) => state.setCurrentUserId);
  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);
  const setTyping = useChatStore((state) => state.setTyping);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const updateMessageStatus = useChatStore(
    (state) => state.updateMessageStatus
  );
  const upsertConversation = useChatStore((state) => state.upsertConversation);
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId
  );

  const previousConversationIdRef = useRef(null);

  useEffect(() => {
    setCurrentUserId(authUser?._id || null);
  }, [authUser, setCurrentUserId]);

  useEffect(() => {
    if (!authUser) {
      disconnectSocket();
      return;
    }

    connectSocket(authUser);

    const handleConversationUpdate = (payload) => {
      if (!payload) return;
      upsertConversation({
        _id: payload.conversationId,
        lastMessage: payload.lastMessage,
        unreadCounts: payload.unreadCounts,
      });
    };

    const handleMessageNew = (message) => {
      if (!message?.conversationId) return;
      appendMessage(message.conversationId, message);
    };

    const handleMessageStatus = (payload) => {
      if (!payload?.messageId || !payload.userId) return;
      let conversationId = payload.conversationId;
      if (!conversationId) {
        const { messagesByConversation } = useChatStore.getState();
        for (const [candidateId, bucket] of Object.entries(
          messagesByConversation
        )) {
          if (
            bucket.items.some((message) => message._id === payload.messageId)
          ) {
            conversationId = candidateId;
            break;
          }
        }
      }

      if (!conversationId) conversationId = activeConversationId;
      if (!conversationId) return;
      updateMessageStatus(conversationId, payload);
    };

    const handlePresence = (userIds) => {
      setOnlineUsers(userIds || []);
    };

    const handleTyping = ({ conversationId, userId, isTyping }) => {
      if (!conversationId || !userId) return;
      if (userId === authUser?._id) return;
      setTyping(conversationId, userId, Boolean(isTyping));
    };

    socket.on("conversation:update", handleConversationUpdate);
    socket.on("message:new", handleMessageNew);
    socket.on("message:status", handleMessageStatus);
    socket.on("presence:update", handlePresence);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("conversation:update", handleConversationUpdate);
      socket.off("message:new", handleMessageNew);
      socket.off("message:status", handleMessageStatus);
      socket.off("presence:update", handlePresence);
      socket.off("typing", handleTyping);
    };
  }, [
    authUser,
    appendMessage,
    setOnlineUsers,
    setTyping,
    updateMessageStatus,
    upsertConversation,
    activeConversationId,
  ]);

  useEffect(() => {
    if (!socket.connected) return;
    const previousConversationId = previousConversationIdRef.current;
    if (
      previousConversationId &&
      previousConversationId !== activeConversationId
    ) {
      socket.emit("conversation:leave", previousConversationId);
    }

    if (activeConversationId) {
      socket.emit("conversation:join", activeConversationId);
    }

    previousConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  return socket;
};
