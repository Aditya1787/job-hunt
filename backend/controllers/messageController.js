import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get user conversation list (chat threads)
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messages sent or received by this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach(msg => {
      const otherUser = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString();
      
      if (!conversationMap.has(otherUser)) {
        conversationMap.set(otherUser, {
          lastMessage: msg.text,
          timestamp: msg.createdAt,
          unread: msg.receiver.toString() === userId.toString() && !msg.isRead ? 1 : 0
        });
      } else {
        // Accumulate unread counts for older messages
        if (msg.receiver.toString() === userId.toString() && !msg.isRead) {
          const current = conversationMap.get(otherUser);
          conversationMap.set(otherUser, {
            ...current,
            unread: current.unread + 1
          });
        }
      }
    });

    const contactIds = Array.from(conversationMap.keys());
    const users = await User.find({ _id: { $in: contactIds } })
      .select('name email role profilePhoto companyProfile.companyName');

    const conversations = users.map(user => {
      const details = conversationMap.get(user._id.toString());
      return {
        user,
        lastMessage: details.lastMessage,
        timestamp: details.timestamp,
        unreadCount: details.unread
      };
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent message

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get private message history with another user
// @route   GET /api/messages/:otherId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { otherId } = req.params;
    const userId = req.user._id;

    // Fetch conversation history
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages sent by the other user as read
    await Message.updateMany(
      { sender: otherId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
