const markOrderAsRead = async (req, res) => {
  const { id } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const updatedOrder = await req.payload.update({
      collection: 'orders',
      id,
      data: {
        isRead: true,
        readAt: new Date().toISOString(),
        readBy: req.user.email || req.user.id,
      },
    });

    return res.status(200).json({ 
      success: true, 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error marking order as read:', error);
    return res.status(500).json({ error: 'Failed to update order' });
  }
};

module.exports = { markOrderAsRead };
