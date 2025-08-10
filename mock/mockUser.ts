import mockjs from "mockjs";
import { faker } from "@faker-js/faker";
import { ROLE_LIST } from "./mockRole";
const random = mockjs.Random;

const generateMockUser = () => {
    return {
        id: random.guid(),
        role: ROLE_LIST[random.integer(1,2)],
        roleId: random.integer(1,2),
        name: random.cname(),
        email: random.email(),
        avatar: faker.image.avatarGitHub()
    }
}

type UserItem = {
    id: string,
    avatar: string,
    name: string,
    email: string
}



const users: UserItem[] = [];
for (let i = 0; i < 1000; i++) {
    users.push(generateMockUser());
}

const mockUsers = {
    users,
    addUser: (user: UserItem) => {
        const newUser = { ...user, id: random.guid() };
        users.push(newUser);
        return newUser;
    },
    updateUser: (id: string, userData: Partial<UserItem>) => {
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            const filteredUserData = Object.fromEntries(
                Object.entries(userData).filter(([key, value]) => 
                    value !== undefined && value !== '' && key !== 'id'
                )
            );
            users[index] = { ...users[index], ...filteredUserData };
            return users[index];
        }
        return null;
    },
    deleteUser: (ids: string | string[]) => {
        const deletedUsers: UserItem[] = []        
        const idArray = Array.isArray(ids) ? ids : [ids];
        const indicesToDelete = idArray
            .map(id => users.findIndex(user => user.id === id))
            .filter(index => index !== -1)
            .sort((a, b) => b - a);

        indicesToDelete.forEach(index => {
            const deletedUser = users[index];
            users.splice(index, 1);
            deletedUsers.push(deletedUser);
        });

        return deletedUsers;
    },
    getUserById: (id: string) => {
        return users.find(user => user.id === id) || null;
    }
}

export {
    mockUsers
}
