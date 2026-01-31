const form = document.getElementById("taskForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("لم يتم تسجيل المستخدم");
        return;
    }

    let title = document.getElementById("title").value.trim();
    let descreption = document.getElementById("description").value.trim();
    let status = document.getElementById("status").value;

    const data = {
        title: title,
        description: descreption,
        status: status,
        userId: userId
    };

    try {
        const response = await fetch("https://localhost:44338/api/Task/CreateNewTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("فشل إضافة المهمة");
         let result =response.json();
        alert(result.message);
        form.reset(); // إعادة ضبط النموذج
    } catch (error) {
        //console.error(error);
        alert("حدث خطأ أثناء إضافة المهمة");
    }
});
