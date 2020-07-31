function dotDance(){
var dotMargin = 1;
var numRows = 20;
var numCols = 20;
// Set the colors you want to support in this array
var colors = ["#722e94","#b97cca","#b16a24","#86bf87","#23632f"];
var directions = ['+', '-'];
var speeds = [0.5, 1, 1.5, 2, 2.5];

var canvas = $('canvas.dots');
var context = canvas[0].getContext('2d');
var canvasWidth = canvas.width();
var canvasHeight = canvas.height(); // this one is new
canvas.attr({height: canvasHeight, width: canvasWidth});

var dotWidth = ((canvasWidth - (2 * dotMargin)) / numCols) - dotMargin;
var dotHeight = ((canvasHeight - (2 * dotMargin)) / numRows) - dotMargin;

if( dotWidth > dotHeight ) {
  var dotDiameter = dotHeight;
  var xMargin = (canvasWidth - ((2 * dotMargin) + (numCols * dotDiameter))) / numCols;
  var yMargin = dotMargin;
} else {
  var dotDiameter = dotWidth;
  var xMargin = dotMargin;
  var yMargin = (canvasHeight - ((2 * dotMargin) + (numRows * dotDiameter))) / numRows;
}

// Start with an empty array of dots.
var dots = [];

var dotRadius = 2.5;

for(var i = 0; i < numRows; i++) {
  for(var j = 0; j < numCols; j++) {
  var x = (j * (dotDiameter + xMargin)) + dotMargin + (xMargin / 2) + dotRadius;
  var y = (i * (dotDiameter + yMargin)) + dotMargin + (yMargin / 2) + dotRadius;
  // Get random color, direction and speed.
  var color = colors[Math.floor(Math.random() * colors.length)];
  var xMove = directions[Math.floor(Math.random() * directions.length)];
  var yMove = directions[Math.floor(Math.random() * directions.length)];
  var speed = speeds[Math.floor(Math.random() * speeds.length)];
  // Set the object.
  var dot = {
    x: x,
    y: y,
    radius: dotRadius,
    xMove: xMove,
    yMove: yMove,
    color: color,
    speed: speed
  };
  // Save it to the dots array.
  dots.push(dot);
  drawDot(dot);
  }
}

// Draw each dot in the dots array.
for( i = 0; i < dots.length; i++ ) {
  drawDot(dots[i]);
};

setTimeout(function(){
  window.requestAnimationFrame(moveDot);
}, 1);


function moveDot() {
  context.clearRect(0, 0, canvasWidth, canvasHeight)

  for( i = 0; i < dots.length; i++ ) {

    if( dots[i].xMove == '+' ) {
      dots[i].x += dots[i].speed;
    } else {
      dots[i].x -= dots[i].speed;
    }
    if( dots[i].yMove == '+' ) {
      dots[i].y += dots[i].speed;
    } else {
      dots[i].y -= dots[i].speed;
    }

    drawDot(dots[i])

    if( (dots[i].x + dots[i].radius) >= canvasWidth ) {
      dots[i].xMove = '-';
    }
    if( (dots[i].x - dots[i].radius) <= 0 ) {
      dots[i].xMove = '+';
    }
    if( (dots[i].y + dots[i].radius) >= canvasHeight ) {
      dots[i].yMove = '-';
    }
    if( (dots[i].y - dots[i].radius) <= 0 ) {
      dots[i].yMove = '+';
    }
  }

  window.requestAnimationFrame(moveDot);
}

function drawDot(dot) {
  // Set transparency on the dots.
  context.globalAlpha = 1;
  context.beginPath();
  context.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI, false);
  context.fillStyle = dot.color;
  context.fill();
}
}
window.onload=dotDance()