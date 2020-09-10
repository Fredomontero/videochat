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
  SET_REMOTE_TRACKS
} from "../actions/video.actions.types";

const initialState = {
  page: 'home',
  meetingCode: 'test',
  deviceList: [],
  micId: null,
  videoId: null,
  speakerId: null,
  serverURL: 'beta.meet.jit.si',
  connection: null,
  conference: null,
  localTracks: [],
  remoteTracks: []
};

function rootReducer(state = initialState, action){
  switch(action.type){
    case SET_PAGE:
      return{
        ...state,
        page: action.payload,
        error: null 
      };
    case SET_MEETING_CODE:
      return{
        ...state,
        meetingCode: action.payload,
        error: null 
      };
    case SET_DEVICE_LIST:
      return{
        ...state,
        deviceList: action.payload,
        error: null 
      };
    case SET_MIC_ID:
      return{
        ...state,
        micId: action.payload,
        error: null 
      };
    case SET_VIDEO_ID:
      return{
        ...state,
        videoId: action.payload,
        error: null 
      };
    case SET_SPEAKER_ID:
      return{
        ...state,
        speakerId: action.payload,
        error: null 
      };
    case SET_CONNECTION:
      return{
        ...state,
        connection: action.payload,
        error: null 
      };
    case SET_CONFERENCE:
      return{
        ...state,
        conference: action.payload,
        error: null 
      };
    case SET_LOCAL_TRACKS:
      return{
        ...state,
        localTracks: action.payload,
        error: null 
      };
    case SET_REMOTE_TRACKS:
      return{
        ...state,
        remoteTracks: action.payload,
        error: null 
      };
    default:
      return state;
  }
};

export default rootReducer;


  
  