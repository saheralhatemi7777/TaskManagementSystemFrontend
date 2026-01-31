document.getElementById("formload").addEventListener("submit",async function (e) {
e.preventDefault();
CreateNewAccount();
});
    
async function CreateNewAccount() {
alert("plp[l");
    let Name = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let checkpassword = document.getElementById("checkpassword");

    // مسح الأخطاء القديمة
    document.getElementById("username-error").innerHTML = "";
    document.getElementById("email-error").innerHTML = "";
    document.getElementById("password-error").innerHTML = "";
    document.getElementById("checkpassword-error").innerHTML = "";

    if (password.value !== checkpassword.value) {
        document.getElementById("checkpassword-error").innerHTML = "كلمة المرور غير متطابقة";
        return;
    }

    let data = {
        name: Name.value,
        email: email.value,
        passwordHash: password.value
    };

    try {
       const request = await fetch("https://localhost:44338/api/Auth/CreateAcount", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
       },
       body: JSON.stringify(data)
});

let result = null;
if (request.headers.get("content-type")?.includes("application/json")) {
    result = await request.json();
}

if (request.ok && result?.success) {
    alert("تم إنشاء الحساب بنجاح");
} else {
    // رسالة عامة
    document.getElementById("username-error").innerHTML = result?.message || "";

    // تفريغ الأخطاء السابقة
    document.getElementById("email-error").innerHTML = "";
    document.getElementById("password-error").innerHTML = "";

    // عرض الأخطاء القادمة من الـ API
    if (Array.isArray(result?.errors)) {
        result.errors.forEach(err => {
            if (err.includes("إيميل")) {
                document.getElementById("email-error").innerHTML += err + "<br>";
            } else if (err.includes("كلمة المرور")) {
                document.getElementById("password-error").innerHTML += err + "<br>";
            }
        });
    }
}

    } catch (error) {
       // console.error(error);
        alert(error);
    }
}