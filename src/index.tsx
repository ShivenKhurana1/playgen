import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule, keyframes } from 'typestyle';

import App from './App';

import { Colors } from './util';

cssRule('body', {
  margin: 0,
  background: Colors.Black,
  color: Colors.White,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 20,
  scrollbarColor: '#454a4d #202324',

  $nest: {
    '&.modal-open': {
      overflowY: 'hidden',
    },
  },
});

cssRule('button', {
  fontSize: 16,
  fontWeight: 'bold',
  minWidth: 100,
  padding: 10,
  borderRadius: 500,
  background: Colors.Green,
  border: 'none',
  color: Colors.White,
  textTransform: 'uppercase',
  transition: 'background 0.25s, filter 0.25s',

  $nest: {
    '&:not(.noButton):enabled:hover': {
      background: Colors.GreenHover,
      cursor: 'pointer',
    },
    '&:disabled': {
      background: `${Colors.Grey} !important`,
    },

    '&.noButton': {
      background: 'none',
      padding: 0,
      minWidth: 36,
      fontSize: 0,
      borderRadius: 0,

      $nest: {
        '&:focus': {
          background: Colors.Grey,
        },
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  },
});

cssRule('input', {
  borderRadius: 6,
  border: 'none',
  padding: 8,
  height: 28,
});

const progressRadius = 10;
cssRule('progress', {
  '-webkit-appearance': 'none',
  '-moz-appearance': 'none',
  appearance: 'none',

  backgroundColor: Colors.Grey,
  color: Colors.Green,
  borderRadius: progressRadius,

  $nest: {
    '&::-webkit-progress-bar': {
      backgroundColor: Colors.Grey,
      borderRadius: progressRadius,
      $unique: true,
    },
    '&::-webkit-progress-value': {
      backgroundColor: Colors.Green,
      borderRadius: progressRadius,
    },
    '&::-moz-progress-bar': {
      backgroundColor: Colors.Grey,
      borderRadius: progressRadius,
      $unique: true,
    },
  },
});

cssRule('::-webkit-scrollbar', {
  backgroundColor: '#202324',
});

cssRule('::-webkit-scrollbar-thumb', {
  backgroundColor: '#454a4d',
});

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

ReactDOM.render(
  <React.StrictMode>
    <div style={{ opacity: 0, animation: fadeIn, animationDelay: '0.5s', animationDuration: '0.25s', animationFillMode: 'forwards' }}>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
