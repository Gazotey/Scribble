<template>
    <div :ref="'canvasParent'" class="w-full h-full" id="p5Canvas"></div>
</template>

<script>

export default {
    name: 'editor',
    data () {
        return {}
    },
    mounted() {
        const script = (p5) => {
            var speed = 2;
            var posX = 0;

            p5.setup = () => {
                let canvasParent = this.$refs.canvasParent;

                var canvas = p5.createCanvas(canvasParent.clientWidth, canvasParent.clientHeight);
                canvas.parent("p5Canvas");

                p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);
            }


            p5.draw = () => {
                p5.background(0);
                const degree = p5.frameCount * 3;
                const y = p5.sin(p5.radians(degree)) * 50;

                p5.push();
                p5.translate(0, p5.height / 2);
                p5.ellipse(posX, y, 50, 50);
                p5.pop();
                posX += speed;

                if (posX > p5.width || posX < 0) {
                    speed *= -1;
                }
            }

            // Keep p5 canvas full width and height
            p5.windowResized = () => {
                p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
            }
        }

        const P5 = require('p5');
        new P5(script)
    }
}
</script>