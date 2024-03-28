import React, { useState, useEffect } from "react";
import useChat from "../hooks/useChat";

const ChatApp = () => {
  const { provider, signer, contract, account } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (contract && account && receiver) {
        try {
          const messages = await contract.getMessages(account, receiver);
          setMessages(messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [contract, account, receiver]);

  const handleSendMessage = async () => {
    if (contract && signer && receiver && newMessage.trim()) {
      try {
        await contract.connect(signer).sendMessage(receiver, newMessage);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setImage(
        `https://maroon-recent-marmoset-248.mypinata.cloud/ipfs/${resData.IpfsHash}`
      );
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <img
                className="w-50 h-50 "
                src={image}
                alt="Avater"
              />
            </div>
            <div>
              <label className="form-label">Choose File</label>
              <input type="file" onChange={changeHandler} />
              <button
                onClick={handleSubmission}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Chat App</h1>
          <div className="mb-4">
            <label
              htmlFor="receiver"
              className="block text-gray-700 font-bold mb-2"
            >
              Receiver Address
            </label>
            <input
              type="text"
              id="receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter receiver address"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 font-bold mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your message"
              rows="3"
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Send Message
          </button>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Messages</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700">{message.content}</p>
                  <p className="text-gray-500 text-sm">
                    From: {message.sender}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No messages yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
