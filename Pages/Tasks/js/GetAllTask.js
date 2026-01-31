/***********************
 * متغير عام لتخزين المهام
 ***********************/
let tasks = [];

/***********************
 * تحميل المهام عند فتح الصفحة
 ***********************/
document.addEventListener("DOMContentLoaded", loadTasks);

/***********************
 * جلب المهام من API
 ***********************/
async function loadTasks() {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(
            `https://localhost:44338/api/Task/GetTaskDataByUserId?Pk_Id=${userId}`
        );

        if (!response.ok) throw new Error("فشل جلب البيانات");

        tasks = await response.json();

        // 🔹 ترتيب تنازلي حسب تاريخ الإنشاء (الأحدث أولًا)
        tasks.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

        renderTask(tasks);

    } catch (error) {
        console.error(error);
    }
}

/***********************
 * عرض المهام
 ***********************/
function renderTask(tasksToRender) {
    const tbody = document.getElementById("taskTableBody");
    tbody.innerHTML = "";

    if (tasksToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    لا توجد نتائج مطابقة
                </td>
            </tr>
        `;
        return;
    }

    tasksToRender.forEach((task, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${task.title}</td>
    <td>${task.description}</td>
    <td>${task.status}</td>
    <td>${new Date(task.createAt).toLocaleString()}</td>
    <td>${new Date(task.updatedAt).toLocaleString()}</td>
`;


        tbody.appendChild(tr);
    });
}

/***********************
 * فلترة المهام (Frontend)
 ***********************/
function filterTasks() {
    const searchValue = document.getElementById("searchValue").value.toLowerCase();
    const searchType = document.getElementById("searchType").value;

    let filteredTasks = tasks.filter(task => {

        if (!searchValue) return true;

        switch (searchType) {
            case "title":
                return task.title.toLowerCase().includes(searchValue);

            case "status":
                return task.status.toLowerCase().includes(searchValue);

            case "createAt":
                return task.createAt.startsWith(searchValue);

            default:
                return true;
        }
    });

    renderTask(filteredTasks);
}

/***********************
 * مستمعين الأحداث
 ***********************/
document.getElementById("searchValue")
    .addEventListener("input", filterTasks);

document.getElementById("searchType")
    .addEventListener("change", () => {

        const input = document.getElementById("searchValue");

        if (searchType.value === "createAt") {
            input.type = "date";
        } else {
            input.type = "text";
        }

        input.value = "";
        renderTask(tasks);
    });


     function getTaskById(taskId)
     {
    let request = new XMLHttpRequest();

    request.open(
        "GET",
        `https://localhost:44338/api/Task/GetDetilsTaskById?Pk_Id=${taskId}`
    );

    request.responseType = "json";
    request.send();

    request.onload = function () {
        let data = request.response;

        document.getElementById("title").value = data.title;
        document.getElementById("description").value = data.description;
    };
}
