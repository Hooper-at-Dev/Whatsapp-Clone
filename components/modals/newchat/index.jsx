import React, { useState } from 'react';

const NewChat = ({ onInputChange, onInputConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(e.target.value.length > 0);
    if (onInputChange) onInputChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onInputConfirm) onInputConfirm();
    // Close modal by removing hash
    window.location.hash = '';
  };

  return (
    <div id="new" className="modal">
      {/* Custom Styled Modal Box */}
      <div className="modal-box relative overflow-hidden bg-gradient-to-br from-purple-600/95 via-purple-700/95 to-pink-600/95 backdrop-blur-xl border border-purple-300/30 shadow-2xl">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-purple-500/30 animate-pulse" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Start New Chat</h2>
            <p className="text-white/70 text-sm">Enter the email address of the person you'd like to chat with</p>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="email"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="user@example.com"
                className="w-full px-4 py-4 bg-white/15 backdrop-blur-sm border border-purple-300/40 rounded-2xl text-black placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/70 focus:border-purple-400/70 transition-all duration-300"
              />
              {isTyping && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action">
            <a
              href="#"
              className={`btn border-0 text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-purple-300/30 cursor-not-allowed opacity-50'
              }`}
              onClick={handleSubmit}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Start Chat
            </a>
            <a 
              href="#" 
              className="btn bg-purple-400/20 hover:bg-purple-400/30 border border-purple-300/30 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-orange-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

export { NewChat };