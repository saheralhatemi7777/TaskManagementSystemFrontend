/***********************
 * متغير عام لتخزين المهام قيد التنفيذ
 ***********************/
let tasks = [];

/***********************
 * جلب المهام عند تحميل الصفحة
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    LoadTaskDetils();
    bindSearchEvents();
    bindSaveEvent();
});

async function loadTasks() {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(
            `https://localhost:44338/api/Task/GetTaskDataByUserId?Pk_Id=${userId}`
        );

        if (!response.ok) throw new Error("فشل جلب البيانات");

        const allTasks = await response.json();

        // فلترة: قيد التنفيذ فقط
        tasks = allTasks.filter(t => t.status && t.status.trim() === "قيد التنفيذ");

        // ترتيب تنازلي حسب تاريخ الإضافة
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
    if (!tbody) return;

    tbody.innerHTML = "";

    if (tasksToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    لا توجد مهام قيد التنفيذ
                </td>
            </tr>`;
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
                <button class="btn btn-sm btn-primary me-1"
                    onclick="window.location.href='CRUD/Updateask.html?taskId=${task.pk_Id}'">
                    تعديل
                </button>

                <button class="btn btn-sm btn-success me-1"
                    onclick="EditTaskStatus(${task.pk_Id})">
                    تم التنفيذ
                </button>

                <button class="btn btn-sm btn-danger"
                    onclick="RemoveTask(${task.pk_Id})">
                    حذف
                </button>
            </td>`;

        tbody.appendChild(tr);
    });
}

/***********************
 * فلترة المهام
 ***********************/
function filterTasks() {
    const input = document.getElementById("searchValue");
    const searchTypeSelect = document.getElementById("searchType");
    if (!input || !searchTypeSelect) return;

    const searchValue = input.value.toLowerCase();
    const searchType = searchTypeSelect.value;

    const filteredTasks = tasks.filter(task => {
        if (!searchValue) return true;

        if (searchType === "title") {
            return task.title.toLowerCase().includes(searchValue);
        }

        if (searchType === "createAt") {
            return task.createAt.startsWith(searchValue);
        }

        return true;
    });

    renderTask(filteredTasks);
}

/***********************
 * مستمعي أحداث البحث
 ***********************/
function bindSearchEvents() {
    const searchInput = document.getElementById("searchValue");
    const searchType = document.getElementById("searchType");

    if (searchInput) {
        searchInput.addEventListener("input", filterTasks);
    }

    if (searchType && searchInput) {
        searchType.addEventListener("change", () => {
            searchInput.type = searchType.value === "createAt" ? "date" : "text";
            searchInput.value = "";
            renderTask(tasks);
        });
    }
}

/***********************
 * تعديل حالة المهمة
 ***********************/
async function EditTaskStatus(TaskId) {
    const token = localStorage.getItem("tokin");

    try {
        const response = await fetch(
            `https://localhost:44338/api/Task/UpdateStatusTasks?Id=${TaskId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: "مكتمل" })
            }
        );

        if (!response.ok) {
            throw new Error(`فشل تعديل حالة المهمة (${response.status})`);
        }

        const result = await response.json();
        alert(result.message || "تم تعديل حالة المهمة");

        // إزالة المهمة من القائمة لأنها لم تعد "قيد التنفيذ"
        tasks = tasks.filter(t => t.pk_Id !== TaskId);
        renderTask(tasks);

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/***********************
 * تحميل بيانات المهمة
 ***********************/
async function LoadTaskDetils() {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("taskId");
    if (!taskId) return;

    const token = localStorage.getItem("tokin");

    try {
        const response = await fetch(
            `https://localhost:44338/api/Task/GetDetilsTaskById?Pk_Id=${taskId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`فشل جلب بيانات المهمة (${response.status})`);
        }

        const data = await response.json();

        const titleInput = document.getElementById("title");
        const descInput = document.getElementById("description");

        if (titleInput) titleInput.value = data.title;
        if (descInput) descInput.value = data.description;

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

/***********************
 * ربط زر الحفظ
 ***********************/
function bindSaveEvent() {
    const saveBtn = document.getElementById("save");
    if (saveBtn) {
        saveBtn.addEventListener("click", EditTaskDetiles);
    }
}

/***********************
 * تعديل بيانات المهمة
 ***********************/
async function EditTaskDetiles()
 {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("taskId");
    if (!taskId) return;

    const token = localStorage.getItem("tokin");
    const userId = localStorage.getItem("userId");

    const title = document.getElementById("title")?.value;
    const description = document.getElementById("description")?.value;

    const data = {
        pk_Id: taskId,
        title,
        description,
        userId
    };

    try {
        const response = await fetch(
            "https://localhost:44338/api/Task/UpdateDeteilsTask",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            throw new Error("فشل تعديل المهمة");
        }

        alert("تم تعديل المهمة بنجاح");
        window.location.href = "../inProgress.html";

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

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
