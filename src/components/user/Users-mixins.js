export default {
  data() {
    // 在 data() 中，且 return 之前，自定义一些校验规则
    var checkEmail = (rule, value, callback) => {
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value) === false) {
        return callback(new Error('邮箱地址不正确'))
      }
      // 校验通过
      callback()
    }

    // 校验手机号
    var checkMobile = (rule, value, callback) => {
      if (/^1\d{10}$/.test(value) === false) {
        return callback(new Error('手机号不正确'))
      }
      callback()
    }
    return {
      // 查询用户列表时候，要携带的查询参数
      queryinfo: {
        query: '', // 用户输入的搜索条件
        pagenum: 1, // 当前请求的是第几页数据
        pagesize: 10 // 每页显示几条数据
      },
      total: 0, // 总共有多少条数据
      // 用户列表
      userlist: [],
      // 控制添加 用户 对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 使用自定义的邮箱校验规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          // 使用自定义的手机号验证规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制 编辑对话框的显示和隐藏
      editDialogVisible: false,
      // 编辑的表单数据
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 编辑的表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 使用自定义的邮箱校验规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          // 使用自定义的手机号验证规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制 分配角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      setRoleForm: {
        id: '', // 用户的Id
        role_name: '', // 用户当前的角色
        username: '', // 用户的名称
        rid: '' // 要为用户分配的新角色的Id
      },
      // 所有角色的列表
      rolesList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 根据查询参数，获取用户列表
    async getUserList() {
      //  this.$http.post('login', {username: 'zs', password: '123456'})
      // 发起 get 请求，并携带 查询参数
      const { data: res } = await this.$http.get('users', { params: this.queryinfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('请求用户列表失败！')
      // 为用户列表赋值
      this.userlist = res.data.users
      // 为总页数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 的变化
    handleSizeChange(newSize) {
      // 把最新的 pagesize 赋值给 this.queryinfo
      this.queryinfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 的变化
    handleCurrentChange(newPageNum) {
      this.queryinfo.pagenum = newPageNum
      this.getUserList()
    },
    // 每当点击开关，就触发这个函数，把最新的状态保存到数据库
    async switchChanged(newState, id) {
      const { data: res } = await this.$http.put(`users/${id}/state/${newState}`)
      if (res.meta.status !== 200) return this.$message.error('修改用户状态失败！')
      this.$message.success('修改用户状态成功！')
    },
    // 实现状态修改的第二种方式 - 【比较好理解的方式】
    async switchChanged2(newState, id) {
      const { data: res } = await this.$http.put(`users/${id}/state/${newState}`)
      if (res.meta.status !== 200) return this.$message.error('修改用户状态失败！')
      this.$message.success('修改用户状态成功！')
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 添加新用户
    addUser() {
      // 1. 调用JS方法，校验表单是否符合规范
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        // 刷新列表
        this.getUserList()
        // 隐藏添加的对话框
        this.addDialogVisible = false
      })
    },
    // 关闭 编辑对话框时候的处理函数
    editDialogClosed() {
      // 重置编辑表单
      this.$refs.editFormRef.resetFields()
    },
    // 点击编辑按钮，展示编辑的对话框
    async showEditDialog(scope) {
      // console.log(scope.row.id)
      const { data: res } = await this.$http.get('users/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败！')
      // console.log(res.data)
      this.editForm.id = res.data.id
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      // 显示编辑对话框
      this.editDialogVisible = true
    },
    // 点击按钮，保存对用户做的修改
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败！')
        this.$message.success('编辑用户成功！')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    // 删除用户
    async remove(scope) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // admin 账户不允许删除
      if (scope.row.username === 'admin') {
        return this.$message({
          type: 'info',
          message: 'admin账户不允许删除，已取消删除'
        })
      }
      // 用户取消了删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete('users/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 点击按钮，展示 分配角色的对话框
    showSetRoleDialog(row) {
      this.setRoleDialogVisible = true
      // console.log(row)
      this.setRoleForm.id = row.id
      this.setRoleForm.role_name = row.role_name
      this.setRoleForm.username = row.username
      // 每次展示 分配角色对话框时候，都重新获取所有角色列表
      this.getRolesList()
    },
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      // console.log(res.data)
    },
    // 每当 分配角色的对话框关闭，重置表单
    setRoleDialogClosed() {
      // console.log('ok')
      // 手动重置表单项
      this.setRoleForm.rid = ''
    },
    // 点击按钮分配角色
    async setRole() {
      if (this.setRoleForm.rid === '') return this.$message.warning('请选择要分配的权限！')
      const { data: res } = await this.$http.put(`users/${this.setRoleForm.id}/role`, {
        rid: this.setRoleForm.rid
      })
      if (res.meta.status !== 200) return this.$message.error('为用户分配新角色失败！')
      this.$message.success('为用户分配新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    }
  }
}
