<template>
    <div :ref="'canvasParent'" class="w-full h-full" id="p5Canvas"></div>
</template>

<script>

import Vector2 from "../editor/Vector2";
import TextCard from "../editor/render_objects/TextCard";
import ZoomHelper from "../editor/ZoomHelper";

export default {
    name: 'editor',
    data () {
        return {}
    },
    mounted() {
        new ZoomHelper();
        const script = (p5) => {
            let viewZoom = 1;
            let viewPosition = new Vector2(0, 0);
            let dragOffset = new Vector2(0, 0);
            let textCards = [];

            p5.setup = () => {
                let canvasParent = this.$refs.canvasParent;
                let canvas = p5.createCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
                canvas.parent("p5Canvas");
                canvas.mouseWheel(onScroll);

                textCards.push(
                    new TextCard(
                        (p5.width / 4) - 100,
                        (p5.height / 2) - 100,
                        200, 300
                    )
                );

                textCards.push(
                    new TextCard(
                        (p5.width / 2) - 100,
                        (p5.height / 2) - 100,
                        200, 300
                    )
                );

                textCards.push(
                    new TextCard(
                        (p5.width / 1.33) - 100,
                        (p5.height / 2) - 100,
                        200, 300
                    )
                );
            }

            p5.draw = () => {
                p5.background(255);

                textCards.forEach((textCard) => {
                    textCard.Update(p5, viewZoom, viewPosition);
                });

                textCards.forEach((textCard) => {
                    textCard.Render(p5, viewZoom, viewPosition);
                });
            }

            // Keep p5 canvas full width and height
            p5.windowResized = () => {
                p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
            }

            p5.mousePressed = () => {
                let cardClicked = false;

                textCards.forEach((textCard) => {
                    if (textCard.mouseHovers) {
                        textCard.dragLock = true;
                        cardClicked = true;

                        dragOffset.x = p5.mouseX - textCard.x;
                        dragOffset.y = p5.mouseY - textCard.y;
                    } else {
                        textCard.dragLock = false;
                    }
                });

                if(!cardClicked) {
                    dragOffset.x = p5.mouseX - viewPosition.x;
                    dragOffset.y = p5.mouseY - viewPosition.y;
                }
            }

            p5.mouseDragged = () => {
                let viewDragged = true;

                textCards.forEach((textCard) => {
                    if(textCard.dragLock) {
                        viewDragged = false;

                        textCard.x = p5.mouseX - dragOffset.x;
                        textCard.y = p5.mouseY - dragOffset.y;
                    }
                });

                if(viewDragged) {
                    viewPosition.x = p5.mouseX - dragOffset.x;
                    viewPosition.y = p5.mouseY - dragOffset.y;
                }
            }

            p5.mouseReleased = () => {
                textCards.forEach((textCard) => {
                    textCard.dragLock = false;
                });

                dragOffset.x = dragOffset.y = 0;
            }

            let onScroll = (event) => {
                if (event.deltaY > 0) {
                    viewZoom -= 0.2;
                } else {
                    viewZoom += 0.2;
                }
            }
        }

        const P5 = require('p5');
        new P5(script)
    }
}
</script>