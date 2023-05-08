import React, { useRef, useState } from "react";
import "./Chat.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userChats } from "../../api/ChatRequests";
import Conversation from "../../components/Conversation/Conversation.js";
import Chatbox from "../../components/ChatBox/ChatBox";
import { logout } from "../../actions/AuthActions.js";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);

  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);


  const handleLogout = () => {
    dispatch(logout(navigate))
  }

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
          <div className="Chat-header"><h2>Your Chats  </h2> <button className="button" onClick={handleLogout}>Log Out</button></div>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div 
              onClick={() => {
                setCurrentChat(chat);
              }}
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
      <div className="Right-side-chat">
        <Chatbox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>

    </div>
  );
};

export default Chat;