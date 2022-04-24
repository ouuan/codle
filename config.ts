export const beginTimestamp = new Date('2022-03-27T00:00:00Z').valueOf();
export const puzzleInterval = 1000 * 60 * 60 * 24 * 7;
export const host = 'codle.ouuan.moe';
export const plausibleHost = 'https://plausible.ouuan.moe';
export const correctPuzzleNumber = Math.floor((Date.now() - beginTimestamp) / puzzleInterval);
export const timeToBuildEarlier = 3 * 60 * 1000;
