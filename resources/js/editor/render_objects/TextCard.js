class TextCard {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.innerPadding = 10;

        this.primaryBGColour = [255, 255, 255];
        this.secondaryBGColour = [225, 225, 225];

        this.borderWidth = 1;
        this.primaryBorderColour = [0, 0, 0];
        this.secondaryBorderColour = [0, 0, 0];

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

        if(this.mouseHovers) {
            p5.fill(
                this.secondaryBorderColour[0],
                this.secondaryBorderColour[1],
                this.secondaryBorderColour[2]
            );
        } else {
            p5.fill(
                this.primaryBorderColour[0],
                this.primaryBorderColour[1],
                this.primaryBorderColour[2]
            );
        }

        p5.rect(
            (viewPosition.x + this.x) * viewScale,
            (this.y + viewPosition.y) * viewScale,
            this.width * viewScale,
            this.height * viewScale
        );

        if(this.mouseHovers) {
            p5.fill(
                this.secondaryBGColour[0],
                this.secondaryBGColour[1],
                this.secondaryBGColour[2]
            );
        } else {
            p5.fill(
                this.primaryBGColour[0],
                this.primaryBGColour[1],
                this.primaryBGColour[2]
            );
        }

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