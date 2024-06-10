document.addEventListener('DOMContentLoaded', ()=>{
    const user = {
        id: window.localStorage.getItem("id"),
    }

    async function getFriends(){
        const home = document.getElementById('users');
        // home.innerHTML = '';
        try{
            if(localStorage.getItem("token") == null){
                window.location.href = window.location.href.split("/")[0] + "/index.html"
                return;
            }
            const response = await axios.get('http://localhost:8080/api/v1/secure/message/'+user.id, {
                headers: {
                    'Authorization': 'Bearer '+localStorage.getItem("token")
                }
            });
    
            const output = response.data.data;
            output.forEach(element => {
              const html = getHTML(element.id, element.name);
              home.appendChild(html);  
            });
            
        }catch(error){
            console.error('Error fetching chats:', error);
        }
    }
    
    const getHTML=(id, name)=>{
        const messageContainer = document.createElement("div");
        const message = document.createElement("a");
        message.innerText = name;
        message.href = "http://127.0.0.1:5500/chat.html?to="+id;
        messageContainer.appendChild(message);
        return messageContainer;
    }
    getFriends();
});

