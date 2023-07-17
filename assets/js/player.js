import { Player, Ease } from 'textalive-app-api';
import songList from '../json/songs.json';
import showControls from './controller';

// TextAlive Player を作る
const player = new Player({ 
  app: { token: "GHKfsMNNYVc18z6b" },
  valenceArousalEnabled: true,
  vocalAmplitudeEnabled: true
});

player.addListener({
  onAppReady: (app) => {
    console.log('[* ] onAppReady');
    if (!app.songUrl) {
      // URLを指定して楽曲をもとにした動画データを作成
      let number = 1;
      console.log(`song url not found. default: ${songList.songs[number].title}`)
      player.createFromSongUrl(songList.songs[number].url, {video: songList.songs[number].video})
    }
    if (!app.managed) {
      // 再生コントロールを表示
      console.log('host not found.')
      showControls(player, songList);
    } else {
      // 再生コントロールを表示しない
    }
  },

  onTextLoad: (body) => {
    // すべての歌詞を取得
    // document.querySelector('#dummy').textContent = body.text;
  },
  
  onAppMediaChange: (mediaUrl) => {
    console.log("新しい再生楽曲が指定されました:", mediaUrl);
  },

  onPlay: () => {
    console.log('onPlay');
  },

  onPause: () => {
    console.log('onPause');
  },

  onSeek: () => {
    console.log('onSeek');
  },

  onStop: () => {
    console.log('onStop');
  }

});

export { player, Ease };
