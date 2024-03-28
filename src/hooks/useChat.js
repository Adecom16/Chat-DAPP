import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getChat } from "../constant/contract";

const useChatContract = (providerOrSigner, receiverAddress) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Adjust this as needed
  const chatContract = getChat(providerOrSigner);

  const sendMessage = async (receiver, content) => {
    try {
      await chatContract.sendMessage(receiver, content);
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error sending message. Please try again.");
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const retrievedMessages = await chatContract.getMessages(
        receiverAddress,
        page,
        pageSize
      );
      setMessages(retrievedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Error fetching messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [receiverAddress, page, pageSize]);

  const loadMoreMessages = () => {
    setPage((prevPage) => prevPage + 1);
  };

useEffect(() => {
    const messageSentListener = chatContract.on(
      "MessageSent",
      (sender, receiver, content) => {
        console.log("New message received:", content);
        setMessages((prevMessages) => [...prevMessages, { sender, receiver, content }]);
      }
    );

    return () => {
      messageSentListener.then((listener) => {
        chatContract.removeListener("MessageSent", listener);
      }).catch((error) => {
        console.error("Error removing listener:", error);
      });
    };
  }, [chatContract]);


  return { messages, sendMessage, isLoading, error, loadMoreMessages };
};

export default useChatContract;
