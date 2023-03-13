class Farm {
  constructor(x, width) {
    this.x = x;
    this.width = width;

    this.left = x - width/2;
    this.right = x + width/2;

    const infinity = 10000000
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = {x:this.left, y:this.top};
    const bottomLeft = {x:this.left, y:this.bottom};
    const topRight = {x:this.right, y:this.top};
    const bottomRight = {x:this.right, y:this.bottom};

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight]
    ]
  }
}