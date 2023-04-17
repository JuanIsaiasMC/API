const formatDuration = async (buffer) => {
  try {
    const { parseBuffer } = await import("music-metadata");

    const { format } = await parseBuffer(buffer);
    return durationSeconds = format.duration;

    /* const minutes = Math.floor(durationSeconds / 60);
    const remainingSeconds = durationSeconds % 60; */

    /* return `${minutes}:${remainingSeconds}`; */
  } catch (error) {
    console.log(error);
  }
};

const getMetadata = async (buffer) => {
  const { parseBuffer } = await import("music-metadata");

  return await parseBuffer(buffer);
};

module.exports = { formatDuration, getMetadata };
