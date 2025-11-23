import React, { useEffect, useMemo } from 'react'
import { useChatStore } from '../stores/useChatStore'
import { useAuthStore } from '../stores/useAuthStore'
import { UserPlus } from 'lucide-react'

const ContactItem = React.memo(({ contact, onlineUsers, toggleUser, selectedUser }) => {
  const isOnline = useMemo(() => onlineUsers.includes(contact._id.toString()), [onlineUsers, contact._id]);
  const isSelected = useMemo(() => selectedUser?._id === contact._id, [selectedUser, contact._id]);
  
  return (
    <div
      onClick={() => toggleUser(contact)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 group
        ${isSelected ? 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg' : 'bg-slate-700/30 hover:bg-slate-700/50'}`}
      style={{ contain: 'layout style paint' }}
    >
      {/* User Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
          <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden">
            <img
              src={contact.profilePic || "/avatar.png"}
              alt={contact.username}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        {/* Online Status */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm truncate">{contact.username}</h3>
        <p className="text-slate-400 text-xs truncate">{contact.email}</p>
      </div>

      {/* Contact Icon */}
      <UserPlus className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'} transition-colors duration-200 flex-shrink-0`} />
    </div>
  );
});

ContactItem.displayName = 'ContactItem';

function ContactList() {
  const { allContacts, isUsersLoading, getAllContacts, toggleUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">Loading contacts...</p>
      </div>
    );
  }

  if (!allContacts || allContacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">No contacts found</p>
        <p className="text-slate-600 text-xs mt-1">No users in the database</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" style={{ willChange: 'contents' }}>
      {allContacts.map((contact) => (
        <ContactItem key={contact._id} contact={contact} onlineUsers={onlineUsers} toggleUser={toggleUser} selectedUser={selectedUser} />
      ))}
    </div>
  )
}

export default ContactList
