class TextCard {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.innerPadding = 10;

        this.backgroundColour = [255, 255, 255];

        this.borderWidth = 1;
        this.borderColour = [0, 0, 0];

        this.textColour = [0, 0, 0];
        this.textSize = 12;
        this.text = 'This is a most lovely day, indeed! ' + Math.random(100);

        this.mouseHovers = false;   // Mouse hovering over card right now
        this.dragLock = false;      // Mouse click-dragging box right now
    }

    Update(p5, viewZoom, viewPosition) {
        if (p5.mouseX > (viewPosition.x + this.x) * viewZoom                &&
            p5.mouseX < (viewPosition.x + this.x + this.width) * viewZoom   &&
            p5.mouseY > (viewPosition.y + this.y) * viewZoom                &&
            p5.mouseY < (viewPosition.y + this.y + this.height) * viewZoom
        ) {
            this.mouseHovers = true;
        } else {
            this.mouseHovers = false
        }
    }

    Render(p5, viewScale, viewPosition) {
        p5.push();

        p5.fill(this.borderColour[0], this.borderColour[1], this.borderColour[2]);
        p5.rect(
            (viewPosition.x + this.x) * viewScale,
            (this.y + viewPosition.y) * viewScale,
            this.width * viewScale,
            this.height * viewScale
        );

        p5.fill(this.backgroundColour[0], this.backgroundColour[1], this.backgroundColour[2]);
        p5.rect(
            (viewPosition.x + this.x + this.borderWidth) * viewScale,
            (viewPosition.y + this.y + this.borderWidth) * viewScale,
            (this.width - (this.borderWidth * 2)) * viewScale,
            (this.height - (this.borderWidth * 2)) * viewScale
        );

        this.RenderText(p5, viewScale, viewPosition);

        p5.pop();
    }

    RenderText(p5, viewScale, viewPosition) {
        p5.fill(this.textColour);
        p5.textSize(this.textSize * viewScale);
        p5.text(
            this.text,
            (viewPosition.x + this.x + this.innerPadding) * viewScale,
            (viewPosition.y + this.y + this.innerPadding) * viewScale,
            (this.width - this.innerPadding) * viewScale,
            (this.height - this.innerPadding) * viewScale,
        );
    }
}

export default TextCard;