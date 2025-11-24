import React from 'react'
import { MessageCircle, Users } from 'lucide-react'

function ActiveTabSwitch({ activeTab, setActiveTab }) {
  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
        {/* Chats Button */}
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === "chats"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Chats</span>
        </button>

        {/* Contacts Button */}
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === "contacts"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
              : "text-gray-600 hover:text-gray-900 hover:bg-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Contacts</span>
        </button>
      </div>
    </div>
  )
}

export default ActiveTabSwitch
