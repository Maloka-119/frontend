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

  // الحصول على التوكن من الـ localStorage
const token = localStorage.getItem('token');

// إعداد الـ headers مع التوكن
const headers = {
  'Content-Type': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
};

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    const fetchTourists = async () => {
      try {
        // استبدل هذا بالـ API الحقيقي الخاص بك لجلب السياح
        const res = await axios.get('https://localhost:7050/api/Message/conversations', { headers });
        setTourists(res.data);

        if (touristId) {
          const tourist = res.data.find(t => t.id === parseInt(touristId));
          if (tourist) {
            setSelectedTourist(tourist);
            setRole('Tourist');
            setUserName(`Tourist ${touristId}`);
            const room = getRoomId(agencyId, tourist.id);
            setRoomId(room);
            
            // جلب سجل المحادثة عند تحديد سائح
            const historyRes = await axios.get(`https://localhost:7050/api/Message/history/${tourist.id}`, { headers });
            setMessages(historyRes.data);
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

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMessage = { 
      roomId, 
      sender: userName, 
      message,
      touristId: selectedTourist?.id,
      agencyId
    };

    try {
      // إرسال الرسالة عبر السوكيت
      socketRef.current.emit('sendMessage', newMessage);
      
      // إرسال الرسالة إلى API الخاص بك لحفظها
      await axios.post('https://localhost:7050/api/Message/send', newMessage, { headers });
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', roomId, userName);
  };

  const handleSelectTourist = async (tourist) => {
    setSelectedTourist(tourist);
    const room = getRoomId(agencyId, tourist.id);
    setRoomId(room);
    socketRef.current.emit('joinRoom', room);

    try {
      // جلب سجل المحادثة عند اختيار سائح
      const res = await axios.get(`https://localhost:7050/api/Message/history/${tourist.id}`, { headers });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }

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