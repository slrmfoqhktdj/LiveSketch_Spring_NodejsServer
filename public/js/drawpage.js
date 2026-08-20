// const e = require("express");

// const webSocket = new WebSocket("ws://221.156.85.68:23232");
// const webSocket = new WebSocket("ws://127.0.0.1:30001");
// const webSocket = new WebSocket("ws://121.178.114.99:20005");


// const fs = require('fs');

const webSocket = new WebSocket("ws://localhost:50001");
  webSocket.onopen = function () {
    console.log('서버와 웹소켓 연결 성공!');

    const msg = {
      type: "join",
      id : 1
    };
  
    webSocket.send(JSON.stringify(msg));

  };
  webSocket.onmessage = function (event) {
    console.log("im client :"+event.data);
    // webSocket.send('클라이언트에서 서버로 답장을 보냅니다');
  };
  webSocket.onclose = function (event){
    
  }


let SelectValue = 0;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function resizeImage(base64Str, maxWidth, maxHeight){
    return new Promise((resolve) => {
      let img = new Image()
      img.src = base64Str
      img.onload = () => {
        let canvas = document.createElement('canvas')

        let width = maxWidth;
        let height = maxHeight;
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        let ctx = canvas.getContext('2d')

        ctx.fillStyle = "white";
        ctx.fillRect(0,0,width,height);

        ctx.drawImage(img, 0, 0, width, height)
        
        resolve(canvas.toDataURL())
      }
    })
}


/////////////////////////////////////////////////////////////////survey_canvas01/////////////////////////////////////////////////////////////////
    
const canvas = document.getElementById('survey_canvas01');
const ctx = canvas.getContext('2d');

let drawing = false;
let drawing_mode = true; 

let linesize = 6;
let cap = "round";
let color = "black";




// CSS에서 설정한 크기와 맞춰주기 위한 scale 조정
// ctx.scale(dpr, dpr);


if(!canvas.getContext){
    alert("캔버스 지원 안함")
}

canvas.addEventListener("mousedown",()=>{drawing = true;},false);
canvas.addEventListener("mouseup",()=>{drawing = false;},false);
canvas.addEventListener("mouseleave",()=>{drawing = false;},false);


canvas.addEventListener("pointerdown",function(e){
    console.log(e.pointerType);
            drawing = true;
            ctx.beginPath()
            ctx.lineWidth = linesize;
            ctx.lineCap = cap
            ctx.strokeStyle = color;
},false);

canvas.addEventListener("pointerup",function(e){

            drawing = false;

},false);

canvas.addEventListener("pointerleave",function(e){

            drawing = false;

},false);

canvas.addEventListener("pointermove",function(e){
    e.preventDefault();

            onMouseMove(e);

},false);



function onMouseMove(e){
    e.preventDefault();
    const x = e.offsetX;
    const y = e.offsetY;
    
    if(!drawing_mode){
        if(drawing){
            //지우개
            ctx.clearRect(x-ctx.lineWidth/2, y-ctx.lineWidth/2, 40,40);
            
        }
    }else{
        
        if(!drawing){
            ctx.beginPath();
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
            ctx.stroke();
        }
    }
    return false
}

$('.survey_canvas_option_all_cleaner').click(function(){
    // ctx.clearRect(0, 0, canvas.width,canvas.height);
    setCanvasSize();
})

$('.survey_canvas_option_dot_cleaner').click(function(){
    if(drawing_mode){
        $(this).find('b').text("펜")
        drawing_mode = false
    }else{
        $(this).find('b').text("지우개")
        drawing_mode = true
    }
})
  

/////////////////////////////////////////////////////////////////line_id/////////////////////////////////////////////////////////////////


const line_canvas = document.getElementById('line_id')
const ctx_line = line_canvas.getContext('2d');

/////////////////////////////////////////////////////////////////change_window/////////////////////////////////////////////////////////////////



window.onload = function(e){
  setCanvasSize();
}

window.onresize = function(e){
  setCanvasSize();
}

function setCanvasSize(){
  canvas.width = $('.main_box').innerWidth();
  canvas.height = $('.main_box').innerHeight();
  line_canvas.width = $('.main_box').innerWidth();
  line_canvas.height = $('.main_box').innerHeight();

  //바탕색
  // ctx.fillStyle = "white";
  // ctx.fillRect(0,0,canvas.width,canvas.height);

  let line_img = new Image()
  line_img.src = '../Img/butterfly_line.png';
  // line_img.src = '../Img/outline2.png';
  line_img.onload = function(){

    ctx_line.fillStyle = "white";
    ctx_line.fillRect(0,0,line_canvas.width,line_canvas.height);

    ctx_line.drawImage(line_img,0,0,line_canvas.width,line_canvas.height);
  }
}



/////////////////////////////////////////////////////////////////send/////////////////////////////////////////////////////////////////////////////

$(".sendC").click(function(){

  

  var dataURL1 = canvas.toDataURL('image/png',0.8);

  resizeImage(dataURL1,500,1000).then((result) =>{
    var msg = {
      type: "clinet",
      create : SelectValue,
      img : result
    };
    webSocket.send(JSON.stringify(msg));
  })


})



//////////////////////////////////////////////////////////////////////color///////////////////////////////////////////////////////////////////////////

let precolor = "";


$('.color').each(function(){
    $(this).css("background-color","#"+$(this).attr('id'))

    $(this).click(function(e){
      e.preventDefault();
      color = "#"+$(this).attr('id');
      
      if(precolor != ""){
        $('#'+precolor).css("border","2px solid #000000");
      }

      $(this).css("border","2px solid #FFE400")

      precolor = $(this).attr('id');
    })
})


//////////////////////////////////////////////////////////////////////option//////////////////////////////////////////////////////////////////////////////////

const slider = $('.pensize')
slider.change(function(){
  $('.pensize_per').text(slider.val());
  linesize = slider.val();
})