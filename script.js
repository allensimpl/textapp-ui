
async function fetchData() {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/secure/message?from=1&to=4', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2cC1wcm9kLVVMVjhQVi0xIiwiaXNzIjoiaHR0cHM6Ly93d3cud2lraXBlZGlhLm9yZy8ifQ.GRKkQQwxUDqfL-uuFqtjbOm58g-9aA0El9XKev1-lWo'
            }
        });

        // Handle the successful response here
        const messages = response.data.data;

        // Access the texts div
        const textsDiv = document.getElementById('texts');

        // Loop through the messages and append them to the texts div
        messages.forEach(message => {
            const messageElement = document.createElement('p');
            messageElement.innerText = `Message: ${message.message}`;
            textsDiv.appendChild(messageElement);
        });
    } catch (error) {
        // Handle errors here
        console.error('Error fetching messages:', error);
    }
}

// Call the async function
// fetchData();


async function login(){
    try {
        const response = await axios.post('http://localhost:8080/api/v1/login', {
            'email': document.getElementById("email").value,
            'password': document.getElementById("password").value
        });

        if (response.data.status === false) {
            alert("Wrong Credentials!");
        }
        window.localStorage.setItem("id",response.data.data.id);
        window.localStorage.setItem("email",response.data.data.email);
        window.localStorage.setItem("name",response.data.data.name);
        window.localStorage.setItem("token",response.data.data.token);
        window.location.href = window.location.href.split("/")[0] + "/chat.html"
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        // Handle errors here if needed
        return null;
    }
} 