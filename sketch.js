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
        type[i] = int(mass[i] % 8);
        switch (type[i]) {
            case 0:
                RGB = {
                    "R": 48, "G": 113, "B": 152
                }; break;
            case 1:
                RGB = {
                    "R": 95, "G": 187, "B": 217
                }; break;
            case 2:
                RGB = {
                    "R": 103, "G": 189, "B": 185
                }; break;
            case 3:
                RGB = {
                    "R": 240, "G": 214, "B": 97
                }; break;
            case 4:
                RGB = {
                    "R": 243, "G": 230, "B": 134
                }; break;
            case 5:
                RGB = {
                    "R": 126, "G": 99, "B": 56
                }; break;
            case 6:
                RGB = {
                    "R": 202, "G": 177, "B": 118
                }; break;
            case 7:
                RGB = {
                    "R": 11, "G": 36, "B": 71
                }; break;
        }
        colorPalette.push(RGB)

    }
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

    I % 2 ? background(0, 0, 0, 20) : background(255, 255, 255, 20)
    fill(0, 0, 255, 255);

    //Compute gravitational forces 
    for (var i = 0; i < I; i++) {
        forceX = 0;
        forceY = 0;
        for (var j = 0; j < I; j++) {
            deltaX = x[i] - x[j];
            deltaY = y[i] - y[j];
            r = pow(deltaX, 2) + pow(deltaY, 2);//r =sqrt(x^2+y^2);
            r = sqrt(r);
            // if (r < (mass[i] + mass[j])) { velocityX[i] = -velocityX[i]; velocityX[j] = -velocityX[j]; velocityY[i] = -velocityY[i]; velocityY[j] = -velocityY[j]; }
            forceX = forceX - mass[i] * mass[j] * 1000000 * deltaX / pow(r + 10, 3);
            forceY = forceY - mass[i] * mass[j] * 1000000 * deltaY / pow(r + 10, 3);
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
        switch (type[i] % 8) {

            case 0:
                ellipse(x[i], y[i], mass[i], mass[i]);
                break;
            case 1:
                star(x[i], y[i], mass[i], 40, mass[i]);
                break;
            case 2:
                rect(x[i], y[i], mass[i] + 10, mass[i] + 10);
                break;
            case 3:
                star(x[i], y[i], mass[i], 70, 5);
                break;
            case 4:
                rect(x[i], y[i], mass[i] + 10, mass[i] + 10);
                break;
            case 5:
                rect(x[i], y[i], mass[i] + 10, mass[i] + 10);
                break;
            case 6:
                star(x[i], y[i], mass[i], mass[i], 5);
                break;
            case 7:
                ellipse(x[i], y[i], mass[i], mass[i]);
                break;
        }
    }
}
//add celestial bodies
function mousePressed() {
    x[I] = mouseX;
    y[I] = mouseY;
    I = I + 1;
}
