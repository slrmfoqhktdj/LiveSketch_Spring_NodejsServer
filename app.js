const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'))

app.use(
    '/build/',
    express.static(path.join(
      __dirname,
      'node_modules/three/build'
    ))
  )
  app.use(
    '/jsm/',
    express.static(path.join(
      __dirname,
      'node_modules/three/examples/jsm'
    ))
  )

// 2. "/" 경로 라우팅 처리
// app.use("/draw", (req, res)=>{
//     res.sendFile(__dirname+'/public/drawpage.html'); 
// })


app.use("/", (req, res)=>{
    // res.sendFile(__dirname+'public/index.html'); // index.html 파일 응답
    res.sendFile(__dirname+'/public/html/drawpage.html'); 
})

// 3. 30001 port에서 서버 구동
const HTTPServer = app.listen(50001, ()=>{
    console.log("Server is open at port:50001");
});

const wsModule = require('ws');

// 2. WebSocket 서버 생성/구동
const wss1 = new wsModule.Server( 
    {
        server: HTTPServer, // WebSocket서버에 연결할 HTTP서버를 지정한다.
        // port: 30002 // WebSocket연결에 사용할 port를 지정한다(생략시, http서버와 동일한 port 공유 사용)
    }
);

let moniterlist = new Set([]);
let clientlist = new Set([]);

wss1.on('connection', (ws, request)=>{

    // 1) 연결 클라이언트 IP 취득
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    
    console.log(`새로운 클라이언트[${ip}] 접속`);

    
    // 2) 클라이언트에게 메시지 전송
    // if(ws.readyState === ws.OPEN){ // 연결 여부 체크
    //     ws.send(`클라이언트[${ip}] 접속을 환영합니다 from 서버`); // 데이터 전송
    // }
    
    // 3) 클라이언트로부터 메시지 수신 이벤트 처리
    ws.on('message', (msg)=>{
        // ws.send('메시지 잘 받았습니다! from 서버')
        // console.log(`메세지 :[${msg}] `);
        
        try{
            const content = JSON.parse(msg);
            console.log(`메세지 :[${content.type}] `);
            
            switch(content.type){
                case "join":
                    if(content.id == 0){
                        moniterlist.add(ws)
                    }else{
                        clientlist.add(ws)
                    }
    
                    moniterlist.forEach((client, clientAgain, moniterlist)=> {
                        console.log("monitor : "+client)
                    });
                    clientlist.forEach((client, clientAgain, moniterlist)=> {
                        console.log("client : "+client)
                    });
    
    
    
                    break
                case "clinet":
                    moniterlist.forEach((client, clientAgain, moniterlist)=> {
                        if (client !== ws) {
                            // console.log(content)
                            var msg = {
                                create : content.create,
                                img : content.img
                            };
                            // client.send(msg);
                            client.send(JSON.stringify(msg));
                        }
                    });
                    
                    break
                case "monitor":
                    break
    
                default:
                    console.log("msg err")
                    break
                
            }
        }catch(err){
            console.log(err)
            console.log(JSON.parse(msg))
        }

       
        // //수신자를 제외한 모두에게 브로드 캐스트
        // wss1.clients.forEach(function each(client) {
        //     if (client !== ws && client.readyState === WebSocket.OPEN) {
        //       client.send(msg);
        //     }
        // });
        
        
    })
    
    // 4) 에러 처러
    ws.on('error', (error)=>{
        console.log(`클라이언트[${ip}] 연결 에러발생 : ${error}`);
    })
    
    // 5) 연결 종료 이벤트 처리
    ws.on('close', ()=>{
        console.log(`클라이언트[${ip}] 웹소켓 연결 종료`);

        moniterlist.delete(ws)
        clientlist.delete(ws)

        moniterlist.forEach((client, clientAgain, moniterlist)=> {
            console.log("monitor : "+client)
        });
        clientlist.forEach((client, clientAgain, moniterlist)=> {
            console.log("client : "+client)
        });
    })
});


