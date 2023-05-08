import React, { useRef, useState } from "react";
import "./Chat.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userChats } from "../../api/ChatRequests";
import Conversation from "../../components/Conversation.js";

const Chat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

 // Get the chat in chat section
 useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);




  return (
    <div className="Chat">
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Your Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
            >
              <Conversation
                data={chat}
                currentUser={user._id}
              />
            </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Chat;