import '../css/style.css';
// アイコンライブラリ
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

// p5.jsライブラリ
import p5 from 'p5';
import { sketch, canvasContainer}  from './sketch.js';

function main() {
  console.log('main');

  // 準備 
  const app = document.querySelector('#app');
  /**
   * loading icon
   */
  const loadingIcon = document.createElement('i');
  loadingIcon.classList.add('fas', 'fa-sync', 'fa-spin', 'loading');

  canvasContainer.append(loadingIcon);
  app.append(canvasContainer);

  // textalive-app-api
  new p5(sketch, canvasContainer);
}

main();