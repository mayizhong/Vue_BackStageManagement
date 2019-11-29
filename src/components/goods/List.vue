<template>
  <div>

    <!-- 搜索区域 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input clearable placeholder="请输入内容" class="input-with-select" v-model="queryinfo.query">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAdd">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- table 表格区域 -->
    <el-table :data="goodslist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="95"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70"></el-table-column>
      <el-table-column label="创建时间" width="140">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[10, 15, 20, 30]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

  </div>
</template>

<script>
import mix from './List-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
