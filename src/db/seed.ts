import { db } from './connection.ts';
import { users, habits, tags, habitsTags, enteries } from './schema.ts';

const seed = async () => {
    console.log("Starting Database seed...");

    try {
        console.log("Deleting existing data...");
        await db.delete(users);
        await db.delete(habits);
        await db.delete(tags);
        await db.delete(habitsTags);
        await db.delete(enteries);

        console.log("Insering Demo users...");
        const [ demoUser ] = await db.insert(users).values({
            email: "kenenisamekonnensori@gmail.com",
            firstName: "Kenenisa",
            lastName: "Mekonnen",
            username: "kenenisa",
            password: "hashedpassword123",
        }).returning();

        console.log("Creating demo Tags...");
        const [health] = await db.insert(tags).values({
            name: "health",
            color: "#10b981",
        }).returning();

        const [ exerciseHabits ] = await db.insert(habits).values({
            userId: demoUser.id,
            name: "exericise",
            frequency: "Daily workout",
            description: "30 minutes of exercise",
            targetCount: 1,

        }).returning();

        await db.insert(habitsTags).values({
            habitId: exerciseHabits.id,
            tagId: health.id,
        })

        console.log("Adding demo Entries...");

        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        for (let i=0; i<7; i++){
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            await db.insert(enteries).values({
                habitId: exerciseHabits.id,
                completionDate: date,
                note: `Completed exercise on ${date.toDateString()}`,
            })
        }

        console.log("Database seeding completed.");
        console.log("USER CREDETIALS: ");
        console.log(`email: ${demoUser.email}`);
        console.log(`username: ${demoUser.username}`);
    } catch (error){
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

if (import.meta.url === `file://${process.argv[1]}`){
    seed()
        .then(() => process.exit(0))
        .catch((e) => process.exit(1));
}

export default seed;