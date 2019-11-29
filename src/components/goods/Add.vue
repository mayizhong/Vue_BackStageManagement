<template>
  <div>

    <!-- 提示条区域 -->
    <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
    </el-alert>

    <!-- 步骤条区域 -->
    <el-steps :active="activeName-0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- tab 栏区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
      <el-tabs tab-position="left" v-model="activeName" :before-leave="beforeTabLeave">
        <!-- 基本信息面板 -->
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader expand-trigger="hover" :options="catelist" v-model="addForm.goods_cat" :props="cascaderProps" @change="handleCateChanged">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 动态参数面板 -->
        <!-- 把用户选择的分类下，所有的动态参数，都渲染到这个面板中 -->
        <el-tab-pane label="商品参数" name="1">
          <!-- 每次循环 manyParams 都会创建一个 表单 Item 项 -->
          <el-form-item :label="item.attr_name" v-for="item in manyParams" :key="item.attr_id">
            <!-- 在 表单 Item 项中，又可以 循环 item.attr_vals 这个数组，来创建一些复选框 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 上传图片的面板 -->
        <el-tab-pane label="商品图片" name="3">
          <!-- 在指定 action 上传地址的时候，一定要提供一个最全的 API 地址 -->
          <!-- :on-preview 用来指定 预览时候，要触发的回调函数 -->
          <!-- :on-remove 用来指定，要移除图片时候，触发的回调函数 -->
          <!-- list-type 用来指定，当前上传组件，会带有一个图片列表 -->
          <!-- :headers 的作用，是为当前上传组件，指定Authorization请求头 -->
          <!-- 因为 el-upload 组件在上传图片的时候，没有使用 axios发起请求，所以默认没有携带 Authorization，因此会上传失败！ -->
          <!-- 手动为 el-upload 指定 headers 属性，绑定一个 请求头 -->
          <el-upload class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload" :headers="uploadHeader" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 直接使用富文本编辑器，把 它的内容，双向绑定到 addForm.goods_introduce 上 -->
          <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor">
          </quill-editor>
          <!-- 添加商品的按钮 -->
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 图片预览窗口 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewURL" alt="" style="width: 100%;">
    </el-dialog>

  </div>
</template>

<script>
import mix from './Add-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
