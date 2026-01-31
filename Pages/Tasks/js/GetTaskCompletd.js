/***********************
 * متغير عام لتخزين المهام قيد التنفيذ
 ***********************/
let tasks = [];

/***********************
 * جلب المهام عند تحميل الصفحة
 ***********************/
document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(
            `https://localhost:44338/api/Task/GetTaskDataByUserId?Pk_Id=${userId}`
        );

        if (!response.ok) throw new Error("فشل جلب البيانات");

        const allTasks = await response.json();

        // 🔹 فلترة: قيد التنفيذ فقط
        tasks = allTasks.filter(t =>
            t.status && t.status.trim() === "مكتمل"
        );

        // 🔹 ترتيب تنازلي حسب تاريخ الإضافة (الأحدث أولًا)
        tasks.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

        renderTask(tasks);

    } catch (error) {
        console.error("حدث خطأ أثناء جلب المهام:", error);
    }
}

/***********************
 * عرض المهام في الجدول
 ***********************/
function renderTask(tasksToRender) {
    const tbody = document.getElementById("taskTableBody");
    tbody.innerHTML = "";

    if (tasksToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    لا توجد مهام قيد التنفيذ
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
            <td>
               

                <button class="btn btn-sm btn-danger"onclick="RemoveTask(${task.pk_Id})">حذف</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

/***********************
 * فلترة المهام (عنوان / تاريخ)
 ***********************/
function filterTasks() {
    const searchValue = document
        .getElementById("searchValue")
        .value
        .toLowerCase();

    const searchType = document.getElementById("searchType").value;

    let filteredTasks = tasks.filter(task => {

        if (!searchValue) return true;

        switch (searchType) {
            case "title":
                return task.title.toLowerCase().includes(searchValue);

            case "createAt":
                return task.createAt.startsWith(searchValue);

            default:
                return true;
        }
    });

    renderTask(filteredTasks);
}

/***********************
 * مستمعين أحداث البحث
 ***********************/
document
    .getElementById("searchValue")
    .addEventListener("input", filterTasks);

document
    .getElementById("searchType")
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

    
async function RemoveTask(TaskId) {
    if (!TaskId) return;

    const token = localStorage.getItem("tokin");

    try {
        const response = await fetch(
            `https://localhost:44338/api/Task/DeleteTask?Pk_Id=${TaskId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`فشل حذف المهمة (Status ${response.status})`);
        }

        const result = await response.json();
        alert("تم حذف المهمة بنجاح");

       await loadTasks();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}
