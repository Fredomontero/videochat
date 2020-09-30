import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  videoCallContainer:{
    borderWidth: '5px',
    borderColor: '#87a96b',
    border: 'solid',
    height: '100%'
  },
  body: {
    borderWidth: '5px',
    borderColor: '#00ffff',
    border: 'solid',
    height: '90%'
  },
  controlBar: {
    backgroundColor: '#a9a9a9',
    height: '10%'
  },
  participantsContainer: {
    borderWidth: '5px',
    backgroundColor: '#cd5b45',
    margin: '3%',
    boxSizing: 'border-box',
    height: '90%'
  },
  participant: {
    borderWidth: '5px',
    borderColor: '#03c03c',
    border: 'solid',
  },
  floatingVideo: {
    position: 'absolute',
    width: '250px',
    height: '150px',
    backgroundColor: '#000000',
    color: '#ffffff',
    right: "25px",
    top: '25px',
    transition: 'all .2s ease-in-out',
    transformOrigin: 'right top',

    '&:hover':{
      transform: 'scale(1.2)'
    }
  }
})