import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './MessageDetail.css'

function MessageDetail() {
  const { token, userId, role } = useAuth()
  const [otherUser, setOtherUser] = useState(null)
  const [self, setSelf] = useState(null)
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()
  const messageContainerRef = useRef(null);

  const fetchSelf = useCallback(async () => {
    try {
      fetch(`${process.env.REACT_APP_API_URL}/api/${role}s/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => res.json())
        .then((data) => {
          setSelf(data.data)
        })
    } catch (err) {
      console.log(err)
    }
  }, [token, userId, role])

  const fetchOtherUser = useCallback(async (seeker_id, shelter_id) => {
    var otherRole = role === 'seeker' ? 'shelter' : 'seeker'
    var otherId = role === 'seeker' ? shelter_id : seeker_id
    try {
      fetch(`${process.env.REACT_APP_API_URL}/api/${otherRole}s/${otherId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => res.json())
        .then((data) => {
          setOtherUser(data.data)
        })
    } catch (err) {
      console.log(err)
    }
  }, [token, role])

  const fetchMessages = useCallback(async (id) => {
    let nextPage = `${process.env.REACT_APP_API_URL}/api/comments/applications/${id}`
    const results = []
    var pageNum = 1
    try {
      while (nextPage) {
        const res = await fetch(nextPage, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          console.error('Error fetching messages')
          navigate('/404')
          break
        }
        const data = await res.json()
        
        results.push(...data.data)
        if (data.page.has_next) {
          nextPage = `${process.env.REACT_APP_API_URL}/api/comments/applications/${id}?page=${pageNum + 1}`
          pageNum++
        } else {
          setMessages(results)
          fetchOtherUser(results[0].seeker_id, results[0].shelter_id)
          fetchSelf()
          break
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }, [token, fetchSelf, fetchOtherUser, navigate])

  useEffect(() => {
    if (!token) return navigate('/login')
    // get application id from url
    const id = window.location.pathname.split('/')[2]
    fetchMessages(id)
  }, [token, navigate, fetchMessages])

  const goToMessages = () => {
    navigate('/messages')
  }

  const sendMessage = (e) => {
    e.preventDefault()
    const content = e.target[0].value
    const appId = window.location.pathname.split('/')[2]
    try {
      fetch(`${process.env.REACT_APP_API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          is_review: false,
          content: content,
          recipient_email: otherUser?.email,
          rating: null,
          application_id: appId
        })
      }).then(() => {
        e.target[0].value = ''
        fetchMessages(appId)
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-row items-center mx-auto my-8 justify-center text-center">
        <button onClick={goToMessages} className="bg-blue-500 text-white rounded-xl mx-4 p-2 w-32 h-16">
          Back to Messages
        </button>
        <p className="font-semibold text-3xl">Message with {otherUser?.first_name} {otherUser?.last_name}</p>
      </div>
      <div className="message-box mx-auto my-8"  ref={messageContainerRef}>
        {messages
          .slice()
          .sort((a, b) => new Date(a.created_time) - new Date(b.created_time))
          .map((message) => (
            role === 'seeker' ? message.is_author_seeker ? (
              <div className="message-self" key={message.id}>
                <div className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                  {message.content}
                </div>
                <a href={`/profile/${message.seeker_id}`}>
                  <img className="rounded-full h-[3rem] w-[3rem] mt-4" src={self?.avatar ? `${process.env.REACT_APP_API_URL}/${self?.avatar}` : "/images/logo_ref.png"} alt="/images/logo_ref.png"/>
                </a>
              </div>
            ) : (
              <div className="message-other" key={message.id}>
                <a href={`/profile/${message.shelter_id}`}>
                  <img className="rounded-full h-[3rem] w-[3rem] mt-4" src={otherUser?.avatar ? `${process.env.REACT_APP_API_URL}/${otherUser?.avatar}` : "/images/logo_ref.png"} alt="/images/logo_ref.png"/>
                </a>
                <div className="ml-2 mt-4 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                  {message.content}
                </div>
              </div>
            ) : message.is_author_seeker ? (
              <div className="message-other" key={message.id}>
                <a href={`/profile/${message.seeker_id}`}>
                  <img className="rounded-full h-[3rem] w-[3rem] mt-4" src={otherUser?.avatar ? `${process.env.REACT_APP_API_URL}/${otherUser?.avatar}` : "/images/logo_ref.png"} alt="/images/logo_ref.png"/>
                </a>
                <div className="ml-2 mt-4 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="message-self" key={message.id}>
                <div className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                  {message.content}
                </div>
                <a href={`/profile/${message.shelter_id}`}>
                  <img className="rounded-full h-[3rem] w-[3rem] mt-4" src={self?.avatar ? `${process.env.REACT_APP_API_URL}/${self?.avatar}` : "/images/logo_ref.png"} alt="/images/logo_ref.png"/>
                </a>
              </div>
            )
        ))}
      </div>
      <form className="message-form flex mx-auto mb-8 p-4 mt-auto" onSubmit={sendMessage}>
        <input
              className="w-full bg-gray-300 py-5 px-3 rounded-l-xl"
              type="text"
              placeholder="type your message here..."
              required
          />
        <button className="bg-blue-500 text-white p-3 rounded-r-xl" type="submit">
            Send
        </button>
      </form>
    </div>
  )
}

export default MessageDetail
