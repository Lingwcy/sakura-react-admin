import type { MockMethod } from 'vite-plugin-mock'
import { faker } from "@faker-js/faker";
import {mockUsers}from './mockUser';
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
        response: function (opt) {
            const currentPage = Number(opt.query.page) || 1
            const size = 10
            const totalCount = mockUsers.users.length

            const startIndex = (currentPage - 1) * size
            const endIndex = startIndex + size
            const paginatedUsers = mockUsers.users.slice(startIndex, endIndex)

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
        }
    },
    {
        url: '/api/users',
        method: 'post',
        response: function (opt) {
            const { name, email, avatar } = JSON.parse(opt.body);
            
            if (!name || !email) {
                return {
                    code: 400,
                    message: '姓名和邮箱不能为空'
                }
            }
            
            const newUser = mockUsers.addUser({ name, email, avatar });
            
            return {
                code: 200,
                data: newUser,
                message: '用户创建成功'
            }
        }
    },
    {
        url: '/api/users/:id',
        method: 'put',
        response: function (opt) {
            const { id } = opt.query;
            const userData = JSON.parse(opt.body);
            
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
        }
    },
    {
        url: '/api/users/:ids',
        method: 'delete',
        response: function (opt) {
            const { ids } = opt.query;
            
            const deletedUser = mockUsers.deleteUser(ids);
            
            return {
                code: 200,
                data: deletedUser,
                message: '用户删除成功'
            }
        }
    },
    {
        url: '/api/users/:id',
        method: 'get',
        response: function (opt) {
            const { id } = opt.query;
            
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
        }
    },
] as MockMethod[]