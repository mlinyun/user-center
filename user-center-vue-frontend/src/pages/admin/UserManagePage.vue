<template>
    <div class="user-manage-page">
        <a-space direction="vertical" size="large" class="page-space">
            <a-card class="overview-card" :bordered="false">
                <div class="overview-header">
                    <a-space size="middle">
                        <TeamOutlined class="overview-icon" />
                        <div>
                            <h2 class="overview-title">用户管理</h2>
                            <p class="overview-subtitle">集中管理平台用户账号、权限与安全状态</p>
                        </div>
                    </a-space>
                    <a-button type="primary" @click="createModalVisible = true">
                        <PlusOutlined /> 新建用户
                    </a-button>
                </div>
            </a-card>

            <a-card class="search-card" :bordered="true">
                <a-form :model="searchForm" layout="vertical">
                    <a-row :gutter="[16, 16]">
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="用户账号">
                                <a-input
                                    v-model:value="searchForm.userAccount"
                                    allow-clear
                                    placeholder="请输入用户账号"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="用户昵称">
                                <a-input
                                    v-model:value="searchForm.userName"
                                    allow-clear
                                    placeholder="支持模糊查询"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="用户角色">
                                <a-select
                                    v-model:value="searchForm.userRole"
                                    allow-clear
                                    placeholder="请选择角色"
                                >
                                    <a-select-option :value="USER_ROLE.USER"
                                        >普通用户</a-select-option
                                    >
                                    <a-select-option :value="USER_ROLE.ADMIN"
                                        >管理员</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="账号状态">
                                <a-select
                                    v-model:value="searchForm.userStatus"
                                    allow-clear
                                    placeholder="请选择账号状态"
                                >
                                    <a-select-option :value="USER_STATUS.NORMAL"
                                        >正常</a-select-option
                                    >
                                    <a-select-option :value="USER_STATUS.BANNED"
                                        >封禁</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="性别">
                                <a-select
                                    v-model:value="searchForm.userGender"
                                    allow-clear
                                    placeholder="请选择性别"
                                >
                                    <a-select-option :value="0">女</a-select-option>
                                    <a-select-option :value="1">男</a-select-option>
                                    <a-select-option :value="2">未知</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="手机号码">
                                <a-input
                                    v-model:value="searchForm.userPhone"
                                    allow-clear
                                    placeholder="请输入手机号码"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="邮箱地址">
                                <a-input
                                    v-model:value="searchForm.userEmail"
                                    allow-clear
                                    placeholder="请输入邮箱地址"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-form-item label="星球编号">
                                <a-input
                                    v-model:value="searchForm.planetCode"
                                    allow-clear
                                    placeholder="请输入星球编号"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12" :lg="12">
                            <a-form-item label="创建时间">
                                <a-range-picker
                                    v-model:value="searchForm.createTimeRange"
                                    show-time
                                    format="YYYY-MM-DD HH:mm"
                                    value-format="YYYY-MM-DD HH:mm:ss"
                                    style="width: 100%"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <div class="search-actions">
                        <a-space>
                            <a-button type="primary" :loading="loading" @click="handleSearch">
                                <SearchOutlined /> 查询
                            </a-button>
                            <a-button :disabled="loading" @click="handleReset">
                                <ReloadOutlined /> 重置
                            </a-button>
                        </a-space>
                    </div>
                </a-form>
            </a-card>

            <a-card :bordered="true">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :loading="loading"
                    :pagination="pagination"
                    row-key="id"
                    :scroll="{ x: 1300 }"
                    @change="handleTableChange"
                >
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key === 'index'">
                            <span>
                                {{
                                    ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) +
                                    index +
                                    1
                                }}
                            </span>
                        </template>
                        <template v-else-if="column.key === 'userInfo'">
                            <a-space size="middle">
                                <a-badge
                                    :count="record.userRole === USER_ROLE.ADMIN ? '管理员' : 0"
                                    :offset="[-6, 6]"
                                    color="#1677ff"
                                >
                                    <a-avatar :size="48" :src="record.userAvatar">
                                        <template #icon>
                                            <UserOutlined />
                                        </template>
                                    </a-avatar>
                                </a-badge>
                                <div class="user-info-meta">
                                    <div class="user-info-name">
                                        {{ record.userName || "未设置昵称" }}
                                        <a-tag
                                            v-if="record.userRole === USER_ROLE.ADMIN"
                                            color="blue"
                                        >
                                            <SafetyOutlined /> 管理员
                                        </a-tag>
                                    </div>
                                    <div class="user-info-account">
                                        <UserOutlined /> {{ record.userAccount }}
                                    </div>
                                </div>
                            </a-space>
                        </template>
                        <template v-else-if="column.key === 'userGender'">
                            <a-tag :color="genderColorMap[record.userGender ?? 2]">
                                {{ genderTextMap[record.userGender ?? 2] }}
                            </a-tag>
                        </template>
                        <template v-else-if="column.key === 'contact'">
                            <div class="contact-cell">
                                <div v-if="record.userPhone" class="contact-item">
                                    <PhoneOutlined /> {{ record.userPhone }}
                                </div>
                                <div v-if="record.userEmail" class="contact-item">
                                    <MailOutlined /> {{ record.userEmail }}
                                </div>
                                <div
                                    v-if="!record.userPhone && !record.userEmail"
                                    class="contact-empty"
                                >
                                    暂无联系方式
                                </div>
                            </div>
                        </template>
                        <template v-else-if="column.key === 'planetCode'">
                            <a-typography-text code copyable>
                                {{ record.planetCode || "-" }}
                            </a-typography-text>
                        </template>
                        <template v-else-if="column.key === 'userRole'">
                            <a-tag
                                :color="record.userRole === USER_ROLE.ADMIN ? 'blue' : 'default'"
                            >
                                <template v-if="record.userRole === USER_ROLE.ADMIN">
                                    <SafetyOutlined /> 管理员
                                </template>
                                <template v-else> <TeamOutlined /> 普通用户 </template>
                            </a-tag>
                        </template>
                        <template v-else-if="column.key === 'userStatus'">
                            <a-badge
                                :status="
                                    record.userStatus === USER_STATUS.NORMAL ? 'success' : 'error'
                                "
                                :text="record.userStatus === USER_STATUS.NORMAL ? '正常' : '封禁'"
                            />
                        </template>
                        <template v-else-if="column.key === 'createTime'">
                            <a-tooltip :title="formatFullTime(record.createTime)">
                                <ClockCircleOutlined />
                                {{ formatShortTime(record.createTime) }}
                            </a-tooltip>
                        </template>
                        <template v-else-if="column.key === 'actions'">
                            <a-space size="small">
                                <a-button type="link" size="small" @click="handleView(record)">
                                    <EyeOutlined /> 查看
                                </a-button>
                                <a-button type="link" size="small" @click="handleEdit(record)">
                                    <EditOutlined /> 编辑
                                </a-button>
                                <a-dropdown placement="bottomRight" :trigger="['click']">
                                    <a-button type="link" size="small">
                                        <MoreOutlined /> 更多
                                    </a-button>
                                    <template #overlay>
                                        <a-menu @click="getMoreMenuHandler(record)">
                                            <a-menu-item key="reset">
                                                <KeyOutlined class="action-icon" /> 重置密码
                                            </a-menu-item>
                                            <a-menu-item key="ban">
                                                <component
                                                    :is="
                                                        record.userStatus === USER_STATUS.NORMAL
                                                            ? StopOutlined
                                                            : CheckCircleOutlined
                                                    "
                                                    class="action-icon"
                                                />
                                                {{
                                                    record.userStatus === USER_STATUS.NORMAL
                                                        ? "封禁用户"
                                                        : "解禁用户"
                                                }}
                                            </a-menu-item>
                                            <a-menu-divider />
                                            <a-menu-item key="delete" danger>
                                                <DeleteOutlined class="action-icon" /> 删除用户
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </a-space>
                        </template>
                    </template>
                </a-table>
            </a-card>
        </a-space>

        <CreateUserModal v-model:visible="createModalVisible" @success="refreshTable" />
        <EditUserModal
            v-model:visible="editModalVisible"
            :user="editingUser"
            @success="refreshTable"
        />
        <ResetPasswordModal
            v-model:visible="resetPasswordModalVisible"
            :user="resetPasswordUser"
            @success="refreshTable"
        />
        <ViewUserDrawer :visible="viewDrawerVisible" :user="viewingUser" @close="closeDrawer" />
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { createVNode, onMounted, reactive, ref, watch } from "vue";
import {
    Modal,
    type MenuProps,
    type PaginationProps,
    type TableColumnsType,
    type TableProps,
} from "ant-design-vue";
import {
    TeamOutlined,
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
    UserOutlined,
    SafetyOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    EditOutlined,
    KeyOutlined,
    StopOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    MoreOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { USER_ROLE, USER_STATUS } from "@/constants/system";
import { adminGetUserInfoByPage } from "@/api/admin";
import { useUserOperations } from "@/pages/admin/hooks/useUserOperations";
import CreateUserModal from "@/pages/admin/components/CreateUserModal.vue";
import EditUserModal from "@/pages/admin/components/EditUserModal.vue";
import ResetPasswordModal from "@/pages/admin/components/ResetPasswordModal.vue";
import ViewUserDrawer from "@/pages/admin/components/ViewUserDrawer.vue";

type SortState = {
    field: string;
    order: "ascend" | "descend";
};

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

const tableColumns: TableColumnsType<API.UserVO> = [
    { title: "序号", dataIndex: "index", key: "index", width: 80, align: "center", fixed: "left" },
    { title: "用户信息", dataIndex: "userInfo", key: "userInfo", width: 240, fixed: "left" },
    { title: "性别", dataIndex: "userGender", key: "userGender", width: 100, align: "center" },
    { title: "联系方式", dataIndex: "contact", key: "contact", width: 220 },
    {
        title: "星球编号",
        dataIndex: "planetCode",
        key: "planetCode",
        width: 140,
        align: "center",
        sorter: true,
    },
    { title: "角色", dataIndex: "userRole", key: "userRole", width: 120, align: "center" },
    { title: "状态", dataIndex: "userStatus", key: "userStatus", width: 110, align: "center" },
    { title: "创建时间", dataIndex: "createTime", key: "createTime", width: 180, sorter: true },
    {
        title: "操作",
        dataIndex: "actions",
        key: "actions",
        width: 220,
        fixed: "right",
        align: "center",
    },
];

const tableData = ref<API.UserVO[]>([]);
const loading = ref(false);

const pagination = reactive<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
    showTotal: (total: number) => `共 ${total} 条记录`,
});

const searchForm = reactive({
    userAccount: "",
    userName: "",
    userRole: undefined as UserRole | undefined,
    userStatus: undefined as 0 | 1 | undefined,
    userGender: undefined as 0 | 1 | 2 | undefined,
    userPhone: "",
    userEmail: "",
    planetCode: "",
    createTimeRange: [] as string[],
});

const sortState = ref<SortState | null>(null);

const genderTextMap: Record<number, string> = {
    0: "女",
    1: "男",
    2: "未知",
};

const genderColorMap: Record<number, string> = {
    0: "#ff85c0",
    1: "#1677ff",
    2: "#8c8c8c",
};

const { handleGetUserInfo, handleDelete: deleteUser, handleBanOrUnban } = useUserOperations();

const createModalVisible = ref(false);
const editModalVisible = ref(false);
const resetPasswordModalVisible = ref(false);
const viewDrawerVisible = ref(false);

const editingUser = ref<API.User | null>(null);
const viewingUser = ref<API.User | null>(null);
const resetPasswordUser = ref<API.UserVO | null>(null);

const formatShortTime = (value?: string) => {
    if (!value) {
        return "-";
    }
    return dayjs(value).format("YYYY-MM-DD HH:mm");
};

const formatFullTime = (value?: string) => {
    if (!value) {
        return "";
    }
    return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
};

const buildRequestPayload = (): API.AdminQueryUserRequest => {
    const payload: API.AdminQueryUserRequest = {
        current: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
    };

    if (searchForm.userAccount.trim()) payload.userAccount = searchForm.userAccount.trim();
    if (searchForm.userName.trim()) payload.userName = searchForm.userName.trim();
    if (searchForm.userRole) payload.userRole = searchForm.userRole;
    if (searchForm.userStatus !== undefined) payload.userStatus = searchForm.userStatus;
    if (searchForm.userGender !== undefined) payload.userGender = searchForm.userGender;
    if (searchForm.userPhone.trim()) payload.userPhone = searchForm.userPhone.trim();
    if (searchForm.userEmail.trim()) payload.userEmail = searchForm.userEmail.trim();
    if (searchForm.planetCode.trim()) payload.planetCode = searchForm.planetCode.trim();

    if (Array.isArray(searchForm.createTimeRange) && searchForm.createTimeRange.length === 2) {
        payload.createTimeStart = searchForm.createTimeRange[0];
        payload.createTimeEnd = searchForm.createTimeRange[1];
    }

    if (sortState.value) {
        const fieldMapping: Record<string, string> = {
            planetCode: "planet_code",
            createTime: "create_time",
            userAccount: "user_account",
            userName: "user_name",
            userPhone: "user_phone",
            userEmail: "user_email",
        };
        payload.sortField = fieldMapping[sortState.value.field] ?? sortState.value.field;
        payload.sortOrder = sortState.value.order;
    }

    return payload;
};

const fetchUserList = async () => {
    loading.value = true;
    try {
        const response = await adminGetUserInfoByPage(buildRequestPayload());
        const pageData = response.data;
        tableData.value = pageData?.records ?? [];
        pagination.total = pageData?.total ?? 0;
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    pagination.current = 1;
    fetchUserList();
};

const resetSearchForm = () => {
    searchForm.userAccount = "";
    searchForm.userName = "";
    searchForm.userRole = undefined;
    searchForm.userStatus = undefined;
    searchForm.userGender = undefined;
    searchForm.userPhone = "";
    searchForm.userEmail = "";
    searchForm.planetCode = "";
    searchForm.createTimeRange = [];
};

const handleReset = () => {
    resetSearchForm();
    pagination.current = 1;
    sortState.value = null;
    fetchUserList();
};

const handleTableChange: TableProps<API.UserVO>["onChange"] = (pager, _filters, sorter) => {
    pagination.current = pager.current ?? 1;
    pagination.pageSize = pager.pageSize ?? 10;

    if (!Array.isArray(sorter) && sorter?.order) {
        if (sorter.field) {
            sortState.value = {
                field: String(sorter.field),
                order: sorter.order,
            };
        }
    } else {
        sortState.value = null;
    }

    fetchUserList();
};

const handleView = async (record: API.UserVO) => {
    if (!record.id) {
        return;
    }
    const detail = await handleGetUserInfo(record.id);
    if (detail) {
        viewingUser.value = detail;
        viewDrawerVisible.value = true;
    }
};

const handleEdit = async (record: API.UserVO) => {
    if (!record.id) {
        return;
    }
    const detail = await handleGetUserInfo(record.id);
    if (detail) {
        editingUser.value = detail;
        editModalVisible.value = true;
    }
};

const handleResetPassword = (record: API.UserVO) => {
    resetPasswordUser.value = record;
    resetPasswordModalVisible.value = true;
};

const handleToggleStatus = async (record: API.UserVO) => {
    if (!record.id || record.userStatus === undefined) {
        return;
    }
    const success = await handleBanOrUnban(record.id, record.userStatus);
    if (success) {
        fetchUserList();
    }
};

const handleDeleteUser = async (record: API.UserVO) => {
    if (!record.id) {
        return;
    }
    const success = await deleteUser(record.id);
    if (success) {
        fetchUserList();
    }
};

const handleMoreAction = (key: string, record: API.UserVO) => {
    switch (key) {
        case "reset":
            handleResetPassword(record);
            break;
        case "ban":
            handleToggleStatus(record);
            break;
        case "delete":
            if (!record.id) {
                return;
            }
            Modal.confirm({
                title: "确认删除该用户吗？",
                icon: createVNode(ExclamationCircleOutlined),
                content: `用户账号：${record.userAccount ?? ""}`,
                okText: "删除",
                okType: "danger",
                cancelText: "取消",
                onOk: () => handleDeleteUser(record),
            });
            break;
        default:
            break;
    }
};

type MenuClickInfo = Parameters<NonNullable<MenuProps["onClick"]>>[0];

const getMoreMenuHandler = (record: API.UserVO) => (info: MenuClickInfo) => {
    handleMoreAction(String(info.key), record);
};

const closeDrawer = () => {
    viewDrawerVisible.value = false;
    viewingUser.value = null;
};

const refreshTable = () => {
    fetchUserList();
};

onMounted(() => {
    fetchUserList();
});

watch(editModalVisible, (visible) => {
    if (!visible) {
        editingUser.value = null;
    }
});

watch(resetPasswordModalVisible, (visible) => {
    if (!visible) {
        resetPasswordUser.value = null;
    }
});
</script>

<style scoped>
.user-manage-page {
    padding: 0 8px 24px;
}

.page-space {
    width: 100%;
}

.overview-card {
    background: linear-gradient(135deg, rgb(22 119 255 / 12%) 0%, rgb(47 84 235 / 8%) 100%);
    border-radius: 12px;
    box-shadow: 0 12px 40px -20px rgb(47 84 235 / 45%);
}

.overview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.overview-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: rgb(0 0 0 / 85%);
}

.overview-subtitle {
    margin: 4px 0 0;
    color: rgb(0 0 0 / 45%);
}

.overview-icon {
    font-size: 32px;
    color: #1677ff;
}

.search-card {
    border-radius: 12px;
}

.search-actions {
    display: flex;
    justify-content: flex-end;
}

.user-info-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.user-info-name {
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 600;
    color: rgb(0 0 0 / 85%);
}

.user-info-account {
    display: flex;
    gap: 4px;
    align-items: center;
    font-size: 12px;
    color: rgb(0 0 0 / 45%);
}

.contact-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.contact-item {
    display: flex;
    gap: 6px;
    align-items: center;
    color: rgb(0 0 0 / 65%);
}

.contact-empty {
    color: rgb(0 0 0 / 35%);
}

.action-icon {
    margin-right: 4px;
}

@media (width <= 768px) {
    .overview-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }

    .search-actions {
        justify-content: flex-start;
    }
}
</style>
