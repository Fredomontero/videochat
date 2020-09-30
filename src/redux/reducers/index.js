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
} from "../actions/video.actions.types";

const initialState = {
  page: 'home',
  meetingCode: 'testcodesdsd',
  deviceList: [],
  micId: null,
  videoId: null,
  speakerId: null,
  serverURL: 'beta.meet.jit.si',
  connection: null,
  conference: null,
  localTracks: [],
  remoteTracks: {},
  activeRoomId: null,
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
      let userID = action.payload.participantId;
      let updatedTracks = [];
      if(state.remoteTracks[userID]){
        if(state.remoteTracks[userID].length >= 2){
          console.log("Updating");
          let idx = state.remoteTracks[userID].findIndex( track => track.type === action.payload.type);
          if(idx > -1){
            state.remoteTracks[userID][idx] = action.payload;
          }
        }
        updatedTracks = [...state.remoteTracks[userID]];
      }
      updatedTracks.push(action.payload)
      return{
        ...state,
        remoteTracks: {
          ...state.remoteTracks,
          [userID]: updatedTracks
        },
        error: null 
      };
    case SET_ACTIVE_ROOM_ID:
      return{
        ...state,
        activeRoomId: action.payload,
        error: null 
      };
    case REMOVE_REMOTE_TRACK: 
      console.log("Action Payload: ", action.payload);
      let participantId = action.payload.ownerEndpointId;
      let type = action.payload.type;
      console.log("** The participant ID is: ", participantId);
      console.log("** The type is: ", type);
      let newTracks = state.remoteTracks[participantId].filter(track => track.type !== type);
      console.log("The filtered tracks are: ", newTracks);
      let tempTracks;
      if(newTracks.length > 0){
        tempTracks = {
          ...state.remoteTracks,
          [participantId]: newTracks
        }
      }else{
        console.log("Inside Else, let's remove the property");
        tempTracks = {...state.remoteTracks};
        delete tempTracks[participantId];
      }
      console.log('%c ***********************', 'background: #fdee00; color: #ff0000');
      console.log("Updating this: ", state.remoteTracks);
      console.log("with this: ", tempTracks);
      console.log('%c ***********************', 'background: #fdee00; color: #ff0000');
      return {
        ...state,
        remoteTracks: tempTracks,
        error: null
      }
    default:
      return state;
  }
};

export default rootReducer;

