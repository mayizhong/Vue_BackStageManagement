export default {
  data() {
    return {
      // 所有的商品分类
      catelist: [],
      // 级联选择框的对应关系
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的商品分类
      selectedCate: [],
      // 被选中的 tab 页签的名字
      activeName: 'many',
      // 动态表格需要的数据
      manyTableData: [],
      // 静态表格需要的数据
      onlyTableData: [],
      // 控制 添加参数对话框的显示或隐藏
      addDialogVisible: false,
      // 添加参数的表单
      addForm: {
        attr_name: '' // 要添加的参数的名称
      },
      // 添加参数表单的验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请添加参数名称', trigger: 'blur' }]
      },
      // 控制 编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 修改参数的表单
      editForm: {
        attrId: '', // 要编辑的那个参数的Id
        attr_name: '' // 要修改的参数的名称
      },
      // 修改参数表单的验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: '请添加参数名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories?type=3')
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败！')
      this.catelist = res.data
    },
    // 每当分类选择框选择项发生变化，都会触发这个事件处理函数
    handleCateChange() {
      if (this.selectedCate.length !== 3) {
        this.selectedCate = []
        // 如果用户没有选中三级分类，则清空之前的表格数据
        this.onlyTableData = []
        this.manyTableData = []
      } else {
        this.getParamsData()
      }
      // console.log(this.selectedCate)
    },
    // 获取参数数据
    async getParamsData() {
      // 发起参数请求
      const { data: res } = await this.$http.get(`categories/${this.selectedCate[2]}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败！')
      // 由于 服务器返回的参数列表中，每一个参数项的 attr_vals 为普通字符串，我们需要使用 字符串的 split 操作，把 attr_vals 用 空格 分割为 数组
      res.data.forEach(item => {
        // 判断 item.attr_vals 是否为 空字符串，如果不为空，则 进行 分割；
        // 如果为空，则 不进行分割，直接返回一个空数据，表示没有可选项；
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为参数对象，添加一个自定义属性，叫 inputVisible,
        // 来控制，这个参数中 文本框 和 按钮的显示与隐藏
        item.inputVisible = false
        // 把文本框中输入的值，也绑定到 参数对象，作为一个自定义属性存在
        item.inputValue = ''
      })
      // 数据获取成功以后，应该 根据 activeName 进行判断，从而决定把数据交给哪个表格去渲染；
      if (this.activeName === 'many') {
        // 数据交给动态表格
        this.manyTableData = res.data
      } else {
        // 把数据交给静态表格
        this.onlyTableData = res.data
      }
      // console.log(res.data)
    },
    // 每当点击了不同的页签，都会触发这个函数
    handleTabClick() {
      // 只要发生了 tab 栏的切换，就立即打印当前被选中的 tab 栏 页签的 名称
      // 先判断 选择的分类是否为三级分类；如果是，才发起请求
      if (this.selectedCate.length !== 3) return
      this.getParamsData()
    },
    // 每当添加参数的对话框关闭，重置表单项
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起请求，提交表单到服务器，添加新参数
        const { data: res } = await this.$http.post(
          `categories/${this.selectedCate[2]}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName // 控制添加的参数类型
          }
        )

        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        // 重新获取参数列表中的数据
        this.getParamsData()
        // 隐藏添加的对话框
        this.addDialogVisible = false
      })
    },
    // 点击按钮，展示编辑的对话框
    async showEditDialog(scope) {
      // 发起请求，获取 当前要编辑的这个参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.selectedCate[2]}/attributes/${scope.row.attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')
      // 获取参数信息成功后，为 data 中的 editForm 赋值
      this.editForm.attr_name = res.data.attr_name
      this.editForm.attrId = res.data.attr_id
      // 展示 编辑的对话框
      this.editDialogVisible = true
    },
    // 每当 编辑对话框关闭的时候，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，编辑参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 如果验证通过，则 发起请求 保存编辑的操作
        const { data: res } = await this.$http.put(
          `categories/${this.selectedCate[2]}/attributes/${this.editForm.attrId}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )

        if (res.meta.status !== 200) return this.$message.error('编辑参数信息失败！')
        this.$message.success('编辑参数信息成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 点击按钮，删除参数信息
    async remove(scope) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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

      const { data: res } = await this.$http.delete(
        `categories/${this.selectedCate[2]}/attributes/${scope.row.attr_id}`
      )

      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    // 添加 参数信息的 文本框失去焦点触发此事件
    async handleInputConfirm(scope) {
      // 获取到用户输入的文本内容
      // 如果用户什么都没有输入，则直接return
      if (scope.row.inputValue.trim().length <= 0) {
        scope.row.inputValue = ''
        scope.row.inputVisible = false
        return
      }
      // 获取到用户输入的内容，并保存到 val 中
      const val = scope.row.inputValue.trim()
      // 清空文本框中的内容
      scope.row.inputValue = ''
      // 把用户输入的这一项内容，push 到数组中，即可更新页面
      scope.row.attr_vals.push(val)
      // 为了把用户的操作，持久化保存，需要把 最新的 attr_vals,
      // 以字符串的形式，更新回 数据库即可：
      const { data: res } = await this.$http.put(
        `categories/${this.selectedCate[2]}/attributes/${scope.row.attr_id}`,
        {
          attr_name: scope.row.attr_name,
          attr_sel: scope.row.attr_sel,
          attr_vals: scope.row.attr_vals.join(' ') // 把最新的选项，使用 空格拼接，并同步回 数据库中
        }
      )

      if (res.meta.status !== 200) return this.$message.error('更新参数失败！')
      this.$message.success('更新参数成功！')
      scope.row.inputVisible = false
    },
    // 点击按钮，展示 文本框
    showInput(scope) {
      scope.row.inputVisible = true
      // 这里的 this.$nextTick 表示当页面更新完成以后，
      // 再去调用 $nextTick 内提供的回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 关闭 tag 标签
    async tagClosed(scope, i) {
      // console.log('ok')
      scope.row.attr_vals.splice(i, 1)

      const { data: res } = await this.$http.put(
        `categories/${this.selectedCate[2]}/attributes/${scope.row.attr_id}`,
        {
          attr_name: scope.row.attr_name,
          attr_sel: scope.row.attr_sel,
          attr_vals: scope.row.attr_vals.join(' ') // 把最新的选项，使用 空格拼接，并同步回 数据库中
        }
      )

      if (res.meta.status !== 200) return this.$message.error('更新参数失败！')
      this.$message.success('更新参数成功！')
    }
  }
}
