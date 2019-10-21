const app = new PIXI.Application({
  height: window.innerHeight,   // висота канваса
  width: window.innerWidth      // ширина канваса
});
const loader = new PIXI.Loader(); // об'єкт для загрузки і збереження спрайтів (картинок)
const container = new PIXI.Container(); // сукупність об'єктів (фоток, фільтрів ...)

let posX, displacementSprite, displacementFilter, vx;

document.body.appendChild(app.view); // добавляємо до body - canvas

app.stage.interactive = true; // дозволити події на канвасі ("mousemove" на 38 строчці)
app.stage.addChild(container);


loader.add("img/gradient4.png").add("img/gradient_large.png").add("img/bg.jpg").load(setup); // загружаємо картинки. Після загрузки - запускаємо ф-цію "setup"

function setup() {
  posX = app.renderer.width / 2; // центр канваса

  displacementSprite = new PIXI.Sprite(loader.resources["img/gradient_large.png"].texture); // спрайт, на основі якого буде створений фільтер
  displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite); // створюємо фільтер
  // починати анімацію із центра (при першому mouseover на канвасі)
  displacementSprite.anchor.set(0.5);
  displacementSprite.x = app.renderer.width / 2;
  displacementSprite.y = app.renderer.height / 2;

  vx = displacementSprite.x;
  app.stage.addChild(displacementSprite);
  container.filters = [displacementFilter, blurFilter];
  displacementFilter.scale.x = 0;
  displacementFilter.scale.y = 0;

  // const blurRaising = setInterval(() => {
  //   blurFilter.blur += 3;
  //   if(blurFilter.blur > 15) {
  //     clearInterval(blurRaising);
  //   }
  // }, 100);

  const bg = new PIXI.Sprite(loader.resources["img/bg.jpg"].texture);
  bg.width = app.renderer.width;
  bg.height = app.renderer.height;
  container.addChild(bg);

  app.stage.on("mousemove", onPointerMove).on("touchmove", onPointerMove);
  
  loop();
}

function onPointerMove(eventData) {
  posX = eventData.data.global.x;
}

function loop() {
  requestAnimationFrame(loop);
  vx += (posX - displacementSprite.x) * 0.045;
  displacementSprite.x = vx;
  var disp = Math.floor(posX - displacementSprite.x);
  if (disp < 0) disp = -disp;
  var fs = map(disp, 0, 500, 0, 120);
  disp = map(disp, 0, 500, 0.1, 0.6);
  displacementSprite.scale.x = disp;
  displacementFilter.scale.x = fs;
}

const map = (n, start1, stop1, start2, stop2) => {
  var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  return newval;
};
