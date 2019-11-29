export default {
  data() {
    return {
      // 获取分类列表时候的参数对象
      getListParams: {
        type: 3, // 获取三级分类
        pagenum: 1, // 默认 展示第一页数据
        pagesize: 5 // 默认 每页显示5条数据
      },
      total: 0, // 总数据条数
      cateList: [], // 所有分类的列表， 默认为空
      treeCol: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template', // 指定当前这一列，是通过作用域插槽渲染出来的
          template: 'isok' // 指定要使用哪个模板，来渲染当前列
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
          width: '200'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      // 添加分类的表单数据
      addForm: {
        // 要添加的分类，它的父分类id，默认为0
        cat_pid: 0,
        // 要添加分类的名称
        cat_name: '',
        // 要添加的这个分类的等级
        cat_level: 0
      },
      // 添加分类的表单验证规则
      addFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类的数据
      pcate: [],
      // 级联选择器中每一项的对应关系
      cascaderProps: {
        label: 'cat_name', // 展示的名称
        value: 'cat_id', // 选中之后的值
        children: 'children' // 实现父子嵌套的属性
      },
      // 当前选中的父级分类
      selectedParentCate: [],
      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {
        id: '', // 要修改的分类的Id值
        cat_name: '' // 分类的名称
      },
      // 编辑表单的校验规则
      editFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.getListParams })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败！')
      // console.log(res)
      // 为总数据条数赋值
      this.total = res.data.total
      // 为页面上需要渲染的分类列表赋值
      this.cateList = res.data.result
    },
    // 每当 页码值改变，都会触发这个方法
    handleCurrentChange(newPage) {
      this.getListParams.pagenum = newPage
      this.getCateList()
    },
    // 点击展示添加分类的对话框
    async showAddDialog() {
      // 获取所有父级分类的数据
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败！')
      // 把获取到的父级分类，保存到 data 中
      this.pcate = res.data
      // 显示添加分类的对话框
      this.addDialogVisible = true
    },
    // 每当选中的父级分类变化了，都会触发 handleChange
    handleChange() {
      // 设置层级：
      this.addForm.cat_level = this.selectedParentCate.length
      // 设置父分类Id：
      if (this.selectedParentCate.length === 0) {
        // 如果没有选中任何父分类， 则 父分类Id为 0
        this.addForm.cat_pid = 0
      } else {
        // 如果选中了父分类，则 把数组的最后一项，当作父分类
        this.addForm.cat_pid = this.selectedParentCate[this.selectedParentCate.length - 1]
      }
    },
    // 点击按钮，添加分类
    addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    // 监听对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.selectedParentCate = []
      // 只要对话框关闭，立即把 所有的数据，重置到原始状态
      this.addForm.cat_level = this.addForm.cat_pid = 0
    },
    // 展示编辑的对话框
    async showEditDialog(row) {
      // console.log(row)
      const { data: res } = await this.$http.get('categories/' + row.cat_id)
      if (res.meta.status !== 200) return this.$message.error('获取分类信息失败！')
      // 为编辑的表单赋值
      this.editForm.id = res.data.cat_id
      this.editForm.cat_name = res.data.cat_name
      // 展示编辑的对话框
      this.editDialogVisible = true
    },
    // 重置编辑表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editForm.id = ''
    },
    // 点击按钮，保存对分类信息的修改
    saveCate() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editForm.id, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('更新失败！')
        this.$message.success('更新成功！')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    // 删除分类
    async remove(row) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      const { data: res } = await this.$http.delete('categories/' + row.cat_id)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
      this.$message.success('删除分类成功！')
      this.getCateList()
    }
  }
}
