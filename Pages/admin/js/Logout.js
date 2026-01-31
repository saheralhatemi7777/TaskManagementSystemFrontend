
 async 
 document.getElementById("logout").addEventListener("click",async function () {
    localStorage.removeItem("tokin");
     alert("ioj");
    await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    window.location.href = "../../Auth/Login/Page/Login.Html";
})
