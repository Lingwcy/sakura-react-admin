import type { MockMethod } from 'vite-plugin-mock'
import { faker } from "@faker-js/faker";
import { mockUsers } from './mockUser';
import type { Recordable } from 'vite-plugin-mock';

interface Option {
    url: Recordable;
    body: Recordable;
    query: Recordable;
    headers: Recordable;
}
export default [
    {
        url: '/api/authorizations',
        method: 'post',
        response: () => {
            return {
                code: 200,
                data: {
                    token: "fenva",
                    refresh_token: "fjeaf"
                },
            }
        },
    },
    {
        url: '/api/user/profile',
        method: 'get',
        response: () => {
            return {
                code: 200,
                data: {
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    avatar: faker.image.avatarGitHub(),
                },
            }
        },
    },
    {
        url: '/api/users',
        method: 'get',
        response: function (opt:Option) {
            try {
                const currentPage = Number(opt?.query?.page) || 1
                const name = opt?.query?.name || ''
                const size = 10
                
                // 筛选器
                let filteredUsers = mockUsers.users
                if (name) {
                    filteredUsers = mockUsers.users.filter(user => 
                        user.name.toLowerCase().includes(name.toLowerCase())
                    )
                }
                
                const totalCount = filteredUsers.length
                const startIndex = (currentPage - 1) * size
                const endIndex = startIndex + size
                const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

                return {
                    code: 200,
                    data: {
                        currentPage,
                        size,
                        totalCount,
                        totalPages: Math.ceil(totalCount / size),
                        users: paginatedUsers
                    }
                }
            } catch (error) {
                console.error('Mock /api/users error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/user',
        method: 'post',
        response: function (opt: Option) {
            try {
                const { name, email, avatar } = opt.body || {};

                if (!name || !email) {
                    return {
                        code: 400,
                        message: '姓名和邮箱不能为空'
                    }
                }

                const newUser = mockUsers.addUser({ name, email, avatar, id: '' });

                return {
                    code: 200,
                    data: newUser,
                    message: '用户创建成功'
                }
            } catch (error) {
                console.error('Mock POST /api/users error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/user/:id',
        method: 'put',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];
               
                const userData = opt.body || {};

                if (!id) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                const updatedUser = mockUsers.updateUser(id, userData);

                if (!updatedUser) {
                    return {
                        code: 404,
                        message: '用户不存在'
                    }
                }

                return {
                    code: 200,
                    data: updatedUser,
                    message: '用户更新成功'
                }
            } catch (error) {
                console.error('Mock PUT /api/users/:id error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/users/:ids',
        method: 'delete',
        response: function (opt: Option) {
            try {
                // Extract IDs from URL path instead of query
                const urlParts = opt.url.split('/');
                const idsParam = urlParts[urlParts.length - 1];

                if (!idsParam) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                // Split comma-separated IDs
                const idsArray = idsParam.split(',').filter(id => id.trim());

                if (idsArray.length === 0) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                const deletedUsers = mockUsers.deleteUser(idsArray);

                return {
                    code: 200,
                    data: deletedUsers,
                    message: '用户删除成功'
                }
            } catch (error) {
                console.error('Mock DELETE /api/users/:ids error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/users/:id',
        method: 'get',
        response: function (opt: Option) {
            try {
                // Extract ID from URL path
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];

                if (!id) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                const user = mockUsers.getUserById(id);

                if (!user) {
                    return {
                        code: 404,
                        message: '用户不存在'
                    }
                }

                return {
                    code: 200,
                    data: user
                }
            } catch (error) {
                console.error('Mock GET /api/users/:id error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
] as MockMethod[]