const app = new PIXI.Application({
  height: window.innerHeight,
  width: window.innerWidth
});
const loader = new PIXI.Loader();
const container = new PIXI.Container();

let posX, displacementSprite, displacementFilter, bg, vx;

document.body.appendChild(app.view);

app.stage.interactive = true;
app.stage.addChild(container);


loader.add("img/gradient4.png").add("img/bg.jpg").load(setup);

function setup() {
  posX = app.renderer.width / 2;
  displacementSprite = new PIXI.Sprite(loader.resources["img/gradient4.png"].texture);
  displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
  displacementSprite.anchor.set(0.5);
  displacementSprite.x = app.renderer.width / 2;
  displacementSprite.y = app.renderer.height / 2;
  vx = displacementSprite.x;
  app.stage.addChild(displacementSprite);
  container.filters = [displacementFilter];
  displacementFilter.scale.x = 0;
  displacementFilter.scale.y = 0;
  bg = new PIXI.Sprite(loader.resources["img/bg.jpg"].texture);
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
