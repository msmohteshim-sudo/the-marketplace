import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { messagesApi } from '../../services/api';

export const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activePartner, setActivePartner] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    messagesApi.getConversations()
      .then(res => {
        setConversations(res.conversations || []);
        if (res.conversations?.[0]?.partner) {
          selectPartner(res.conversations[0].partner);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectPartner = (partner: any) => {
    setActivePartner(partner);
    messagesApi.getConversation(partner.id)
      .then(res => setMessages(res.messages || []))
      .catch(console.error);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner) return;

    messagesApi.send({ receiverId: activePartner.id, content: inputText })
      .then(res => {
        setMessages(prev => [...prev, res.message]);
        setInputText('');
      })
      .catch(console.error);
  };

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', gap: '1rem' }}>
      {/* Sidebar */}
      <div className="glass-card" style={{ width: 300, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '1rem' }}>
          Messages
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No messages yet
            </div>
          ) : (
            conversations.map(c => (
              <button
                key={c.partner?.id}
                onClick={() => selectPartner(c.partner)}
                style={{ width: '100%', padding: '0.875rem 1rem', border: 'none', background: activePartner?.id === c.partner?.id ? 'var(--bg-card-hover)' : 'transparent', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                  {c.partner?.fullName?.[0] || 'U'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.partner?.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.lastMessage?.content || 'No messages'}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat window */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activePartner ? (
          <>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                {activePartner.fullName?.[0] || 'U'}
              </div>
              <div style={{ fontWeight: 700 }}>{activePartner.fullName}</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map(m => (
                <div key={m.id} style={{ alignSelf: m.senderId === activePartner.id ? 'flex-start' : 'flex-end', maxWidth: '70%' }}>
                  <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', background: m.senderId === activePartner.id ? 'var(--bg-card)' : 'var(--gradient-primary)', color: 'white', fontSize: '0.875rem', border: m.senderId === activePartner.id ? '1px solid var(--border-default)' : 'none' }}>
                    {m.content}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: m.senderId === activePartner.id ? 'left' : 'right' }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input"
                placeholder="Type a message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="empty-state">
            <MessageSquare size={32} />
            <h3>Select a Conversation</h3>
          </div>
        )}
      </div>
    </div>
  );
};
