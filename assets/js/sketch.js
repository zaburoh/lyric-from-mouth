// textalive
import { player } from './player';

// p5は呼び出し側（main.js）でimport済み
import Settings from './p5/settings';
import { Char } from './char';

// 顔検出
import { FaceDetectionCamera } from './faceDetectionCamera';

/**
 * p5.jsのコンテナ
 * - p5.jsのcanvasを格納するコンテナ
 */
export const canvasContainer = document.createElement('div');
canvasContainer.id = 'CanvasContainer';
canvasContainer.classList.add('canvas-container');

/**
 * p5.js sketch
 */
export const sketch = (p5) => {
  // canvasサイズなどの設定
  let settings;
  let font;
  let charList = [];
  let faces = [];
  let faceDetectionCamera = null;

  // player wrapper
  const position = () => player.timer.position;
  const char = (position) => player.video.findChar(position - 100, { loose: false });
  const beat = (position) => player.findBeat(position);

  p5.preload = async function() {
    font = p5.loadFont('./fonts/KaiseiDecol-Regular.ttf');
    faceDetectionCamera = new FaceDetectionCamera(canvasContainer);
    await faceDetectionCamera.start();
  };

  // キャンバス設定
  p5.setup = function() {
    p5.frameRate(30);
    // main canvas
    p5.createCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight, p5.WEBGL);

    // video canvas
    faceDetectionCamera.canvas.width = canvasContainer.clientWidth;
    faceDetectionCamera.canvas.height = canvasContainer.clientHeight;

    // setting
    settings = new Settings(p5);
    settings.setTextConfig(font);

    p5.background('rgba(255,255,255,0)');

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Cameraとvideoタグの紐づけ
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user'}, audio: false })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
          alert('カメラの使用を許可してください。');
        });
    } else {
      alert('ブラウザが対応していません。');
    }

    /**
     * play | pause button 
     */
    const playButton = document.querySelector('#Play');
    playButton.addEventListener('click', () => {
      if (player.isPlaying) {
        player.requestPause();
        faceDetectionCamera.video.pause();
        playButton.children[0].classList.remove('fa-pause');
        playButton.children[0].classList.add('fa-play');
      } else {
        player.requestPlay();
        faceDetectionCamera.video.play();
        playButton.children[0].classList.remove('fa-play');
        playButton.children[0].classList.add('fa-pause');
      }
    });

    player.addListener({
      onPause: () => {
        p5.background(100, 100, 100);
        displaySongTitle();
        charList = [];
      }
    });
  };

  // windowサイズ変更時の処理
  p5.windowResized = function() {
    p5.resizeCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
    settings.canvas.resize(p5.width/2, p5.height/2, -p5.width/2, -p5.height/2);
    faceDetectionCamera.canvas.width = canvasContainer.clientWidth;
    faceDetectionCamera.canvas.height = canvasContainer.clientHeight;
    displaySongTitle();
  }

  // main loop
  p5.draw = async function() {
    const pos = position();
    // videoをcanvasに描画
    faceDetectionCamera.drawVideo();
    faces = await faceDetectionCamera.renderPrediction();

    if(!player.isLoading && faceDetectionCamera.existDetector()) {
      document.querySelector('.loading').style.display = 'none';
    }

    if(pos) {
      // console.log(faces);
      if(faces.length > 0) {
        TextSample6(pos, faces);
      } else {
        TextSample4(pos);
      }
    }
  };

  function TextSample4(pos) {
    p5.textAlign(p5.LEFT, p5.CENTER);

    let unit = char(pos);
    if(!unit) return;
    const horizontalCharCount = 8;
    const verticalCharCount = Math.floor(horizontalCharCount * p5.height/p5.width)
    const textSize = p5.width/horizontalCharCount;
    while(unit) {
      // endTimeの160msあとに1文字終了
      if(unit.endTime + 160 < pos) break;

      // startTimeの100ms前に1文字開始
      if(unit.startTime - 100 < pos) {
        const charIndex = player.video.findIndex(unit);
        let col = (charIndex % horizontalCharCount)
        let row = (Math.floor(charIndex / horizontalCharCount)) % verticalCharCount;
        let x = col * textSize;
        let y = row * textSize;
        let bp = beat(pos).progress(pos);

        // 発声前
        if(pos < unit.startTime) {
          p5.fill(50, 50, 50);
          p5.textSize(textSize);
        }
        // 発声後
        else if(unit.endTime < pos) {
          p5.fill(100*bp, 100*bp, 100*bp);    
          p5.textSize(textSize);    
        }
        // 発声中
        else {
          p5.fill(100, 100, 100);
          // p5.textSize(textSize*vocalAmplitude(pos)/100000);
          p5.textSize(textSize);    
        }
        
        if(row == 0 && col == 0 && unit.endTime - unit.duration/3 <= pos) p5.background('rgba(255,255,255,0.1)');

        p5.textAlign(p5.LEFT, p5.TOP);
        p5.translate(bp, bp, bp)
        p5.text(unit.text, settings.canvas.left + x, settings.canvas.top + y);
      }

      unit = unit.next;
    }
  }
  function TextSample6(pos) {
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.background(p5.color(100, 100, 100, 0));
    // 表示する文字のリスト
    if(charList.length > 0) {
      charList.forEach((c, index) => {
        c.draw(p5);
        c.move(p5, index);
      });
    }

    let unit = char(pos);
    if(!unit) return;

    while(unit) {
      // endTimeの160msあとに1文字終了
      if(unit.endTime + 160 < pos) break;

      if(unit.startTime < pos) {
        const charIndex = player.video.findIndex(unit);

        const [mouthX, mouthY, openMouthSize] = faceDetectionCamera.getMouthCenter();

        if(charIndex == 0) {
          charList = [];
        }
        charList[charIndex] = new Char(unit.text, settings.canvas.left + mouthX, settings.canvas.top + mouthY, openMouthSize*1.25, p5.color(200, 200, 200));
      }
      unit = unit.next;
    }
  }

  function displaySongTitle() {
    p5.push();
    p5.fill(255, 255, 255);
    p5.textSize(p5.width/player.data.song.name.length);
    p5.text(player.data.song.name, 0, 0);
    p5.textSize(28);
    p5.text(player.data.song.artist.name, 0, 200);
    p5.pop();
  }
}