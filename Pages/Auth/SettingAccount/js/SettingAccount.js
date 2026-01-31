
document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("tokin");

    if (!userId || !token) {
        window.location.href = "/Login/Page/Login.html";
        return;
    }

    try {
        const response = await fetch(
            `https://localhost:44338/api/User/GetUserBy_PK_Id?Id=${userId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            localStorage.removeItem("tokin");
            window.location.href = "/Login/Page/Login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("فشل تحميل البيانات");
        }

        const data = await response.json();

            document.getElementById("userName").textContent = data.name;
            document.getElementById("email").textContent = data.email;
            document.getElementById("role").textContent = data.role ?? "--";
            document.getElementById("createAt").textContent =
            new Date(data.createAt).toLocaleDateString("ar-EG");

    } catch (err) {
        console.error(err);
    }
}

document.getElementById("editProfileBtn").addEventListener("click", () => {
    window.location.href = "../Pages/EditProfile.html";
});
document.addEventListener("DOMContentLoaded", loadUserForEdit);


