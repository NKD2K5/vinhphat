const React = require('react');
const { useEffect, useState } = React;
const { useDocumentInfo } = require('payload/components/utilities');
const { useFormFields } = require('payload/components/forms');

const MarkContactAsReadOnView = () => {
  const { id } = useDocumentInfo();
  const [marked, setMarked] = useState(false);

  // Lấy giá trị isRead từ form của contact-submissions
  const isRead = useFormFields(([fields]) => fields?.isRead?.value);

  useEffect(() => {
    // Chỉ đánh dấu nếu: có ID, chưa đọc, và chưa đánh dấu trong session này
    if (id && !isRead && !marked) {
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/contact-submissions/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isRead: true,
              readAt: new Date().toISOString(),
            }),
          });

          if (response.ok) {
            console.log('✅ Liên hệ đã được đánh dấu đã đọc');
            setMarked(true);
          }
        } catch (error) {
          console.error('❌ Lỗi khi đánh dấu liên hệ đã đọc:', error);
        }
      }, 1000); // Đợi 1 giây sau khi mở

      return () => clearTimeout(timer);
    }
  }, [id, isRead, marked]);

  return null;
};

module.exports = MarkContactAsReadOnView;
