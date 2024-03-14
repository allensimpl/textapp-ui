async function getChats(){
    try {
        const response = await axios.get('http://localhost:8080/api/v1/secure/message?from=1&to=4', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2cC1wcm9kLUk0RFdETC0xIiwiaXNzIjoiaHR0cHM6Ly93d3cud2lraXBlZGlhLm9yZy8ifQ.AlQG-F6QMCONEokh6m4Y4u8S1JPxkIDhi6kbTgN9vB0'
            }
        });

        // Handle the successful response here
        const messages = response.data.data;

        // Access the texts div
        const textsDiv = document.getElementById('texts');

        // Loop through the messages and append them to the texts div
        messages.forEach(message => {
            const data = fetchMessageHTML(message.message, window.localStorage.getItem("id"), message.sendTo);
            textsDiv.appendChild(data);
            // const messageElement = document.createElement('p');
            // messageElement.innerText = `Message: ${message.message}`;
            // textsDiv.appendChild(messageElement);
        });
    } catch (error) {
        // Handle errors here
        console.error('Error fetching messages:', error);
    }

}

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


getChats();

