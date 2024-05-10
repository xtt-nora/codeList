class DialogTrans extends HTMLElement {
    // 静态属性
 static get observedAttributes(){
        return ["color","size","title"];
     }
    constructor() {
        super(); 
        // 构造函数中设置初始状态和默认值，注册事件监听器，甚至创建一个影子根（shadow root）不能检查元素的属性或子元素，也不应添加新的属性或子元素；
     //创建shadow根
     const shadow = this.attachShadow({mode:'open'})

     const dialog = document.createElement("div")
     dialog.setAttribute("class","dialog")

     const header = document.createElement("div")
     header.setAttribute("class","dialog-header")
     const title = document.createElement("div")
     title.setAttribute("class","header-title")

     const content = document.createElement("div")
     content.setAttribute("class","dialog-content")

     const footer = document.createElement("div")
     footer.setAttribute("class","dialog-footer")

     const style = document.createElement("style")

    // 添加边框，四角
    const r = document.createElement("span")
    r.setAttribute("class","r")
    const l = document.createElement("span")
    l.setAttribute("class","l")
    const t = document.createElement("span")
    t.setAttribute("class","t")
    const b = document.createElement("span")    
    b.setAttribute("class","b")
    const br = document.createElement("span")
    br.setAttribute("class","br")
    const bl = document.createElement("span")
    bl.setAttribute("class","bl")
    const tr = document.createElement("span")
    tr.setAttribute("class","tr")
    const tl = document.createElement("span")
    tl.setAttribute("class","tl")
     shadow.appendChild(style);
     shadow.appendChild(dialog);

     dialog.appendChild(header)
     header.appendChild(title)

     dialog.appendChild(content)

     dialog.appendChild(footer)

    // 弹窗添加边界
     dialog.appendChild(r)
     dialog.appendChild(l)
     dialog.appendChild(t)
     dialog.appendChild(b)
     dialog.appendChild(br)
     dialog.appendChild(bl)
     dialog.appendChild(tr)
     dialog.appendChild(tr)
    }
    connectedCallback() {
        console.log("联机");
        let sh;
        updateStyle(this)
      }
    disconnectedCallback() {
        console.log("自定义元素从页面中移除。");
      }
    adoptedCallback() {
        console.log("自定义元素移动至新页面。");
      }
    attributeChangedCallback(name, oldValue, newValue) {
        updateStyle(this);
        // 对弹窗进行拖拽
        dragMove(sh.querySelector(".dialog"))
        
        //边界，圆角改变宽高
        var dialog = sh.querySelector(".dialog")
        var aSpan = dialog.getElementsByTagName('span');
        console.log(aSpan,'aSpan')
        // 遍历为每一个span添加上drage事件
        for (var i = 0; i < aSpan.length; i++) {
            dragBroder(aSpan[i]);
        }

    }
}

customElements.define("dialog-trans", DialogTrans);

function updateStyle(elem) {
    const shadow = elem.shadowRoot;
    sh = shadow
    shadow.querySelector("style").textContent = `
      .dialog {
        width: ${elem.getAttribute("size")}px;
        height: ${elem.getAttribute("size")}px;
        background-color: ${elem.getAttribute("color")};
        display: flex;
        flex-direction: column;
        position: absolute;
        border-radius: 10px;
      }
    .dialog-header {
        width: 100%;
        height: ${elem.getAttribute("size") / 10 }px;
        background-color: yellow;
        border-radius: 10px 10px 0 0;
    }
    .dialog-content {
        flex:1;
        background-color: #fff;
    }
    .dialog-footer {
        width: 100%;
        height: ${elem.getAttribute("size") / 10 }px;
        background-color: ${elem.getAttribute("color")};
        border-radius: 0 0 10px 10px ;
    }

    .dialog .t,
    .dialog .b,
    .dialog .l,
    .dialog .r {
        position: absolute;
        z-index: 1;
        background:#666;
    }
    .dialog .l,
    .dialog .r {
        width: 1px;
        height: 100%;
        cursor: col-resize;
    }

    .dialog .t,
    .dialog .b {
        width: 100%;
        height: 1px;
        cursor: row-resize;
    }

    .dialog .t {
        top: 0;
    }

    .dialog .b {
        bottom: 0;
    }

    .dialog .l {
        left: 0;
    }

    .dialog .r {
        right: 0;
    }
    .dialog .tl,
    .dialog .bl,
    .dialog .br,
    .dialog .tr {
        width: 20px;
        height: 20px;
        position: absolute;
        background: #CCC;
        z-index: 2;
        cursor: nwse-resize
    }

    .dialog .tl,
    .dialog .bl {
        left: -5px;
    }

    .dialog .tr,
    .dialog .br {
        right: -5px;
    }

    .dialog .br,
    .dialog .bl {
        bottom: -5px;
    }

    .dialog .tl,
    .dialog .tr {
        top: -5px;
    }

    .dialog .tr,
    .dialog .bl {
        cursor: nesw-resize;
    }

    `;
    
    // 添加窗口title
    const text = elem.getAttribute("title")
    shadow.querySelector(".header-title").textContent = text;

}
const adddialog = document.querySelector(".adddialog");
// 定义空间
let square;

adddialog.onclick = function () {
    square = document.createElement("dialog-trans");
    square.setAttribute("size","500")
    square.setAttribute("color","red")
    square.setAttribute("title","新建窗口")
    document.body.appendChild(square);
}

let flag = false; // 默认元素不可以拖拽
let startX = 0;
let startY = 0;

function dragMove (obj) {
 obj.onmousedown = function (e) {
    var oevent = e;
      // 阻止默认事件
      oevent.preventDefault();
      // 阻止事件冒泡
      oevent.stopPropagation();
        flag = true
        startX = oevent.offsetX;
        startY = oevent.offsetY;
  };
  obj.onmouseup = function () {
    // 开关关闭
    flag = false;
  };
  obj.onmousemove = function (e) {
    var oevent = e;
    // 如果开关关闭 不能拖拽
    if (!flag) {
        // 如果代码进入这里，表示开关关闭，也就是鼠标抬起，不能拖拽
        return;
    }
    // 表示可以拖拽
    console.log("可以拖拽");
    // 设置 div 的top left
    // 获取 移动的时候 光标距离窗口左上角的位置  -  初始的时候 光标距离元素左上角的位置
    var x = oevent.clientX - startX;
    var y = oevent.clientY - startY;
    console.log(x,y)
    sh.querySelector(".dialog").style.top = y + "px";
    sh.querySelector(".dialog").style.left = x + "px";
    // boundary()
  };
}

// 拖拽边框事件
function dragBroder (obj) {
    obj.onmousedown = function(e) {
        var oEv = e 
        oEv.stopPropagation();
        var dialog = sh.querySelector(".dialog")
        // 获取没有移动前的div大小(也就是弹窗的大小)
        var oldWidth = dialog.offsetWidth
        var oldHeight = dialog.offsetHeight
        var oldX = oEv.clientX;
        var oldY = oEv.clientY;
        var oldLeft = dialog.offsetLeft;
        var oldTop = dialog.offsetTop;

        document.onmousemove = function (ev) {
            var oEv = ev     
            // const map = {
            //     l: l,
            //     r: r,
            //     t: t,
            //     b: b,
            //     br: br,
            //     bl: bl,
            //     tr: tr,
            //     tl: tl
            // }
            // 需做优化
            var oDiv = sh.querySelector(".dialog")  
              // t top  l  left  r right  b bottom， 依次 tl 上左角
            //   var map = new Map()
            //   map.set('l','l')
            //   map.set('r','r')
            //   map.set('b','b')
            //   map.set('t','t')

            //   console.log(map)
              if (obj.className == 'tl') { //                 代表的横向移动的距离，右为正，左为负
                // 计算移动后盒子的宽 = 移动前盒子的宽度 - （移动后的横向坐标-移动前的横向坐标）
                oDiv.style.width = oldWidth - (oEv.clientX - oldX) + 'px';
                // 高度同理
                oDiv.style.height=oldHeight-(oEv.clientY-oldY)+'px';
                // 同理计算修改盒子的定位，这里很多人就不理解了，我明明动的角，为嘛不是修改span
                // 我给你捋一捋，首先角和边是相对于父元素定位的，父元素也是一个绝对定位，这个时候
                //我动态修改父元素的定位，父元素的位置就好跟着改变，那么子元素是相对父元素定位的，
                // 那么在父元素最左边，不还是在最左边，这样就简单的实现了让所有定位元素跟着动
                oDiv.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
                oDiv.style.top = oldTop + (oEv.clientY - oldY) + 'px';
       }
              else if (obj.className == 'bl') {
                oDiv.style.width = oldWidth - (oEv.clientX - oldX) + 'px';
                oDiv.style.height=oldHeight+(oEv.clientY-oldY)+'px';
                oDiv.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
                oDiv.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
       }
              else if (obj.className == 'tr') {
                oDiv.style.width = oldWidth + (oEv.clientX - oldX) + 'px';
                oDiv.style.height = oldHeight - (oEv.clientY - oldY)+'px';
                oDiv.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
                oDiv.style.top = oldTop + (oEv.clientY - oldY) + 'px';
       }
               else if (obj.className == 'br') {
                oDiv.style.width = oldWidth + (oEv.clientX - oldX) + 'px';
                oDiv.style.height = oldHeight + (oEv.clientY - oldY)+'px';
                oDiv.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
                oDiv.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
       }
              else if (obj.className == 't') {
                oDiv.style.height=oldHeight-(oEv.clientY-oldY)+'px';
                oDiv.style.top = oldTop + (oEv.clientY - oldY) + 'px';
       }
              else if (obj.className == 'b') {
                oDiv.style.height = oldHeight + (oEv.clientY - oldY)+'px';
                oDiv.style.bottom = oldTop - (oEv.clientY + oldY) + 'px';
       }
             else if (obj.className == 'l') {
                oDiv.style.height = oldHeight + 'px';
                oDiv.style.width = oldWidth - (oEv.clientX - oldX) + 'px';
                oDiv.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
       }
             else if (obj.className == 'r') {
                oDiv.style.height = oldHeight + 'px';
                oDiv.style.width = oldWidth + (oEv.clientX - oldX) + 'px';
                oDiv.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
       }

      //  boundary()
        }
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            };
 // 阻止默认事件
 return false;
    }
}

//边界判断
function boundary () {
    let dialog = sh.querySelector(".dialog")
    // 弹窗
    let dialogWidth =dialog.offsetWidth
    let dialogHeight = dialog.offsetHeight
    let dialogLeft = dialog.offsetLeft
    let dialogTop= dialog.offsetTop;
    // 视窗口
    let domWidth = document.body.clientWidth
    let domHeight = document.body.clientHeight
       // 左边界
       if(dialogLeft<=0){
        dialog.style.left = 0+'px'
     }
     // 右边界 多减5个像素减去的是防止滚动条会造成抖动
      if((dialogLeft+dialogWidth)>=(domWidth-5)){
        dialog.style.left = domWidth - dialogWidth-5+ 'px'
     }
     //上边界
      if(dialogTop<=0){
        dialog.style.top = 0+'px'
     }
     // 下边界 多减5个像素减去的是防止滚动条会造成抖动
     if(dialogTop+dialogHeight>=domHeight-5){
        dialog.style.top = domHeight - dialogHeight-5 + 'px'
     }
}
