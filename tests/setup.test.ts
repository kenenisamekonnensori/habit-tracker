import {
    createTestUsers,
    createTestHabit,
    cleanUpDatabase
} from './helper/dbHelpers.ts';

describe('Test Setup', () => {
    test('should connect to test db', async () => {
        const { user, token } = await createTestUsers();

        expect(user).toBeDefined();
        await cleanUpDatabase();
    })
})