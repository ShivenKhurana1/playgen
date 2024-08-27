import { useEffect } from 'react';
import { LogIn } from 'react-feather';
import { media, style } from 'typestyle';

import { Loading } from './Loading';
import { getHashParams, mobile, setSpotifyToken, shortMobile } from './util';

import icon from './img/icon.svg';

function login(setAuthenticated: (authenticated: boolean) => void) {
  const params = getHashParams();

  if (!params.access_token || params.state !== localStorage.getItem('spotifyState')) {
    const scopes = ['playlist-read-private', 'playlist-modify-public'],
      redirectUri =
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://amcolash.github.io/spotify-playlist-generator/',
      clientId = 'c2fc1a6c5ec54aa2819513c41fc6d12f',
      state = Math.random().toString(),
      showDialog = !localStorage.getItem('spotifyState');

    localStorage.setItem('spotifyState', state);

    // Do client-based auth flow
    const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}&show_dialog=${showDialog}`;
    window.location.href = authorizeURL;
  } else {
    setAuthenticated(true);
    setSpotifyToken(params.access_token);

    window.location.hash = '';
  }
}

const container = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: 'calc(100vh - 40px)',
  padding: 20,
});

const title = style({ fontSize: 72 }, media(mobile, { fontSize: 52 }));
const logo = style({ height: 156, margin: 42 }, media(mobile, { height: 156, margin: 16 }), media(shortMobile, { margin: 0 }));
const signin = style();

export function Login(props: { setAuthenticated: (authenticated: boolean) => void }) {
  const firstAuth = !localStorage.getItem('spotifyState');

  useEffect(() => {
    if (!firstAuth) login(props.setAuthenticated);
  }, [props, firstAuth]);

  if (!firstAuth) return <Loading text="Logging In" />;

  return (
    <div className={container}>
      <h1 className={title} style={{ margin: 0 }}>
        [DiscoList]
      </h1>
      <h3 style={{ marginTop: 4 }}>Smarter Music Discovery</h3>
      <img className={logo} src={icon} alt="DiscoList logo" />
      <h2 className={signin}>
        Please sign in
        <br /> with Spotify
      </h2>
      <button onClick={() => login(props.setAuthenticated)}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LogIn style={{ marginRight: 10 }} />
          Sign In
        </div>
      </button>
    </div>
  );
}
