import { Component } from './framework.js'

export class Carousel extends Component{
    constructor() {
        super();
        this.attributes = Object.create(null);
    }
    setAttribute(name,value) {
        this.attributes[name]=value;
    }
    render() {
        this.root = document.createElement("div");
        this.root.classList.add('carousel');
        for (let record of this.attributes.src) {
            let child = document.createElement('div');
            child.style.backgroundImage = `url(${record})`;
            // child.style.display = 'none';
            this.root.appendChild(child);
        }

        let position = 0;

        // mousemove和mouseup须在mousedown的条件下触发，故将监听也放进mousedown
        this.root.addEventListener('mousedown', event => {
            let children = this.root.children;
            let startX = event.clientX;

            let move = event => {
                let x = event.clientX - startX;

                let current = position - (x - x % 500) / 500;

                //只关心前后两图，可扩展为多个防止拖动超过一个图的宽度
                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
                }

            }
            let up = event => {
                let x = event.clientX - startX;
                position = position - Math.round(x / 500);
                //????如果正好在250处会卡住吗
                for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = '';
                    children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
                }
                this.root.removeEventListener('mousemove', move);
                this.root.removeEventListener('mouseup', up);
                // this.root.addEventListener('mouseout', up);
            }

            this.root.addEventListener('mousemove', move);
            this.root.addEventListener('mouseup', up);
            // this.root.addEventListener('mouseout', up);
        })


        let currentIndex = 0;
        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (currentIndex+1) % children.length;

            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transition = 'none';
            next.style.transform=`translateX(${100-nextIndex*100}%)`;
            
            setTimeout(() => {
                next.style.transition = '';
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`;
                
                currentIndex = nextIndex;
            },16)
        },3000)

        return this.root;
    }
    mountTo(parent) {
        parent.appendChild(this.render())
    }
}
