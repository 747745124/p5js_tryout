//Position
let x = [];
//Delta X
let deltaX;
//Velocity X
let velocityX = [];
//Force X
let forceX;

let y = [];
let deltaY;
let velocityY = [];
let forceY;

//Mass
let mass = [];
let deltaT;
let N;
let I;
let r;

let type = [];
let colorPalette = [];
let RGB = [];

const MAX_HEIGHT = 1480;
const MAX_WIDTH = 1380;
const STEP = 40;

const VARIANCE_FACTOR = 100;
const TONES_1 = [[221, 81, 104], [38, 64, 101], [240, 227, 186]];
const TONES_2 = [[37, 106, 220], [31, 64, 104], [169, 251, 215]];
const MONOCHROME = [[0, 32, 63]];


function setup() {
    createCanvas(windowWidth, windowHeight);
    N = 1000;
    I = 0;
    deltaT = 0.001;
    x[0] = 200;
    y[0] = 200;
    deltaX = 0;
    forceX = 0;
    deltaY = 0;
    forceY = 0;
    mass[0] = 10;
    r = 0;
    //initialize
    for (var i = 0; i < N; i++) {
        x[i] = random(1, 200);
        velocityX[i] = random(-1, 1);
        y[i] = random(1, 200);
        velocityY[i] = random(-1, 1);
        mass[i] = random(30, 40);
        type[i] = int(mass[i] % 4);
        switch (type[i]) {
            case 0:
                RGB = {
                    "R": 238, "G": 66, "B": 102
                }; break;
            case 1:
                RGB = {
                    "R": 31, "G": 64, "B": 104
                }; break;
            case 2:
                RGB = {
                    "R": 242, "G": 228, "B": 181
                }; break;
            case 3:
                RGB = {
                    "R": 169, "G": 251, "B": 215
                }; break;
        }
        colorPalette.push(RGB)

    }
    background(0, 0, 0, 20);
}

function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function draw() {
    background(0, 0, 0);
    //lines prepare
    const lines = [];
    for (let i = STEP; i < MAX_HEIGHT - STEP; i += STEP) {
        let line = [];
        for (let j = STEP; j <= MAX_HEIGHT - STEP; j += STEP) {
            let distanceToCenter = Math.abs(j - MAX_HEIGHT / 2);
            let variance = Math.max(MAX_HEIGHT / 2 - VARIANCE_FACTOR - distanceToCenter, 0);
            let random = Math.random() * 0.01
                * variance / 2 * -1;
            let point = { x: j - 20, y: i + random - 140 };
            line.push(point)
        }
        lines.push(line);
    }

    // fill(255);
    // background
    // I % 2 ? stroke(255) : stroke(0);
    for (let i = 5; i < lines.length; i++) {
        beginShape();
        for (let j = 0; j < lines[i].length; j += 2) {
            curveVertex(lines[i][j].x, lines[i][j].y);
            let random_index = Math.floor(Math.random() * TONES_1.length);
            const [r, g, b] = TONES_1[random_index];
            fill(r, g, b);
            curveVertex(lines[i][j + 1].x, lines[i][j + 1].y);
        }
        endShape();
    }

    // Compute gravitational forces 
    for (var i = 0; i < I; i++) {

        forceX = 0;
        forceY = 0;
        for (var j = 0; j < I; j++) {
            if (i != j) {
                deltaX = x[i] - x[j];
                deltaY = y[i] - y[j];
                r = pow(deltaX, 2) + pow(deltaY, 2);//r =sqrt(x^2+y^2);
                r = sqrt(r);
                // if collapse, destory(by taking it faraway)
                if (r < 10 && I >= 2) {
                    if (I % 2 == 1) {
                        x[i] = -1000;
                        velocityX[i] = 0;
                        velocityY[i] = 0;
                        x[j] = -1000;
                        velocityX[j] = 0;
                        velocityY[j] = 0;
                    }
                    else {
                        type[i] += 1;
                        type[j] += 1;
                    }
                }


                // if (r < (mass[i] + mass[j])) { velocityX[i] = -velocityX[i]; velocityX[j] = -velocityX[j]; velocityY[i] = -velocityY[i]; velocityY[j] = -velocityY[j]; }
                forceX = forceX - mass[i] * mass[j] * 1000000 * deltaX / pow(r + 10, 3);
                forceY = forceY - mass[i] * mass[j] * 1000000 * deltaY / pow(r + 10, 3);
            }
            else { continue; }
        }
        //update velocities
        velocityX[i] = velocityX[i] + forceX * deltaT / mass[i];
        velocityY[i] = velocityY[i] + forceY * deltaT / mass[i];
        //border reflection
        if (x[i] <= 0 || x[i] >= windowWidth)
            velocityX[i] = -velocityX[i];
        if (y[i] <= 0 || y[i] >= windowHeight)
            velocityY[i] = -velocityY[i];
        //update positions
        x[i] = x[i] + velocityX[i] * deltaT;
        y[i] = y[i] + velocityY[i] * deltaT;
        //color generator
        fill(colorPalette[i].R, colorPalette[i].G, colorPalette[i].B);
        noStroke();
        //plot with certain trace
        switch (type[i] % 4) {

            case 0:
                ellipse(x[i], y[i], mass[i], mass[i]);
                break;
            case 1:
                rect(x[i], y[i], mass[i], 40, mass[i]);
                break;
            case 2:
                rect(x[i], y[i], mass[i] + 10, mass[i] + 10);
                break;
            case 3:
                ellipse(x[i], y[i], mass[i], mass[i], mass[i]);
                break;
        }
    }



}
//add celestial bodies
function mousePressed() {
    // random_index = Math.floor(Math.random() * TONES_1.length);
    x[I] = mouseX;
    y[I] = mouseY;
    I = I + 1;
}
