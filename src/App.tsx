import { useState } from 'react';
import { cssRule, media, style } from 'typestyle';

import { Generate } from './Generate';
import { Login } from './Login';
import { Colors, mobile } from './util';

import spotifyLogo from './img/Spotify_Logo_RGB_Green.png';

const appStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflowX: 'hidden',
});

cssRule('.cover', {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: 50,
  width: 50,
  minWidth: 50,
  border: '1px solid #555',
});

cssRule(
  '.iconButton',
  {
    height: 24,
    width: 24,
    borderRadius: 8,
    padding: 7,
    border: `2px solid #000`,
    transition: 'background 0.25s',

    $nest: {
      '&:hover': {
        background: Colors.Grey,
      },
      '&:focus': {
        background: Colors.Grey,
      },

      img: {
        width: 24,
        height: 24,
      },
    },
  },
  media(mobile, {
    width: 20,
    height: 20,
    padding: 5,

    $nest: {
      img: {
        width: 20,
        height: 20,
      },
    },
  })
);

const footer = style(
  {
    position: 'fixed',
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px 0',
    background: 'rgba(0,0,0,0.75)',
  },
  media(mobile, { left: 0, justifyContent: 'center' })
);

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const logout = () => {
    localStorage.removeItem('spotifyState');
    setAuthenticated(false);
  };

  return (
    <div className={`App ${appStyle}`}>
      {!authenticated && <Login setAuthenticated={setAuthenticated} />}
      {authenticated && <Generate logout={logout} />}

      <div className={footer}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Powered By</h3>
        <a href="https://spotify.com" target="_blank" rel="noreferrer" style={{ marginLeft: 16 }}>
          <img src={spotifyLogo} style={{ height: 35 }} alt="Spotify Logo" />
        </a>
      </div>
    </div>
  );
}

export default App;
