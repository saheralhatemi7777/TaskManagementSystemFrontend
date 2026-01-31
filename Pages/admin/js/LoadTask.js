async function LoadTaskSummary() {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
       
        const response = await fetch(
            `https://localhost:44338/api/Task/GetTaskDataByUserId?Pk_Id=${userId}`
        );

        if (!response.ok) throw new Error("فشل جلب البيانات");

        const tasks = await response.json();

        // الفلترة الصحيحة حسب الخاصية الصحيحة "status"
        const completedCount = tasks.filter(t => t.status?.trim() === "مكتمل").length;
        const inProgressCount = tasks.filter(t => t.status?.trim() === "قيد التنفيذ").length;

        document.getElementById("taskstotal").textContent = tasks.length;
        document.getElementById("completedCount").textContent = completedCount;
        document.getElementById("inProgressCount").textContent = inProgressCount;

    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", LoadTaskSummary);

