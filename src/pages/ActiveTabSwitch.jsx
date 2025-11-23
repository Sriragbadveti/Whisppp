import React from 'react'
import { MessageCircle, Users } from 'lucide-react'

function ActiveTabSwitch({ activeTab, setActiveTab }) {
  return (
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex gap-2 bg-slate-900/50 rounded-lg p-1">
        {/* Chats Button */}
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === "chats"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
              : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
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
              : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
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
