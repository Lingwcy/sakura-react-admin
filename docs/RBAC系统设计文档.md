# React-Jike RBAC 系统设计文档

## 概述

本项目实现了一套基于角色的访问控制（RBAC）系统，具有以下特色：
- **三层权限粒度**：目录（CATALOGUE）、菜单（MENU）、按钮（BUTTON）
- **动态路由生成**：基于用户权限动态构建路由和菜单
- **树形权限结构**：支持层级化的权限管理
- **组件级权限控制**：从路由到UI组件的全方位权限控制

## 核心架构

### 1. 权限数据结构

#### Permission 接口定义
```typescript
export interface Permission {
  id: string;           // 权限唯一标识
  parentId: string;     // 父权限ID，支持树形结构
  name: string;         // 权限名称
  label: string;        // 国际化标签
  type: PermissionType; // 权限类型：0-目录，1-菜单，2-按钮
  route: string;        // 路由路径
  status?: PermissionBasicStatus; // 启用状态：0-禁用，1-启用
  order?: number;       // 排序权重
  icon?: string;        // 图标标识
  component?: string;   // 组件路径
  hide?: boolean;       // 是否隐藏
  children?: Permission[]; // 子权限
}
```

#### Role 接口定义
```typescript
export interface Role {
  id: string;
  name: string;
  label: string;
  status: PermissionBasicStatus;
  order?: number;
  desc?: string;
  permission?: Permission[]; // 角色拥有的权限树
}
```

### 2. 权限类型枚举

```typescript
export enum PermissionType {
  CATALOGUE = 0,  // 目录级权限（如：用户管理）
  MENU = 1,       // 菜单级权限（如：用户列表页面）
  BUTTON = 2,     // 按钮级权限（如：新增用户按钮）
}

export enum PermissionBasicStatus {
  DISABLE = 0,    // 禁用
  ENABLE = 1,     // 启用
}
```

## 核心功能模块

### 1. 动态路由生成 (`use-permission-routes.tsx`)

#### 核心流程
1. **获取用户权限**：从用户配置中获取权限树
2. **扁平化处理**：将树形权限结构扁平化便于处理
3. **路由构建**：根据权限类型构建不同的路由对象
4. **组件懒加载**：动态导入页面组件

#### 关键函数

**buildCompleteRoute**: 递归构建完整路由路径
```typescript
function buildCompleteRoute(
  permission: Permission,
  flattenedPermissions: Permission[],
  segments: string[] = [],
): string
```

**createMenuRoute**: 创建菜单类型路由
```typescript
const createMenuRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
  const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));
  
  if (permission.component) {
    const Element = lazy(loadComponentFromPath(permission.component));
    baseRoute.element = (
      <Suspense fallback={<LineLoading />}>
        <Element />
      </Suspense>
    );
  }
  
  return baseRoute;
};
```

### 2. 权限验证与路由保护

#### AuthRoute 组件
```typescript
export function AuthRoute({ children }: AuthRoutProps) {
  const { userToken } = useUserToken()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!userToken.token && location.pathname !== '/login') {
      navigate('/login', { replace: true })
    }
  }, [userToken.token, navigate, location.pathname])

  if (!userToken.token) {
    return null
  }

  return <>{children}</>
}
```

### 3. 侧边栏菜单动态渲染

#### 菜单生成流程
1. **权限路由获取**：`usePermissionRoutes()` 获取用户可访问的路由
2. **菜单过滤排序**：根据 `meta` 信息过滤并按 `order` 排序
3. **层级渲染**：支持折叠展开的多级菜单

```typescript
const useSystemSideBar = () => {
  const route = usePermissionRoutes() // 动态路由渲染侧边栏
  return {
    sidebarNavItems: route
  }
}
```

### 4. 权限管理功能

#### 权限CRUD操作
- **查询权限列表**：`getPermissionList()`
- **创建权限节点**：`createPermissionNode()`
- **更新权限信息**：`updatePermissionNode()`
- **删除权限节点**：`deletePermissionNode()`

#### 权限树操作工具
```typescript
// 树形结构转扁平列表
function PermisionTree2List(permissionTree: Permission[])

// 扁平列表转树形结构
function PermissionListFattented2Tree(list: Omit<Permission[], 'children'>)
```

## 数据流转

### 1. 用户登录流程
```
用户登录 → 获取Token → 获取用户信息 → 获取角色权限 → 构建动态路由 → 渲染菜单
```

### 2. 权限验证流程
```
路由访问 → AuthRoute验证 → Token检查 → 权限路由匹配 → 组件渲染
```

### 3. 菜单渲染流程
```
用户权限 → usePermissionRoutes → 路由对象生成 → NavMain组件 → 侧边栏渲染
```

## 状态管理

### 1. 用户状态 (userStore.ts)
```typescript
type Store = {
  userToken: UserToken,
  userProfile: UserProfile,
}

type Action = {
  setUserToken: (token: UserToken) => void;
  setUserProfile: (data: UserProfile) => void;
  setUserRole: (data: Role) => void;
}
```

### 2. 系统状态 (systemStore.ts)
```typescript
type Store = {
  sidebarConfig: {
    teams: SidebarTeam[],
    items: SilderNavItem[],
  }
  breadConfig: {
    currentBread: string[]
  }
}
```

## 特色功能

### 1. 智能路径构建
- 自动递归构建完整路由路径
- 支持多层级嵌套路由
- 路径冲突检测和警告

### 2. 组件懒加载
- 基于权限的按需加载
- 统一的加载状态处理
- 错误边界保护

### 3. 权限粒度控制
- **目录级**：控制整个功能模块的访问
- **菜单级**：控制具体页面的访问
- **按钮级**：控制页面内操作的权限

### 4. Mock数据管理
- 完整的权限数据模拟
- 支持多角色权限配置
- 便于开发和测试

## API接口设计

### 权限相关接口
```typescript
// 获取权限列表
GET /api/permission

// 获取权限详情
GET /api/permission/:id

// 创建权限节点
POST /api/permission

// 更新权限节点
PUT /api/permission/:id

// 删除权限节点
DELETE /api/permission/:id

// 获取根权限列表
GET /api/permissions/catalogue

// 获取下一个根ID
GET /api/permission/next-root-id

// 获取下一个子ID
GET /api/permission/next-child-id/:parentId
```

## 使用示例

### 1. 添加新的权限节点
```typescript
const newPermission = {
  id: "8001",
  parentId: "8000",
  name: "新功能",
  label: "new-feature",
  type: PermissionType.MENU,
  route: "new-feature",
  component: "/NewFeature/index.tsx",
  status: PermissionBasicStatus.ENABLE,
  order: 1
};
```

### 2. 创建新角色
```typescript
const newRole = {
  id: "3",
  name: "Editor",
  label: "editor",
  status: PermissionBasicStatus.ENABLE,
  desc: "内容编辑员",
  permission: [USER_PERMISSION, COMPONENTS_PERMISSION]
};
```

## 总结

本RBAC系统的特色在于：
1. **灵活的三层权限模型**，支持从粗粒度到细粒度的权限控制
2. **动态路由生成机制**，根据用户权限实时构建可访问路由
3. **完整的权限管理界面**，支持权限的可视化管理
4. **优雅的状态管理**，使用Zustand进行轻量级状态管理
5. **类型安全**，全面的TypeScript类型定义确保代码质量

这套系统为前端应用提供了企业级的权限控制能力，既保证了安全性，又具备良好的可扩展性和维护性。
