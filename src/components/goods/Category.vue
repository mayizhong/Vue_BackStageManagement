<template>
  <div>

    <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>

      <!-- 树形表格 -->
      <!-- :data 是表格要渲染的数据 -->
      <tree-table :data="cateList" :columns="treeCol" :expand-type="false" :selection-type="false" :show-index="true" index-text="#" border>
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-circle-close red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-circle-check green" v-else></i>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row)">删除</el-button>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @current-change="handleCurrentChange" :current-page="getListParams.pagenum" :page-size="getListParams.pagesize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- :options 用来指定数据源 -->
        <!-- :props 用来指定对应关系 -->
        <el-form-item label="父级分类：">
          <el-cascader expand-trigger="hover" :options="pcate" :props="cascaderProps" v-model="selectedParentCate" @change="handleChange" :change-on-select="true" :clearable="true">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑信息的对话框 -->
    <el-dialog title="编辑分类信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 编辑的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Category-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.red {
  color: red;
}

.green {
  color: lightseagreen;
}

.zk-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
