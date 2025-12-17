const React = require('react');
const { useEffect, useState } = React;
const { useDocumentInfo } = require('payload/components/utilities');
const { useFormFields } = require('payload/components/forms');

const MarkAsReadOnView = () => {
  const { id } = useDocumentInfo();
  const [marked, setMarked] = useState(false);
  
  // Lấy giá trị isRead từ form
  const isRead = useFormFields(([fields]) => fields?.isRead?.value);

  useEffect(() => {
    // Chỉ đánh dấu nếu: có ID, chưa đọc, và chưa đánh dấu trong session này
    if (id && !isRead && !marked) {
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/orders/${id}/mark-read`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            console.log('✅ Đơn hàng đã được đánh dấu đã đọc');
            setMarked(true);
            // Reload để cập nhật UI
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        } catch (error) {
          console.error('❌ Lỗi khi đánh dấu đã đọc:', error);
        }
      }, 1000); // Đợi 1 giây sau khi mở

      return () => clearTimeout(timer);
    }
  }, [id, isRead, marked]);

  return null;
};

module.exports = MarkAsReadOnView;