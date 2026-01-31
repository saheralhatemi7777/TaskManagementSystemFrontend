document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loadform");
    if (!form) {
        console.error("Form not found");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value;
        let checkpassword = document.getElementById("checkpassword").value;

        if (password !== checkpassword) {
            alert("كلمة المرور غير متطابقة");
            return;
        }

        let data = {
            email: email,
            newPassword: password
        };

        try {
            const response = await fetch("https://localhost:44338/api/Auth/ChengedPassword", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            let result = null;
            if (response.headers.get("content-type")?.includes("application/json")) {
                result = await response.json();
            }

            if (response.ok && result?.success === true) {
                alert("تم تغيير كلمة المرور بنجاح");
                window.location.href = "../../Login/Page/Login.html";
            } else {
                alert(result?.message || "فشل تغيير كلمة المرور");
            }

        } catch (error) {
            alert("فشل الاتصال بالخادم");
            console.error(error);
        }
    });
});
