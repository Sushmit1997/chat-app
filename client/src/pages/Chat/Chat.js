import React, { useRef, useState } from 'react'
import './Chat.css'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userChats } from '../../api/ChatRequests'
import Conversation from '../../components/Conversation/Conversation.js'
import Chatbox from '../../components/ChatBox/ChatBox'
import { getAllUser } from '../../api/UserRequests'
import { createChat } from '../../api/ChatRequests'
import { logout } from '../../actions/AuthActions.js'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const Chat = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.authReducer.authData)

    const navigate = useNavigate()
    const socket = useRef()

    const [chats, setChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [sendMessage, setSendMessage] = useState(null)
    const [receivedMessage, setReceivedMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [users, setUsers] = useState([])

    const suitableUsers = users
        .filter((user) => user.firstName)
        .filter((user1) => user1._id !== user._id)

    const options = suitableUsers.map((user) => {
        return { value: user._id, label: user.firstName }
    })

    //Subscribe to socket server
    useEffect(() => {
        socket.current = io('ws://localhost:8800')
        socket.current.emit('new-user-add', user._id)
        socket.current.on('get-users', (users) => {
            setOnlineUsers(users)
        })
    }, [user])

    //message to socket server
    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit('send-message', sendMessage)
        }
    }, [sendMessage])

    //receive message from socket server
    useEffect(() => {
        socket.current.on('receive-message', (data) => {
            setReceivedMessage(data)
        })
    }, [])

    //receive all users

    const getAllUserData = async () => {
        try {
            const { data } = await getAllUser()
            console.log(data)
            setUsers(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllUserData()
    }, [])

    const handleLogout = () => {
        dispatch(logout(navigate))
    }

    // Get the chat in chat section

    const getChats = async () => {
        try {
            const { data } = await userChats(user._id)
            setChats(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getChats()
    }, [user._id])

    function checkIdInMembers(id, data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].members.includes(id)) {
                return { found: true, index: i }
            }
        }
        return { found: false, index: -1 }
    }

    const onUserSelectionForChat = async (data) => {
        const payload = {
            senderId: user._id,
            receiverId: data.value,
        }

        const checkIdResult = checkIdInMembers(data.value, chats)
        checkIdResult.found
            ? setCurrentChat(chats[checkIdResult.index])
            : await createChat(payload)
        !checkIdResult.found && getChats()
    }

    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member !== user._id)
        const online = onlineUsers.find((user) => user.userId === chatMember)
        return online ? true : false
    }

    return (
        <div className="Chat">
            <div className="Left-side-chat">
                <div className="Chat-container">
                    <div className="Chat-header">
                        <h2>Welcome {user.firstName} </h2>{' '}
                        <button className="button" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                    <div>
                        <Dropdown
                            options={options}
                            menuClassName="dropdownMenu"
                            onChange={onUserSelectionForChat}
                            placeholder="Start a new chat"
                        />
                    </div>
                    <div className="Chat-list">
                        {chats.map((chat) => (
                            <div
                                onClick={() => {
                                    setCurrentChat(chat)
                                }}
                            >
                                <Conversation
                                    data={chat}
                                    currentUser={user._id}
                                    online={checkOnlineStatus(chat)}
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
    )
}

export default Chat
