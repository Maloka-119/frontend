import AgenBackicon from './AgenBackicon.jpg'
// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';
// import "./Chat.css";
// import Chatbachgr from './Chatbachgr.jpg'

// const socket = io('http://localhost:5000');

// const Chat = () => {
//   const [role, setRole] = useState('Agency');
//   const [userName, setUserName] = useState('Egypt Agency');
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [roomId, setRoomId] = useState('');
//   const [typingUser, setTypingUser] = useState('');
//   const [tourists, setTourists] = useState([]);
//   const [selectedTourist, setSelectedTourist] = useState(null);

//   // Fetch tourists from fake API
//   useEffect(() => {
//     const fetchTourists = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/tourists');
//         console.log('💾 fetched tourists:', res.data);
//         setTourists(res.data);
//       } catch (err) {
//         console.error('❌ Error fetching tourists:', err);
//       }
//     };
//     fetchTourists();
//   }, []);
  

//   // Socket.IO setup
//   useEffect(() => {
//     if (!roomId) return;
//     socket.emit('joinRoom', roomId);
//     socket.on('receiveMessage', data => {
//       setMessages(prev => [...prev, data]);
//     });
//     socket.on('userTyping', user => {
//       setTypingUser(`${user} is typing...`);
//       setTimeout(() => setTypingUser(''), 2000);
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, [roomId]);

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     const newMessage = { roomId, sender: userName, message };
//     socket.emit('sendMessage', newMessage);
//     setMessages(prev => [...prev, newMessage]);
//     setMessage('');
//   };

//   const handleTyping = () => {
//     socket.emit('typing', roomId, userName);
//   };

//   const handleSelectTourist = tourist => {
//     setSelectedTourist(tourist);
//     setRoomId(`chat_${tourist._id}`);
//     setMessages([]);
//   };

//   const handleRoleChange = newRole => {
//     setRole(newRole);
//     setUserName(newRole === 'Tourist' ? 'User' : 'Egypt Agency');
//   };

//   return (
//     <div className="chatbg" style={{ backgroundImage: `url(${Chatbachgr})`}}>
//     <div className="chat-container" >
//       <h1 className="chat-title">{role} Chat</h1>

//       <div className="role-buttons">
//         <button onClick={() => handleRoleChange('Tourist')}>Tourist</button>
//         <button onClick={() => handleRoleChange('Agency')}>Agency</button>
//       </div>

//       {role === 'Agency' && (
//         <div className="select-tourist">
//           <label>Select Tourist to Chat With: </label>
//           <select onChange={e => handleSelectTourist(JSON.parse(e.target.value))}>
//             <option value="">-- Choose Tourist --</option>
//             {tourists.map(t => (
//               <option key={t._id} value={JSON.stringify(t)}>
//                 {t.name} ({t.email})
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {roomId && (
//         <>
//           {role === 'Agency' && selectedTourist && (
//             <div className="chat-header">
//               <h2>Chatting with: {selectedTourist.name}</h2>
//             </div>
//           )}

//           <div className="chat-box">
//             {messages.map((msg, i) => (
//               <p key={i}>
//                 <strong>{msg.sender}:</strong> {msg.message}
//               </p>
//             ))}
//           </div>

//           <div className="typing-indicator">{typingUser && <p>{typingUser}</p>}</div>

//           <div className="chat-input">
//             <input
//               type="text"
//               value={message}
//               onChange={e => setMessage(e.target.value)}
//               onKeyUp={handleTyping}
//               placeholder="Type your message"
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         </>
//       )}

//       {role === 'Agency' && (
//         <div className="tourist-list">
//           <h2>All Tourists</h2>
//           {tourists.length === 0 ? (
//             <p>No tourists found.</p>
//           ) : (
//             <ul>
//               {tourists.map(t => (
//                 <li key={t._id}>
//                   <strong>Name:</strong> {t.name} <br />
//                   <strong>Email:</strong> {t.email} <br />
//                   <strong>ID:</strong> {t._id}
//                   <hr />
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//  {/* Icon link to home page */}
//  <a href="/travel-agency" className="home-icon-link">
//  <img src={AgenBackicon} alt="Home" className="home-icon" />
// </a>
//     </div>
//   );
// };

// export default Chat;



import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';
import Chatbachgr from './Chatbachgr.jpg';

const agencyId = 1;

const getRoomId = (agencyId, touristId) => {
  return `room_${agencyId}_${touristId}`;
};

const Chat = () => {
  const { touristId } = useParams();
  const socketRef = useRef(null);

  const [role, setRole] = useState('Agency');
  const [userName, setUserName] = useState('Egypt Agency');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [tourists, setTourists] = useState([]);
  const [selectedTourist, setSelectedTourist] = useState(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    const fetchTourists = async () => {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/users');
        setTourists(res.data);

        if (touristId) {
          const tourist = res.data.find(t => t.id === parseInt(touristId));
          if (tourist) {
            setSelectedTourist(tourist);
            setRole('Tourist');
            setUserName(`Tourist ${touristId}`);
            const room = getRoomId(agencyId, tourist.id);
            setRoomId(room);
          }
        }
      } catch (err) {
        console.error('Error fetching tourists:', err);
      }
    };
    fetchTourists();
  }, [touristId]);

  useEffect(() => {
    if (!roomId || !socketRef.current) return;

    socketRef.current.emit('joinRoom', roomId);

    const handleReceiveMessage = data => {
      setMessages(prev => [...prev, data]);
    };

    const handleTyping = user => {
      setTypingUser(`${user} is typing...`);
      setTimeout(() => setTypingUser(''), 2000);
    };

    socketRef.current.on('receiveMessage', handleReceiveMessage);
    socketRef.current.on('userTyping', handleTyping);

    return () => {
      socketRef.current.off('receiveMessage', handleReceiveMessage);
      socketRef.current.off('userTyping', handleTyping);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { roomId, sender: userName, message };
    socketRef.current.emit('sendMessage', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', roomId, userName);
  };

  const handleSelectTourist = tourist => {
    setSelectedTourist(tourist);
    const room = getRoomId(agencyId, tourist.id);
    setRoomId(room);
    setMessages([]);
    socketRef.current.emit('joinRoom', room);

    localStorage.setItem('selectedTourist', JSON.stringify(tourist));
    localStorage.setItem('roomId', room);

    socketRef.current.emit('startChat', room);
  };

  const handleRoleChange = newRole => {
    setRole(newRole);
    setUserName(newRole === 'Tourist' ? 'Tourist' : 'Egypt Agency');
  };

  return (
    <div className="chatbg" style={{ backgroundImage: `url(${Chatbachgr})` }}>
      <div className="chat-container">
        <h1 className="chat-title">{role} Chat</h1>

        <div className="role-buttons">
          <button onClick={() => handleRoleChange('Tourist')}>Tourist</button>
          <button onClick={() => handleRoleChange('Agency')}>Agency</button>
        </div>

        {role === 'Agency' && !selectedTourist && (
          <div className="select-tourist">
            <label>Select Tourist to Chat With: </label>
            <select onChange={e => handleSelectTourist(JSON.parse(e.target.value))}>
              <option value="">-- Choose Tourist --</option>
              {tourists.map(t => (
                <option key={t.id} value={JSON.stringify(t)}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {roomId && (
          <>
            {selectedTourist && (
              <div className="chat-header">
                <h2>Chatting with: {selectedTourist.name}</h2>
              </div>
            )}

            <div className="chat-box">
              {messages.map((msg, i) => (
                <p key={i} className={msg.sender === userName ? 'my-message' : 'their-message'}>
                  <strong>{msg.sender}:</strong> {msg.message}
                </p>
              ))}
            </div>

            <div className="typing-indicator">{typingUser && <p>{typingUser}</p>}</div>

            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyUp={handleTyping}
                placeholder="Type your message"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;





