import { useCallback, useState } from 'react';
import { Check, ChevronLeft, Save } from 'react-feather';
import { SpinnerCircularFixed } from 'spinners-react';
import { style } from 'typestyle';

import { Song } from './Song';
import { createPlaylist, Colors } from './util';

const margin = 10;

const buttonInput = style({
  margin: margin,
});

const consistentMargin = style({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: -margin,
  padding: '12px 0',
});

export function GeneratedPlaylist(props: {
  generated: SpotifyApi.TrackObjectSimplified[];
  setGenerated: (generated: SpotifyApi.TrackObjectSimplified[] | undefined) => void;
}) {
  const [currentSong, setCurrentSong] = useState<string>();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistLink, setPlaylistLink] = useState<string>();
  const [saving, setSaving] = useState(false);

  const save = useCallback(async () => {
    setCurrentSong(undefined);
    setSaving(true);
    await createPlaylist(props.generated, setPlaylistLink, newPlaylistName);
    setSaving(false);
  }, [props.generated, newPlaylistName]);

  return (
    <div style={{ width: '100%' }}>
      <div className={consistentMargin}>
        <button
          className={buttonInput}
          onClick={() => {
            props.setGenerated(undefined);
            setPlaylistLink(undefined);
            setNewPlaylistName('');
            setSaving(false);
            setCurrentSong(undefined);
          }}
          style={{ display: 'flex', alignItems: 'center' }}
          disabled={saving}
        >
          <ChevronLeft style={{ marginRight: 10 }} />
          Back
        </button>
        {!playlistLink && !saving && (
          <input
            className={buttonInput}
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New Playlist Name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
            }}
          />
        )}
        {playlistLink && (
          <button
            className={buttonInput}
            onClick={() => window.open(playlistLink, '_blank')}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Check style={{ marginRight: 10 }} /> Open Playlist
          </button>
        )}
        {!playlistLink && (
          <button
            className={buttonInput}
            disabled={newPlaylistName.length === 0}
            onClick={save}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {!saving && <Save style={{ marginRight: 10 }} />}
            {saving && (
              <SpinnerCircularFixed
                size={24}
                thickness={200}
                color={Colors.White}
                secondaryColor={Colors.DarkGreen}
                style={{ marginRight: 10 }}
              />
            )}
            {saving ? 'Saving...' : 'Save New Playlist'}
          </button>
        )}
      </div>
      {props.generated.map((t) => (
        <Song
          key={t.id}
          song={t}
          generated={props.generated}
          setGenerated={props.setGenerated}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
        />
      ))}
    </div>
  );
}
