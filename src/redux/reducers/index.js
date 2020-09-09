import { SET_PAGE } from "../actions/video.actions.types";

const initialState = {
  page: 'home',
};

function rootReducer(state = initialState, action){
  switch(action.type){
      case SET_PAGE:
          return{
              ...state,
              page: action.payload,
              error: null 
          };
      default:
          return state;
  }
};

export default rootReducer;