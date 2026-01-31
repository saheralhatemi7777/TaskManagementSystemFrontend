/***********************
 * متغير عام لتخزين المستخدمين
 ***********************/
let users = [];

/***********************
 * تحميل البيانات عند فتح الصفحة
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});

/***********************
 * جلب المستخدمين من API مرة واحدة
 ***********************/
function fetchUsers() {
    const token = localStorage.getItem("tokin");
    const request = new XMLHttpRequest();

    request.open("GET", "https://localhost:44338/api/User", true);
    request.responseType = "json";
    request.setRequestHeader("Authorization", `Bearer ${token}`);

    request.onload = function () {

        if (request.status === 401) {
            localStorage.removeItem("tokin");
            window.location.href = "/Login/Page/Login.html";
            return;
        }

        if (request.status !== 200) {
            console.error("فشل تحميل المستخدمين");
            return;
        }

        users = request.response;
        renderUsers(users);
    };

    request.send();
}

/***********************
 * عرض المستخدمين في الجدول
 ***********************/
function renderUsers(usersToRender) {
    const tbody = document.getElementById("showuser");
    tbody.innerHTML = "";

    if (usersToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    لا توجد نتائج مطابقة
                </td>
            </tr>
        `;
        return;
    }

    usersToRender.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.userId}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.createAt}</td>
            </tr>
        `;
    });
}

/***********************
 * فلترة المستخدمين (نفس منطق صفحة الوصفات)
 ***********************/
function filterUsers() {
    const searchValue = document.getElementById("searchValue").value.toLowerCase();
    const searchType = document.getElementById("searchType").value;

    let filteredUsers = users.filter(user => {

        if (!searchValue) return true;

        switch (searchType) {
            case "name":
                return user.name.toLowerCase().includes(searchValue);

            case "email":
                return user.email.toLowerCase().includes(searchValue);

            case "role":
                return user.role.toLowerCase().includes(searchValue);

            case "createAt":
                return user.createAt.startsWith(searchValue);

            default:
                return true;
        }
    });

    renderUsers(filteredUsers);
}

/***********************
 * مستمعين الأحداث
 ***********************/
document.getElementById("searchValue").addEventListener("input", filterUsers);

document.getElementById("searchType").addEventListener("change", () => {
        const input = document.getElementById("searchValue");

        if (searchType.value === "createAt") {
            input.type = "date";
        } else {
            input.type = "text";
        }

        input.value = "";
        renderUsers(users);
    });

/*******************
 * جلب بيانات المستخدم حسب الرقم المعرف
 *******************/

function GetUserById() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("tokin");

    if (!userId || !token) {
        // إعادة توجيه إذا لم يوجد توكن أو معرف المستخدم
        window.location.href = "/Login/Page/Login.html";
        return;
    }

    const request = new XMLHttpRequest();

    request.open("GET", `https://localhost:44338/api/User/GetUserBy_PK_Id?Id=${userId}`, true);
    request.responseType = "json";
    request.setRequestHeader("Authorization", `Bearer ${token}`);

    request.onload = function () {
        if (request.status === 401) {
            localStorage.removeItem("tokin");
            window.location.href = "/Login/Page/Login.html";
            return;
        }

        if (request.status !== 200) {
            console.error("فشل جلب بيانات المستخدم");
            return;
        }

        const data = request.response;

        document.getElementById('userName').innerHTML = data.name || '--';
        document.getElementById('userEmail').innerHTML = data.email || '--';
        document.getElementById('createdAt').innerHTML = new Date(data.createAt).toLocaleDateString('ar-EG') || '--';
    };

    request.send();
}

document.addEventListener('DOMContentLoaded', GetUserById);