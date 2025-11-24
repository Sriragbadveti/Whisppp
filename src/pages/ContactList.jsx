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
        ${isSelected ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg text-white' : 'bg-white hover:bg-gray-50 border border-gray-200'}`}
      style={{ contain: 'layout style paint' }}
    >
      {/* User Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white overflow-hidden">
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
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{contact.username}</h3>
        <p className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{contact.email}</p>
      </div>

      {/* Contact Icon */}
      <UserPlus className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-cyan-500'} transition-colors duration-200 flex-shrink-0`} />
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
        <p className="text-gray-500 text-sm">Loading contacts...</p>
      </div>
    );
  }

  if (!allContacts || allContacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No contacts found</p>
        <p className="text-gray-400 text-xs mt-1">No users in the database</p>
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
