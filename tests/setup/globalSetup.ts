import { db } from "../../src/db/connection.ts";
import { users,habits, habitsTags, tags, enteries } from "../../src/db/schema.ts";
import { sql } from "drizzle-orm";
import { execSync } from "child_process";

export default async function setup(){
    console.log("Setting up the testing database...");

    try {
        await db.execute(sql`DROP TABLE IF EXISTS ${enteries} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${habitsTags} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`);

        console.log("pushing schema using drizzle kit...");
        execSync(
            `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
            {
                stdio: "inherit",
                cwd: process.cwd()
            }
        )
        console.log("test database setup complete.");
    } catch (error) {
        console.error("failed to setup testing database: ", error)
        throw error
    }

    return async () => {
        console.log("Tearing down the testing database...");
        try {
            await db.execute(sql`DROP TABLE IF EXISTS ${enteries} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${habitsTags} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`);
            await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`);
            console.log("test database teardown complete.");

            process.exit(0);
        } catch (error) {
            console.error("failed to teardown testing database: ", error);
        }
    }
   
}