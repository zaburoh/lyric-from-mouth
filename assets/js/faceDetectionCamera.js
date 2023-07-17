// Register WebGL backend.
// import '@mediapipe/face_mesh';
// import '@tensorflow/tfjs-core';
// face-landmarks-detection
// import '@tensorflow/tfjs-backend-webgl';
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const MIN_TEXT_SIZE = 8;

export class FaceDetectionCamera {
  /**
   * viddeoタグとcanvasタグを生成
   * @param {HTMLElement} canvasContainer videoタグとcanvasタグを追加する親要素
   */
  constructor(canvasContainer) {
    // canvasタグ
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas';
    this.ctx = this.canvas.getContext('2d');

    // videoタグ
    this.video = document.createElement('video');
    this.video.id = 'video';
    this.video.textContent = 'Video stream not available.';
    // video.setAttribute('autoplay', ''); // スマホだと警告でる
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('muted', '');
    this.video.display = 'none';

    // 検出オプション
    this.faces = [];
    this.estimationConfig = { flipHorizontal: false };

    // append
    canvasContainer.append(this.canvas);
    canvasContainer.append(this.video);
  }

  async start() {
    this.detector = await this.getDetector();
  }

  async getDetector() {
    /**
     * face landmark detection
     */
    let model = null;
    let detector = null;
    console.log('model loading...');

    try {
      model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    } catch (e) {
      console.error('model error.', e);
    }

    // - tfjs ※あまり制度がよくない...
    // const detectorConfig = {
    //   runtime: 'tfjs',
    //   refineLandmarks: true,
    // };
    // - mediapipe
    const detectorConfig = {
      runtime: 'mediapipe',
      // CDN
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh`,
      // solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
      // LOCAL
      // solutionPath: './face_mesh',
    }

    try{
      detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    } catch (e) {
      console.error('failed create detector.', e);
    }

    console.log('model loading complete.');
    return detector;
  }

  drawVideo() {
    // canvasサイズの更新
    this.scaleX = this.canvas.width / this.video.videoWidth;
    this.scaleY = this.canvas.height / this.video.videoHeight;
    
    this.ctx.drawImage(
      this.video, 
      0, 0, this.video.videoWidth, this.video.videoHeight,
      0, 0, this.canvas.width, this.canvas.height
    );
  }

  async renderPrediction() {
    // videoの準備ができているか確認
    if (this.video.readyState < 2) {
      await new Promise((resolve) => {
        video.onloadeddata = () => {
          resolve(video);
        };
      });
    }

    // 顔検出
    this.faces = await this.detector.estimateFaces(this.video, this.estimationConfig);
    return this.faces;
  }

  existDetector() {
    return this.detector != null;
  }

  /**
   * 口の中心のx, y座標と口の開き具合を返す
   * @param {*} path label'lips' のpath配列
   * @returns 口の中心のx, y座標と口の開き具合
   */
  _getMouthCenter(path) {
    const innerLowerLip = path[25]
    const innerUpperLip = path[35]

    const openMouthSize = innerLowerLip[1] - innerUpperLip[1];
    const y = innerLowerLip[1] - openMouthSize / 2;

    return [innerLowerLip[0], y, openMouthSize < MIN_TEXT_SIZE ? MIN_TEXT_SIZE : openMouthSize];
  }
  
  /**
   * videoとcanvasのスケール差を合わせて口の中心のx, y座標と口の開き具合を返す
   */
  getMouthCenter() {
    const face = this.faces[0];
    const keypoints = face.keypoints.map((keypoint) => [keypoint.x*this.scaleX, keypoint.y*this.scaleY]);
    const contours = faceLandmarksDetection.util
      .getKeypointIndexByContour(faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh);

    for (const [label, contour] of Object.entries(contours)) {
      this.ctx.strokeStyle = '#E0E0E0';
      this.ctx.lineWidth = 1;

      const path = contour.map((index) => keypoints[index]);
      if (path.every(value => value != undefined)) {
        
        // drawPath(ctx, path, false);
        
        switch(label) {
          case 'lips':
            return this._getMouthCenter(path);
          default:
            break;
        }
      }
    }
    return [0, 0, 0];
  }
}