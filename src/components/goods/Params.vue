<template>
  <div>

    <!-- 面包屑导航条 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 警告提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon>
      </el-alert>
      <!-- 分类选择区域 -->
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader expand-trigger="hover" :options="catelist" :props="cascaderProps" v-model="selectedCate" @change="handleCateChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tabs 区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button type="primary" size="mini" :disabled="this.selectedCate.length === 3 ? false : true" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <!-- 展开行列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 tag 标签 -->
                <el-tag v-for="(tag, i) in scope.row.attr_vals" :key="i" closable @close="tagClosed(scope, i)">
                  {{tag}}
                </el-tag>
                <!-- 动态添加 tag 标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope)" @blur="handleInputConfirm(scope)">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态参数按钮 -->
          <el-button type="primary" size="mini" :disabled="this.selectedCate.length === 3 ? false : true" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <!-- 展开行列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 tag 标签 -->
                <el-tag v-for="(tag, i) in scope.row.attr_vals" :key="i" closable @close="tagClosed(scope, i)">
                  {{tag}}
                </el-tag>
                <!-- 动态添加 tag 标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope)" @blur="handleInputConfirm(scope)">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加参数的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog :title="activeName === 'many' ? '修改动态参数' : '修改静态属性'" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 修改参数的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Params-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-row {
  margin: 15px 0;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 120px;
}
</style>
