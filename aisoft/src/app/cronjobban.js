const { prisma } = require("../lib/db");
const cron = require("node-cron");

// Run every hour to check overdue bills
cron.schedule("* * * * *", async () => {
    console.log("Checking overdue bills...");
    
    const overdueBills = await prisma.bill.findMany({
        where: {
            due_date: { lt: new Date() }, // Bills past the due date
            bill_status: "Unpaid",
        },
        include: { user: true }, // Include user details
    });

    for (const bill of overdueBills) {
        await prisma.user.update({
            where: { user_id: bill.userid },
            data: { user_role: "ban" }, // Ban the user
        });

        console.log(`User ${bill.userid} has been banned due to unpaid bill ${bill.bill_id}`);
    }
});