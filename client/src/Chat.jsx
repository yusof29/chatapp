import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="bg-zinc-200 min-h-screen flex items-center container mx-auto w-64 ">
      <div className="bg-yellow-400">
        <div className="h-80 p-10 overflow-auto">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div className="m-2">
                    <div className="bg-blue-200 p-2 rounded-sm">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="flex space-x-2 items-center justify-between">
                      <p className="text-sm">{messageContent.time}</p>
                      <p className="font-bold">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="bg-blue-400 flex">
          <input
            className="p-3"
            type="text"
            value={currentMessage}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button className="px-3" onClick={sendMessage}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
