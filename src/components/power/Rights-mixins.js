export default {
  data() {
    return {
      // 权限列表，默认为空
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取全权限列表
    async getRightsList() {
      // 获取 列表类型的 权限数据
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightsList = res.data
      // console.log(res.data)

      /* const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status === 200) {
        this.rightsList = res.data
      } else {
        this.$message.error('获取权限列表失败！')
      } */
    }
  }
}
