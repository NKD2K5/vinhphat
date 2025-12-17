const React = require('react');

const PasswordField = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [value, setValue] = React.useState(props.value || '');

  React.useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return React.createElement(
    'div',
    {
      style: {
        position: 'relative',
        width: '100%',
      },
    },
    React.createElement('input', {
      type: showPassword ? 'text' : 'password',
      value: value,
      onChange: handleChange,
      placeholder: props.placeholder || 'Nhập mật khẩu...',
      style: {
        width: '100%',
        padding: '8px 40px 8px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box',
      },
    }),
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: togglePassword,
        style: {
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
        },
        title: showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu',
      },
      React.createElement(
        'svg',
        {
          width: '18',
          height: '18',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        showPassword
          ? [
              React.createElement('path', {
                key: 'slash',
                d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24',
              }),
              React.createElement('line', {
                key: 'line',
                x1: '1',
                y1: '1',
                x2: '23',
                y2: '23',
              }),
            ]
          : [
              React.createElement('path', {
                key: 'eye',
                d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
              }),
              React.createElement('circle', {
                key: 'pupil',
                cx: '12',
                cy: '12',
                r: '3',
              }),
            ]
      )
    )
  );
};

module.exports = PasswordField;
