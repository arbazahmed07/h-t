import { toast } from 'react-toastify';
import { FaBell, FaTrophy, FaUserFriends, FaExclamationTriangle, FaComment, FaThumbsUp } from 'react-icons/fa';
import React from 'react';

// Create a singleton notification sound that can be reused
let notificationSound;

// Initialize the notification sound (call this when your app starts)
export const initNotificationSound = () => {
  // Try all possible paths to the notification sound file
  try {
    notificationSound = new Audio('/assets/notification-sound.mp3');
    
    // Add a load event listener to see if the file can be loaded
    notificationSound.addEventListener('canplaythrough', () => {
      console.log('Notification sound loaded successfully');
    });
    
    // Add error handling to try fallback paths
    notificationSound.addEventListener('error', () => {
      console.log('Trying alternate sound path...');
      try {
        notificationSound = new Audio('/notification-sound.mp3');
      } catch (err) {
        console.error('Could not load notification sound:', err);
      }
    });
    
    // Preload the audio
    notificationSound.load();
  } catch (err) {
    console.error('Error initializing notification sound:', err);
  }
};

// Play the notification sound
export const playNotificationSound = () => {
  if (notificationSound) {
    // Reset the sound to the beginning if it's already playing
    notificationSound.currentTime = 0;
    
    // Create a promise to play the sound
    const playPromise = notificationSound.play();
    
    // Handle play promise
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.error('Failed to play notification sound:', err);
        // Try with a new Audio instance as a fallback
        try {
          new Audio('/assets/notification-sound.mp3').play();
        } catch (innerErr) {
          console.error('Fallback sound also failed:', innerErr);
        }
      });
    }
  }
};

// Get notification icon component for toast notifications
export const getNotificationIconComponent = (type) => {
  switch (type) {
    case 'achievement':
      return () => React.createElement(FaTrophy, { className: "text-amber-500" });
    case 'social':
      return () => React.createElement(FaUserFriends, { className: "text-blue-500" });
    case 'system':
      return () => React.createElement(FaBell, { className: "text-purple-500" });
    case 'reminder':
      return () => React.createElement(FaExclamationTriangle, { className: "text-orange-500" });
    case 'comment':
      return () => React.createElement(FaComment, { className: "text-green-500" });
    case 'like':
      return () => React.createElement(FaThumbsUp, { className: "text-blue-500" });
    default:
      return () => React.createElement(FaBell, { className: "text-gray-500" });
  }
};

// Show a notification toast and play sound
export const showNotification = (notification) => {
  // Play sound
  playNotificationSound();
  
  // Show toast
  toast.info(
    React.createElement('div', null, 
      React.createElement('strong', null, notification.title),
      React.createElement('p', { className: "text-sm" }, notification.message)
    ),
    {
      icon: getNotificationIconComponent(notification.type)
    }
  );
};