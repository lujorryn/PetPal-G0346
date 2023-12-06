// Messages.js
import './Messages.css';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useCallback, useState } from 'react';
import { set } from 'date-fns';

function Messages() {
  const { userId, token, role } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const messagesPerPage = 5;

  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const visibleMessages = messages.slice((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage);

  const fetchMessages = useCallback(async () => {
    let nextPage = `${process.env.REACT_APP_API_URL}/api/comments/user`;
    const results = [];
    try {
      while (nextPage) {
        const res = await fetch(nextPage, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        results.push(...data.results);
        nextPage = data.next;
      }
      setMessages(results);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="main__wrapper">
      <div className="title-row">
        <p className="page-title">Message Center</p>
      </div>
      <div className="msg-container">
        {visibleMessages.map((message) => (
          <div className="msg-row" key={message.application_id}>
            <div className="msg-info">
              <div className="msg-subject">Application for {message.pet_name}</div>
              <div className="msg-from">Content: {message.content}</div>
              <div className="msg-preview">To: {message.recipient_email}</div>
              <div className="msg-time">
                {message.created_time ? new Date(message.created_time).toLocaleTimeString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : ''
                }

              </div>
            </div>

            <div className="btn-container">
              <a className="g-blue-500 text-black py-2 px-4 rounded-md" href={`/messages/${message.application_id}`}>Message</a>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center m-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-btn ${
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            } border border-gray-300 px-4 py-2 rounded-md mb-4 mr-4 focus:outline-none focus:ring focus:border-blue-300`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Messages;