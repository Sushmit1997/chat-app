import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../api/UserRequests.js";
import Avatar from 'react-avatar';


const Conversation = ({ data, currentUser }) => {

  const [userData, setUserData] = useState(null)
  const dispatch = useDispatch()

  useEffect(()=> {

    const userId = data.members.find((id)=>id!==currentUser)
    const getUserData = async ()=> {
      try
      {
          const {data} =  await getUser(userId)
          console.log('user', data)
         setUserData(data)
      }
      catch(error)
      {
        console.log(error)
      }
    }

    getUserData();
  }, [])
  return (
    <>
      <div className="conversation">
        <div className="conversation_title">
          <Avatar size="50px" round  name={userData?.firstName}/>
          <div className="name" style={{fontSize: '0.8rem'}}>
            <span>{userData?.firstName}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;