// document.addEventListener("DOMContentLoaded", ()=>{
//     var stompClient = null;
//     const user = {
//         id: window.localStorage.getItem("id"),
//         to: parseInt(window.location.href.split("?")[1].split("=")[1])
//     }
//     async function getChats(){
//         try {
//             if(localStorage.getItem("token") == null){
//                 window.location.href = window.location.href.split("/")[0] + "/index.html"
//                 return;
//             }
            
//             const response = await axios.get('http://localhost:8080/api/v1/secure/message/'+user.id+'/'+user.to, {
//                 headers: {
//                     'Authorization': 'Bearer '+localStorage.getItem("token")
//                 }
//             });
    
//             // Handle the successful response here
//             const messages = response.data.data;
    
//             // Access the texts div
//             const textsDiv = document.getElementById('texts');
    
//             textsDiv.innerHTML = '';
    
//             // Loop through the messages and append them to the texts div
//             messages.forEach(message => {
//                 const data = fetchMessageHTML(message.message, window.localStorage.getItem("id"), message.sendTo);
//                 textsDiv.appendChild(data);
//             });
            
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//         }
//     }
    
//     const link = "/user/"+user.id+"/queue/message";
//     const messageQueue = "/user/queue/message";
//     const subscribeQueue = "/queue/message"
//     const sendLink = "/app/message";
//     function fetchMessageHTML(messageText,from, to){
//         const messageContainer = document.createElement("div");
//         const message = document.createElement("p");
//         message.innerText = messageText;
//         if(from==to){
//             message.setAttribute("class", "red");
//         }
//         messageContainer.appendChild(message);
//         return messageContainer;
//     }
    
//     const connect = ()=>{
//         var url = "ws://localhost:8080/textr-socket";
//         console.log("Connecting and creating client");
//         const client =  Stomp.client(url);

//         client.onerror = (error) => {
//             console.error('WebSocket connection error:', error);
//         };
//         console.log("Client created!", client);
        
//         client.connect({},function (){
//             console.log("This stuff is connected! Let's move to the next part!");

//             console.log("client",client);
//             console.log("link", link)

//             client.subscribe(
//                 // "/user/"+user.id+"/queue/test"
//                 link
//                 , function (notification){
//                 console.log("SUPER SUBSCRIPTION!", notification)
//                 console.log("Subscribed")
//                 const receivedNotification = JSON.parse(notification.body);
//                 console.log("received out",receivedNotification);
//                 if(receivedNotification.receiverId == user.id){
//                     console.log("received in",receivedNotification);
//                     getChats();
//                 }
//             });
//             // const sendButton = document.getElementById("submit-button");
//             // sendButton.addEventListener("click",()=>{
//             //     console.log("Clicked!");
//             //     const messageField = document.getElementById("submit-text");
//             //     const data = messageField.value;
//             //     const messageData = {
//             //         from:user.id,
//             //         sendTo:user.to,
//             //         message: data
//             //     }
//             //     client.send(sendLink, {}, JSON.stringify(messageData));
//             //     getChats();
//             // });
//             console.log("This subscription part is hopefully done!")
//         })
//         // const sendButton = document.getElementById("submit-button");
//         // sendButton.addEventListener("click",()=>{
//         //     console.log("Clicked!");
//         //     const messageField = document.getElementById("submit-text");
//         //     const data = messageField.value;
//         //     const messageData = {
//         //         from:user.id,
//         //         sendTo:user.to,
//         //         message: data
//         //     }
//         //     client.send(sendLink, {}, JSON.stringify(messageData));
//         //     getChats();
//         // });

//         stompClient = client;
//     }
    
//     getChats();
//     connect();
//     document.getElementById("submit-button").addEventListener("click",function (){
//         console.log("Clicked!");
//         const data = document.getElementById("submit-text").value;
//         const messageData = {
//             from:user.id,
//             sendTo:user.to,
//             message: data
//         }
//         stompClient.send(sendLink, {}, JSON.stringify(messageData));
//         getChats();
//     });

//     if(stompClient.connected == true){
//         console.log("CONNECTION SET UP SUCCESFULLY");
//     }
// });



// NEW STUFF
document.addEventListener("DOMContentLoaded", ()=>{
    console.log("HOWDY!");
    var client = null;
    const user = {
        id: window.localStorage.getItem("id"),
        to: parseInt(window.location.href.split("?")[1].split("=")[1])
    }

    // const link = "/user/"+user.id+"/queue/message";
    // const link = `/queue/conversation/${user.id}/${user.to}`;
    const link = `/queue/conversation/${user.to}/${user.id}`;

    const generalLink = "/queue/message";
    const messageQueue = "/user/queue/message";
    const subscribeQueue = "/queue/message"
    const sendLink = "/app/message";
    var url = "ws://localhost:8080/textr-socket";

    async function getChats(){
        try {
            if(localStorage.getItem("token") == null){
                window.location.href = window.location.href.split("/")[0] + "/index.html"
                return;
            }
            const response = await axios.get('http://localhost:8080/api/v1/secure/message/'+user.id+'/'+user.to, {
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem("token")
                }
            });
            console.log("Puthiya messageeee!!!");
            // Handle the successful response here
            const messages = response.data.data;
            // Access the texts div
            const textsDiv = document.getElementById('texts');
            textsDiv.innerHTML = '';
            // Loop through the messages and append them to the texts div
            messages.forEach(message => {
                const data = fetchMessageHTML(message.message, window.localStorage.getItem("id"), message.sendTo);
                textsDiv.appendChild(data);
            });           
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
    function onMessage(notification) {
        console.log("Inside subscription");
        console.log("SUPER SUBSCRIPTION!", notification);
        console.log("Subscribed");
        const receivedNotification = JSON.parse(notification.body);
        console.log("received out", receivedNotification);
        if (receivedNotification.receiverId === parseInt(user.id)) {
            console.log("received in", receivedNotification);
            const timeout = setTimeout(() => {
                console.log("getChats took too long, aborting");
            }, 100000); // 5 seconds timeout
    
            getChats().finally(() => clearTimeout(timeout));
        }
    }
    function onerror(error){
        console.log("The error is ", error);
    }
    function onConnected(){
        console.log("connected now subscribing");
        const subs = client.subscribe(
            link,
            onMessage,
            // onerror,
            {id:"sub-"+user.id}
        );
        console.log("SUBSCRIBING STUFFF", subs);
        // subscribe();
    }

    getChats();
    client =  Stomp.client(url);
    client.heartbeat.outgoing = 100; // client will send heartbeats every 20000ms
    client.heartbeat.incoming = 100;
    client.reconnect_delay = 100;
    client.connect({}, onConnected);

    // connect();
    // client =  Stomp.client(url);
    console.log("connection checker initial ", client)
    // client.connect({}, onConnected);

    document.getElementById("submit-button").addEventListener("click",function (){
        console.log("Clicked!");
        const data = document.getElementById("submit-text").value;
        const messageData = {
            from:user.id,
            sendTo:user.to,
            message: data
        }
        console.log("We are sending", data);
        client.send(sendLink, {}, JSON.stringify(messageData));
        console.log("Done Sending", messageData.data, JSON.stringify(messageData))
        getChats();
    });
    
    function fetchMessageHTML(messageText,from, to){
        const messageContainer = document.createElement("div");
        const message = document.createElement("p");
        message.innerText = messageText;
        if(from==to){
            message.setAttribute("class", "red");
        }
        messageContainer.appendChild(message);
        return messageContainer;
    }

});