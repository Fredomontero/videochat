import { 
  SET_PAGE,
  SET_MEETING_CODE,
  SET_DEVICE_LIST,
  SET_MIC_ID,
  SET_VIDEO_ID,
  SET_SPEAKER_ID,
  SET_CONNECTION,
  SET_CONFERENCE,
  SET_LOCAL_TRACKS,
  SET_REMOTE_TRACKS,
  SET_ACTIVE_ROOM_ID,
  REMOVE_REMOTE_TRACK
} from './video.actions.types';

export const setPage = page => ({
  type: SET_PAGE,
  payload: page
});

export const setMeetingcode = code => ({
  type: SET_MEETING_CODE,
  payload: code
});

export const setDeviceList = deviceList => ({
  type: SET_DEVICE_LIST,
  payload: deviceList
});

export const setMicId = micId => ({
  type: SET_MIC_ID,
  payload: micId
});

export const setVideoId = videoId => ({
  type: SET_VIDEO_ID,
  payload: videoId
});

export const setSpeakerId = speakerId => ({
  type: SET_SPEAKER_ID,
  payload: speakerId
});

export const setConnection = connection => ({
  type: SET_CONNECTION,
  payload: connection
});

export const setConference = conference => ({
  type: SET_CONFERENCE,
  payload: conference
});

export const setLocalTracks = localTracks => ({
  type: SET_LOCAL_TRACKS,
  payload: localTracks
});

export const setRemoteTracks = remoteTracks => ({
  type: SET_REMOTE_TRACKS,
  payload: remoteTracks
});

export const removeRemoteTrack = remoteTrack => ({
  type: REMOVE_REMOTE_TRACK,
  payload: remoteTrack
});

export const setActiveRoomId = roomId => ({
  type: SET_ACTIVE_ROOM_ID,
  payload: roomId
});