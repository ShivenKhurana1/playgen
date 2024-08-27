import { useCallback, useEffect, useState } from 'react';
import { LogOut } from 'react-feather';
import { media, style } from 'typestyle';

import { CustomModal } from './CustomModal';
import { GeneratedPlaylist } from './GeneratedPlaylist';
import { Loading } from './Loading';
import { Options } from './Options';
import { Tutorial } from './Tutorial';
import { UserPlaylists } from './UserPlaylists';
import { getUserPlaylists, getPlaylist, getRelated, mobile, Tutorials } from './util';

const generate = style(
  {
    height: 'calc(100% - 40px)',
    width: 'calc(100% - 40px)',
    maxWidth: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
  },
  media(mobile, { paddingBottom: 55, padding: 10, height: 'calc(100% - 20px)', width: 'calc(100% - 20px)' })
);

export interface GenerateOptions {
  shuffle: boolean;
  resultsPerGroup: number;
  trackSeed: boolean;
  playlist?: SpotifyApi.PlaylistObjectSimplified;
}

export function Generate(props: { logout: () => void }) {
  const [tutorialId, setTutorialId] = useState(1);
  const [showTutorial, setShowTutorial] = useState(false);
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>();
  const [progress, setProgress] = useState<{ current: number; total: number }>();

  const [options, setOptions] = useState<GenerateOptions>({
    shuffle: false,
    resultsPerGroup: 5,
    trackSeed: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<SpotifyApi.TrackObjectSimplified[]>();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('spotifyTutorial') || '{}')[1]) {
      setTutorialId(1);
      setShowTutorial(true);
    }

    getUserPlaylists().then((data) => setPlaylists(data));
  }, []);

  const generatePlaylist = useCallback(async () => {
    if (!options.playlist) return;

    setIsGenerating(true);

    setProgress(undefined);
    const playlist = await getPlaylist(options.playlist.id);

    setProgress({ current: 0, total: playlist.length });
    const related = await getRelated(playlist, options, setProgress);

    setOptions({ ...options, playlist: undefined });
    setGenerated(related);
    setIsGenerating(false);
  }, [options]);

  const closeTutorial = useCallback(() => {
    setShowTutorial(false);

    const existing = JSON.parse(localStorage.getItem('spotifyTutorial') || '{}');
    localStorage.setItem('spotifyTutorial', JSON.stringify({ ...existing, [tutorialId]: true }));
  }, [tutorialId]);

  return (
    <div className={generate}>
      {/* Logout buton */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 10, marginBottom: 30, position: 'relative' }}>
        <button onClick={() => props.logout()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogOut style={{ marginRight: 10 }} />
            Sign Out
          </div>
        </button>
      </div>

      {/* Options Modal */}
      <CustomModal
        modalOptions={{
          isOpen: options.playlist !== undefined && !isGenerating && !generated,
          onRequestClose: () => setOptions({ ...options, playlist: undefined }),
          contentLabel: 'Playlist Generation Options',
        }}
        title="Playlist Generation Options"
      >
        <Options options={options} setOptions={setOptions} generatePlaylist={generatePlaylist} />
      </CustomModal>

      {/* Tutorial Modal */}
      <CustomModal
        modalOptions={{
          isOpen: showTutorial,
          onRequestClose: closeTutorial,
          contentLabel: Tutorials[tutorialId].title,
        }}
        title={Tutorials[tutorialId].title}
      >
        <Tutorial tutorialInfo={Tutorials[tutorialId]} closeTutorial={closeTutorial} />
      </CustomModal>

      {!playlists && <Loading text="Loading Your Playlists" />}
      {!isGenerating && playlists && !generated && <UserPlaylists playlists={playlists} options={options} setOptions={setOptions} />}
      {isGenerating && <Loading text="Finding Related Music" progress={progress} />}
      {generated && <GeneratedPlaylist generated={generated} setGenerated={setGenerated} />}
    </div>
  );
}
