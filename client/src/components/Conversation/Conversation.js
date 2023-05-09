import React, { useState } from 'react'
import { useEffect } from 'react'
import { getUser } from '../../api/UserRequests.js'
import Avatar from 'react-avatar'

const Conversation = ({ data, currentUser, online }) => {
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const userId = data.members.find((id) => id !== currentUser)
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId)
                setUserData(data)
            } catch (error) {
                console.log(error)
            }
        }

        getUserData()
    }, [])
    return (
        <>
            <div className="conversation">
                <div className="conversation_title">
                    {online && <div className="online-dot">.</div>}
                    <Avatar size="50px" round name={userData?.firstName} />
                    <div className="name" style={{ fontSize: '0.8rem' }}>
                        <span>{userData?.firstName}</span>
                    </div>
                </div>
            </div>
            <hr style={{ width: '85%', border: '0.1px solid #ececec' }} />
        </>
    )
}

export default Conversation
