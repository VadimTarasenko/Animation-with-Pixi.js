const idGenerator = () => `f${(+new Date).toString(16)}`;

const loader = new PIXI.Loader();
const container = new PIXI.Container();

loader.add("img/gradient_large.png").add("img/gradient_elem2.png").add("img/bg.jpg").add("img/map.png").load(startApp);

class Ripple {
  constructor(sprite, id, onRemove) {
    this.id = id;
    this.sprite = sprite;
    this.filter = new PIXI.filters.DisplacementFilter(sprite);
    this.onRemove = onRemove;
    // temp ////////////////
    this.sprite.scale.x = 2;
    this.sprite.scale.y = 2;
    ////////////////////////
  }

  update = () => {
    if (this.sprite.scale.x < 13) {
      this.sprite.scale.x += 0.2;
      this.sprite.scale.y += 0.2;
    } else {
      this.onRemove && this.onRemove();
    }
  }
}

class Application extends PIXI.Application {
  constructor(options) {
    super(options);
    // start animation variables
    this.ripples = [];
    // mouse animation variables
    this.posX;
    this.displacementSprite;
    this.displacementFilter;
    this.vx;

    this.init();
  }

  init() {
    document.body.appendChild(this.view);
    this.stage.addChild(container);
    this.stage.interactive = true;
    this.renderer.backgroundColor = 0xffffff;
    const bg = new PIXI.Sprite(loader.resources["img/bg.jpg"].texture);
    bg.anchor.set(0.5);
    bg.position.set(this.renderer.view.width / 2, this.renderer.view.height / 2);
    this.stage.addChild(bg);

    this.initStartAnimation();
  }

  initStartAnimation() {
    this.ripples.push(this.createRipple(this.renderer.width / 2, 700));
    this.stage.filters = this.ripples.map((f) => f.filter);
    this.ripples.push(this.createRipple(1200, 700));
    this.stage.filters = this.ripples.map((f) => f.filter);
    this.ripples.push(this.createRipple(500, 100));
    this.stage.filters = this.ripples.map((f) => f.filter);
    this.ripples.push(this.createRipple(300, 800));
    this.stage.filters = this.ripples.map((f) => f.filter);
    this.ripples.push(this.createRipple(430, 0));
    this.stage.filters = this.ripples.map((f) => f.filter);
    this.ripples.push(this.createRipple(700, 440));
    this.stage.filters = this.ripples.map((f) => f.filter);

    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 15;
    this.stage.filters.push(blurFilter);

    const blurIncrease = setInterval(() => {
      if (blurFilter.blur > 0) {
        blurFilter.blur -= 0.5;
      } else {
        clearInterval(blurIncrease);
      }
    }, 50);

    this.updateStartAnimation();
  }

  initMouseAnimation() {
    this.posX = this.renderer.width / 2;

    this.displacementSprite = new PIXI.Sprite(loader.resources["img/gradient_large.png"].texture);
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.displacementSprite.anchor.set(0.5);
    this.displacementSprite.x = this.renderer.width / 2;
    this.displacementSprite.y = this.renderer.height / 2;

    this.vx = this.displacementSprite.x;
    this.stage.addChild(this.displacementSprite);
    this.stage.filters = [this.displacementFilter];
    this.displacementFilter.scale.x = 0;
    this.displacementFilter.scale.y = 0;

    this.stage.on("mousemove", this.handleMouseMove).on("touchmove", this.handleMouseMove);

    this.updateMouseAnimation();
  }

  createRipple = (positionX, positionY) => {
    const newRippleId = idGenerator();
    const rippleSprite = new PIXI.Sprite(loader.resources["img/map.png"].texture);
    rippleSprite.anchor.set(0.5);
    rippleSprite.position.set(positionX, positionY);
    rippleSprite.scale.set(0);
    this.stage.addChild(rippleSprite);

    const newRipple = new Ripple(rippleSprite, newRippleId, this.removeRipple(newRippleId));
    newRipple.filter.id = newRippleId;
    newRipple.sprite.id = newRippleId;

    return newRipple;
  }

  removeRipple = (id) => () => {
    this.ripples = this.ripples.filter(ripple => ripple.id !== id);
    this.stage.filters = this.stage.filters.filter(filter => filter.id !== id);
    this.stage.children = this.stage.children.filter(children => children.id !== id);
  }

  handleMouseMove = (eventData) => {
    this.posX = eventData.data.global.x;
  }

  updateStartAnimation = () => {
    if (!this.ripples.length) { // якщо немає точок, то зупиняємо обновлення стартової анімації і запускаємо анімацію на mousemouve
      this.initMouseAnimation();
      return;
    }

    requestAnimationFrame(this.updateStartAnimation);
    this.ripples.forEach(ripple => {
      ripple.update();
    });
    this.renderer.render(this.stage);
  }

  updateMouseAnimation = () => {
    const map = (n, start1, stop1, start2, stop2) => {
      const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
      return newval;
    };

    requestAnimationFrame(this.updateMouseAnimation);
    this.vx += (this.posX - this.displacementSprite.x) * 0.045;
    this.displacementSprite.x = this.vx;
    var disp = Math.floor(this.posX - this.displacementSprite.x);
    if (disp < 0) disp = -disp;
    var fs = map(disp, 0, 500, 0, 120);
    disp = map(disp, 0, 500, 0.1, 0.6);
    this.displacementSprite.scale.x = disp;
    this.displacementFilter.scale.x = fs;

  }
}

function startApp() {
  new Application({ height: window.innerHeight, width: window.innerWidth });
}