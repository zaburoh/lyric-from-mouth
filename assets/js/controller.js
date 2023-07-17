// コントロールの表示
export const createControl = function(controlName, listener, icon=null) {
  const button = document.createElement('button');
  if(icon) {
    button.append(icon);
  } else {
    button.textContent = controlName;
  }
  button.id = controlName;
  button.addEventListener('click', listener);
  return button;
}

const showControls = function(player, songList) {
  console.log('show controls.');
  const controllContainer = document.createElement('div');
  
  const selectControl = document.createElement('div');
  const playerControl = document.createElement('div');

  controllContainer.id = 'control-container';
  playerControl.id = 'player-control';
  selectControl.id = 'select-control';

  const playIcon = document.createElement('i');
  playIcon.classList.add('fas', 'fa-play', 'play');

  const stopIcon = document.createElement('i');
  stopIcon.classList.add('fas', 'fa-sync', 'fa-stop', 'stop');

  const playButton = createControl('Play', () => player.requestPlay(), playIcon);
  const stopButton = createControl('Stop', () => {
    player.requestStop();
    playButton.childNodes[0].classList.remove('fa-pause');
    playButton.childNodes[0].classList.add('fa-play');
  }, stopIcon);

  songList.songs.forEach((song, index) => {
    let songButton = createControl(song.title.split('/')[0], () => {
      player.createFromSongUrl(song.url, {video: song.video})
    });
    selectControl.append(songButton);  
  })
  
  playerControl.append(playButton);
  playerControl.append(stopButton);

  controllContainer.append(playerControl);
  controllContainer.append(selectControl);

  app.append(controllContainer);
}

export default showControls;