import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { addMessage, getMessages } from '../../api/MessageRequests'
import { getUser } from '../../api/UserRequests'
import { format } from 'timeago.js'
import './ChatBox.css'
import Avatar from 'react-avatar'

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
    const [userData, setUserData] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    const handleChange = (e) => {
        const text = e.target.value
        setNewMessage(text)
    }

    useEffect(() => {
        if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
            setMessages([...messages, receivedMessage])
        }
    }, [receivedMessage])

    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser)
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId)
                setUserData(data)
            } catch (error) {
                console.log(error)
            }
        }

        if (chat !== null) getUserData()
    }, [chat, currentUser])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id)
                setMessages(data)
            } catch (error) {
                console.log(error)
            }
        }

        if (chat !== null) fetchMessages()
    }, [chat])

    const handleSend = async (e) => {
        e.preventDefault()
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        }

        const receiverId = chat.members.find((id) => id !== currentUser)
        setSendMessage({ ...message, receiverId })

        try {
            const { data } = await addMessage(message)
            setMessages([...messages, data])
            setNewMessage('')
        } catch {
            console.log('error')
        }
    }

    // Receive Message from parent component
    useEffect(() => {
        if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
            setMessages([...messages, receivedMessage])
        }
    }, [receivedMessage])

    const scroll = useRef()

    //Scroll to bottom
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend(event)
        }
    }

    return (
        <>
            <div className="ChatBox-container">
                {chat ? (
                    <>
                        {/* chat-header */}
                        <div className="chat-header">
                            <div className="follower">
                                <div className="conversation_title">
                                    <Avatar
                                        size="50px"
                                        round
                                        name={userData?.firstName}
                                    />
                                    <div
                                        className="name"
                                        style={{ fontSize: '0.9rem' }}
                                    >
                                        <span>{userData?.firstName}</span>
                                    </div>
                                </div>
                            </div>
                            <hr
                                style={{
                                    width: '95%',
                                    border: '0.1px solid #ececec',
                                    marginTop: '20px',
                                }}
                            />
                        </div>
                        {/* chat-body */}
                        <div className="chat-body">
                            {messages.map((message) => (
                                <>
                                    <div
                                        ref={scroll}
                                        className={
                                            message.senderId === currentUser
                                                ? 'message own'
                                                : 'message'
                                        }
                                    >
                                        <span>{message.text}</span>{' '}
                                        <span>{format(message.createdAt)}</span>
                                    </div>
                                </>
                            ))}
                        </div>
                        {/* chat-sender */}
                        <div className="chat-sender">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => handleChange(e)}
                                onKeyDown={handleKeyPress}
                                id="inputField"
                            />
                            <button
                                className="send-button button"
                                id="send"
                                disabled={!newMessage}
                                onClick={handleSend}
                            >
                                Send
                            </button>
                        </div>{' '}
                    </>
                ) : (
                    <span className="chatbox-empty-message">
                        Tap on a chat to start conversation...
                    </span>
                )}
            </div>
        </>
    )
}

export default ChatBox
