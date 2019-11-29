<template>
  <div>

    <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>

      <el-table :data="roleslist" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(itemOne, indexOne) in scope.row.children" :key="itemOne.id" :class="['borderBottom', indexOne === 0 ? 'borderTop' : '']">
              <el-col :span="4">
                <el-tag closable @close="removeRights(scope.row, itemOne.id)">{{itemOne.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 在一级权限的后20列中循环生成 二级权限 -->
                <el-row v-for="(itemTwo, indexTwo) in itemOne.children" :key="itemTwo.id" :class="indexTwo === 0 ? '' : 'borderTop'">
                  <el-col :span="5">
                    <el-tag closable type="success" @close="removeRights(scope.row, itemTwo.id)">{{itemTwo.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag closable type="warning" v-for="itemThree in itemTwo.children" :key="itemThree.id" @close="removeRights(scope.row, itemThree.id)">{{itemThree.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="描述">
        </el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加新角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加角色的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog title="编辑角色信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 编辑角色的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形结构组件 -->
      <!-- :data 用来指定当前这棵树，要绑定到的数据 -->
      <!-- node-key 用来指定，每个节点，被选中时候，所选中的哪个值 -->
      <!-- :props 用来指定每个节点的配置项 -->
      <!--     比如，通过 label 指定要展示的名称 -->
      <!--     比如，通过 children 属性指定 通过 哪个属性来实现嵌套 -->
      <el-tree ref="tree" :data="rightTree" node-key="id" :props="treeProps" show-checkbox :default-expand-all="true" :default-checked-keys="defaultCheckedLeafKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Roles-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.borderBottom {
  border-bottom: 1px solid #ddd;
}

.borderTop {
  border-top: 1px solid #ddd;
}

.el-tag {
  margin: 10px 5px;
}

.el-col {
  white-space: nowrap;
}

.el-col-19 {
  white-space: normal;
}
</style>
