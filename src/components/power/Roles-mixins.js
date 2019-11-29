export default {
  data() {
    return {
      // 定义角色列表数组，默认为空
      roleslist: [],
      // 控制添加角色的对话框显示或隐藏
      addDialogVisible: false,
      // 添加角色的表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的表单验证规则
      addFormRules: {
        // 角色名称校验规则
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 控制编辑角色对话框的显示和隐藏
      editDialogVisible: false,
      // 编辑角色的表单
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 编辑表单的校验规则
      editFormRules: {
        // 角色名称校验规则
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 控制分配权限对话框的显示和隐藏
      setRightDialogVisible: false,
      // 权限的树形结构数据
      rightTree: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认被选中的叶子节点的数组
      defaultCheckedLeafKeys: [],
      // 即将要分配权限的那个角色的Id
      selectedRoleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.roleslist = res.data
      // console.log(res.data)
    },
    // 监听添加表单的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功！')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 展示编辑角色的对话框
    async showEditDialog(id) {
      // 获取指定角色的信息，并填充到页面上
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败！')
      // 把获取到的角色信息，赋值给editForm
      this.editForm.id = res.data.roleId
      this.editForm.roleName = res.data.roleName
      this.editForm.roleDesc = res.data.roleDesc
      // 显示编辑的对话框
      this.editDialogVisible = true
    },
    // 监听编辑对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，编辑角色信息
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败！')
        this.$message.success('编辑角色信息成功！')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    // 删除角色
    async remove(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 删除角色的指定权限
    async removeRights(row, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 取消删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      const { data: res } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      this.$message.success('删除权限成功！')
      // this.getRolesList()
      // 把 当前这一行 数据的 children 属性，替换为 服务器返回的新权限
      row.children = res.data
    },
    // 点击按钮，展示分配权限的对话框
    async showSetRightDialog(row) {
      // 先把 当前角色的Id，保存到 data 中，供以后使用
      this.selectedRoleId = row.id
      // 先获取整个权限树形结构的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败！')
      // console.log(res.data)
      // 把获取到的所有权限数据，赋值给 rightTree 供页面使用
      this.rightTree = res.data
      // 并把获取到的树形结构数据，加载到 对话框中显示
      const keys = [] // 用来存放所有三级权限的Id
      this.getLeafIds(row, keys)
      // 把所有需要勾选的叶子节点的Id数组，赋值给data上的 defaultCheckedLeafKeys
      this.defaultCheckedLeafKeys = keys
      // 展示分配权限的对话框
      this.setRightDialogVisible = true
    },
    // 循环调用递归，来获取当前角色下所有的三级权限Id
    getLeafIds(node, keyArr) {
      if (!node.children) {
        keyArr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getLeafIds(item, keyArr)
        })
      }
    },
    // 点击按钮，更新角色的权限
    async updateRights() {
      // 1. 获取到 所有半选状态的Id值
      const k1 = this.$refs.tree.getHalfCheckedKeys()
      // 2. 获取到 所有全选状态 的Id值
      const k2 = this.$refs.tree.getCheckedKeys()
      // 3. 合并半选和全选状态的id值，得到完整的数组
      const keys = [...k1, ...k2]
      // 4. 调用数组的 join 方法，得到 以 , 分割的 字符串
      const idstr = keys.join(',')
      // 5. 请求API接口保存最新的权限
      const { data: res } = await this.$http.post(`roles/${this.selectedRoleId}/rights`, {
        rids: idstr
      })
      if (res.meta.status !== 200) return this.$message.error('更新权限失败！')
      this.$message.success('更新权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
