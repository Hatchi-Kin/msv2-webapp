// Separate file for non-component exports to maintain Fast Refresh compatibility

let stopMusicCallback: (() => void) | null = null;

export const setStopMusicCallback = (callback: () => void) => {
  stopMusicCallback = callback;
};

export const getStopMusicCallback = () => stopMusicCallback;
