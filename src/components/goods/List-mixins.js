export default {
  data() {
    return {
      // 查询参数
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据，默认为空
      goodslist: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据查询参数获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryinfo })

      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.goodslist = res.data.goods
      this.total = res.data.total
      // console.log(res)
    },
    // 监听 pageSize 的变化，并立即获取最新的数据
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 pageNum 的变化，并立即获取最新的数据
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据商品Id，删除商品数据
    async remove(scope) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户取消了删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 用户确认了删除
      const { data: res } = await this.$http.delete('goods/' + scope.row.goods_id)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败！')
      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    // 跳转到添加页面
    goAdd() {
      this.$router.push('/goods/add')
    }
  },
  // 过滤器
  filters: {
    // 格式化时间的过滤器
    /* dateFormat(originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1).toString().padStart(2, '0')
      const d = dt
        .getDate()
        .toString()
        .padStart(2, '0')

      const hh = dt
        .getHours()
        .toString()
        .padStart(2, '0')
      const mm = dt
        .getMinutes()
        .toString()
        .padStart(2, '0')
      const ss = dt
        .getSeconds()
        .toString()
        .padStart(2, '0')

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    } */
  }
}
