import { Range } from 'react-range';
import Switch from 'react-switch';

import { GenerateOptions } from './Generate';
import { Colors } from './util';

import icon from './img/icon.svg';

export function Options(props: { options: GenerateOptions; setOptions: (options: GenerateOptions) => void; generatePlaylist: () => void }) {
  const realEstimate = Math.floor(
    ((props.options.playlist ? props.options.playlist.tracks.total : 1) * (props.options.resultsPerGroup || 1)) / 5
  );
  const roundedEstimate = Math.max(5, (Math.floor(realEstimate / 5) + 1) * 5);

  return (
    <>
      {props.options.playlist && <label>Source Playlist: {props.options.playlist.name}</label>}

      {props.options.playlist && <label style={{ marginTop: 24, marginBottom: 12 }}>Playlist Size (About {roundedEstimate} Songs)</label>}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 10 }}>
        <label style={{ marginRight: 20 }}>Smaller</label>
        <Range
          step={5}
          min={0}
          max={25}
          values={[props.options.resultsPerGroup]}
          onChange={(values) => props.setOptions({ ...props.options, resultsPerGroup: values[0] })}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 5,
                width: '100%',
                backgroundColor: Colors.White,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 24,
                width: 24,
                borderRadius: '100%',
                border: `1px solid ${Colors.White}`,
                backgroundColor: Colors.Green,
              }}
            />
          )}
          renderMark={({ props, index }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 16,
                width: 6,
                borderRadius: 4,
                backgroundColor: index === 1 ? Colors.Green : 'transparent',
              }}
            />
          )}
        />
        <label style={{ marginLeft: 20 }}>Larger</label>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <span
          style={{ marginRight: 10, fontWeight: props.options.shuffle ? undefined : 'bold' }}
          onClick={(e) => {
            props.setOptions({ ...props.options, shuffle: false });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Precise
        </span>
        <Switch
          onChange={(checked) => props.setOptions({ ...props.options, shuffle: checked })}
          checked={props.options.shuffle}
          checkedIcon={false}
          uncheckedIcon={false}
          onColor={Colors.Green}
          offColor={Colors.Green}
        />
        <span
          style={{ marginLeft: 10, fontWeight: props.options.shuffle ? 'bold' : undefined, textAlign: 'right' }}
          onClick={(e) => {
            props.setOptions({ ...props.options, shuffle: true });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Balanced
        </span>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <span
          style={{ marginRight: 10, fontWeight: props.options.trackSeed ? 'bold' : undefined }}
          onClick={(e) => {
            props.setOptions({ ...props.options, trackSeed: true });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Similar Tracks
        </span>
        <Switch
          onChange={(checked, e) => props.setOptions({ ...props.options, trackSeed: !checked })}
          checked={!props.options.trackSeed}
          checkedIcon={false}
          uncheckedIcon={false}
          onColor={Colors.Green}
          offColor={Colors.Green}
        />
        <span
          style={{ marginLeft: 10, fontWeight: props.options.trackSeed ? undefined : 'bold', textAlign: 'right' }}
          onClick={(e) => {
            props.setOptions({ ...props.options, trackSeed: false });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Similar Artists
        </span>
      </label>

      <button style={{ marginTop: 26, display: 'flex', alignItems: 'center' }} onClick={props.generatePlaylist}>
        <img src={icon} style={{ width: 32, filter: 'grayscale(1) brightness(2)', marginRight: 6 }} alt="" />
        DiscoList
      </button>
    </>
  );
}
