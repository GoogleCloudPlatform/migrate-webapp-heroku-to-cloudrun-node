consoler.log("Sample worker...");

set Interval(() => {
    console.log("worker is running a task at", new Date().toISOString());
}, 5000);