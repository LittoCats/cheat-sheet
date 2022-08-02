/*******************************************************************************
 * @author      : 程巍巍 (littocats@gmail.com)
 * @created     : Tuesday Aug 02, 2022 12:52:57 CST
 *
 * @description : bta
 *
 ******************************************************************************/
import './bta.scss'

interface Point {
  x: number;
  y: number;
}

export namespace BookView {
  export interface Options {
    current?: number; // default 0
    render?(page: number, on: HTMLDivElement, options: Options): void;
  }
}

export function BookView(container: string | HTMLDivElement, options: BookView.Options) {
  const self = this instanceof BookView ? this : Object.setPrototypeOf({}, BookView.prototype);

  self.id = `${Math.random().toString(36).slice(2)}`;
  self.container = typeof container === 'string' ? document.querySelector(container) as HTMLDivElement : container;
  self.options = options =  {...options, current: options.current || 0};

  // 0. 添加 data-sta selector, 注要用于更新 css
  self.container.dataset.BookView = self.id;

  // 1. 移除 parent 中的所有子元素
  self.container.innerHTML = '';

  // 2. 添加三个页面: previous current next
  self.first = document.createElement('div');
  self.current = document.createElement('div');
  self.last = document.createElement('div');
  self.first.innerHTML = self.current.innerHTML = self.last.innerHTML = '<div/>'

  const anchor = document.createElement('div');
  anchor.id = 'anchor'

  self.container.append(self.first, self.current, self.last, anchor);

  self.render(options.current, self.first);
  self.render(options.current + 1, self.last);

  return self;
}
BookView.prototype.render = function render(page: number, container: HTMLDivElement) {
  this.options.render?.(page, container, this.options)
}
BookView.prototype.animate = function animate(x: number, y: number, corner: 'tl' | 'tr' | 'bl' | 'br', vertical: boolean = true) {
  const {width, height} = this.container.getBoundingClientRect();
  const diag = {
    x: {tl: width, tr: 0, bl: width, br: 0}[corner],
    y: {tl: height, tr: height, bl: 0, br: 0}[corner]
  };
  const juxt = vertical ? {
    x: {tl: 0, tr: width, bl: 0, br: width}[corner],
    y: {tl: height, tr: height, bl: 0, br: 0}[corner]
  } : {
    x: {tl: width, tr: 0, bl: width, br: 0}[corner],
    y: {tl: 0, tr: 0, bl: height, br: height}[corner]
  }
  const anchor: Point =  {
    x: {tl: 0, tr: width, bl: 0, br: width}[corner],
    y: {tl: 0, tr: 0, bl: height, br: height}[corner]
  }

  let pos = {x, y};
  // 对角线长
  const dlen = (width**2 + height**2) ** 0.5;

  // 1. 根据 x,y 的方向，计算实际 corner 折叠到的位置
  //    (x, y) 到并角的距离不大于 height
  //           到对角的距离不大于对角线长度

  pos = fixPosition(pos, juxt, vertical ? height : width);
  pos = fixPosition(pos, diag, Math.pow(height ** 2 + width ** 2, 0.5))

  // 2. 计算 current 层旋转和位移
  if (corner === 'br') {
    const dl = ((pos.x - anchor.x) ** 2 + (pos.y - anchor.y) ** 2) ** 0.5;
    const an = Math.acos(Math.abs(pos.y - anchor.y)/dl)%(Math.PI/2);
    console.log({an})

    // this.current.style.transform = `rotateZ(45deg)`
    this.current.firstChild.style.transform = `
    translate(${(pos.x/width - 0.5)*100}%, ${(pos.y/height - 0.5)*100}%) 
    rotateZ(${pos.x > width ? an/Math.PI*180 : (-an/Math.PI*180*2)}deg)
    translate(-50%, 50%) 
    `
  }
}

/**
 *
 * @param point
 * @param anchor
 * @param distance
 */
function fixPosition(pos: Point, anchor: Point, distance: number) {
  const delta = Math.pow((pos.x - anchor.x) ** 2 + (pos.y - anchor.y) ** 2, 0.5);
  if (distance < delta) {
    const x = (pos.x - anchor.x) / delta * distance + anchor.x;
    const y = (pos.y - anchor.y) / delta * distance + anchor.y;
    pos = {x, y}
  }

  const ae = document.querySelector('#anchor');
  if (ae instanceof HTMLElement) {
    ae.style.top = `${pos.y}px`;
    ae.style.left = `${pos.x}px`;
  }


  return pos;
}

export default BookView;
