const button = document.getElementById("getUser");
const userNumber = document.getElementById("userNumber");
const createButton = document.getElementById("createUser");
const newName = document.getElementById("newName");
const newUsername = document.getElementById("newUsername");
const newEmail = document.getElementById("newEmail");
button.addEventListener("click", async function () {

    const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userNumber.value}`
    );
    
    if (!response.ok) {
        document.getElementById("result").textContent =
            "❌ User not found. Choose a number between 1 and 10.";
        return;
    }
    
    const user = await response.json();
    console.log(user);
    document.getElementById("result").innerHTML = `
    <h2>User Information</h2>
    <p>Name: ${user.name}</p>
    <p>Username: ${user.username}</p>
    <p>Email: ${user.email}</p>
    <p>City: ${user.address.city}</p>
`;

});
createButton.addEventListener("click", async function () {

    const newUser = {
        name: newName.value,
        username: newUsername.value,
        email: newEmail.value
    };

    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        }
    );

    const createdUser = await response.json();

    console.log(createdUser);

    document.getElementById("createResult").innerHTML = `
        <h3>User Created!</h3>
        <p>ID: ${createdUser.id}</p>
        <p>Name: ${createdUser.name}</p>
        <p>Username: ${createdUser.username}</p>
        <p>Email: ${createdUser.email}</p>
    `;
});