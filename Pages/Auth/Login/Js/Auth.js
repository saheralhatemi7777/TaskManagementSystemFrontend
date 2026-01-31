async function LoginUsers(event) {
    event.preventDefault();

    let Email = document.getElementById("Email").value.trim();
    let Password = document.getElementById("Password").value.trim();

    if (Email === "" || Password === "") {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    let request = new XMLHttpRequest();
    request.open("POST", "https://localhost:44338/api/Auth", true);
    request.responseType = "json";
    request.setRequestHeader("Content-Type", "application/json");

    let objectlogin = {
        email: Email,
        password: Password
    };

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            let data = request.response;

            SaveToken(data);

            if (data.role === "Admin") {
                window.location.href = "../../../admin/page/DashpordAdmin.html";
            } else {
                window.location.href = "../../../Users/Pages/dashbordUser.html";
            }
        } else {
            let error = request.response;
            alert(error?.message || "فشل تسجيل الدخول");
        }
    };

    request.onerror = function () {
        alert("فشل الاتصال بالخادم");
    };

    request.send(JSON.stringify(objectlogin));
}

 
//#saveToken
function SaveToken(data)
{
    if(!CheckToken(data.tokin))
    {
        alert("بيانات Token خاطئه");
        return;
    }

    if(data === null) throw new  console.log("لا يوجد بيانات");

    localStorage.setItem("userId"  , data.userId);
    localStorage.setItem("tokin"   , data.tokin);
    localStorage.setItem("userName", JSON.stringify(data.userName)); 
    localStorage.setItem("role"    , JSON.stringify(data.role));           
  
}

function CheckToken(Token)
{
   if(Token.value === null || Token === "")
   {
      return false;
   }
    return true;
}

document.getElementById("loginForm").addEventListener("submit", LoginUsers);

function Logout()
{
    localStorage.removeItem("userId");
    localStorage.removeItem("tokin");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    window.location.href = "../../../index.html";

}


//
function checkAccess(url) {


       let Token =localStorage.getItem("tokin");
      if (!Token) {
        window.location.href = url;
        return;
      }
}