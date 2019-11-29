import _ from 'lodash'

export default {
  data() {
    return {
      // 被激活的页签的名称
      activeName: '0',
      // 所有商品的分类列表
      catelist: [],
      // 级联选择框中，数据的对应关系
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 添加商品的表单对象
      addForm: {
        goods_name: '', // 商品名称
        goods_price: '', // 商品价格
        goods_weight: '', // 商品重量
        goods_number: '', // 商品数量
        goods_cat: [], // 商品所属的分类
        goods_introduce: '', // 商品的描述
        pics: [], // 商品的图片
        attrs: [] // 商品的属性数组
      },
      // 添加商品的表单验证对象
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 所有的动态参数
      manyParams: [],
      // 所有的静态属性
      onlyParams: [],
      // 上传图片时候，要传递的请求头
      uploadHeader: {
        // 需要手动指定一个 Authorization
        Authorization: ''
      },
      // 控制图片预览窗口的显示与隐藏
      previewDialogVisible: false,
      // 图片预览的地址
      previewURL: ''
    }
  },
  created() {
    this.getCateList()
    // 从 sessionStorage 中获取 token 字符串
    // 把 token 字符串，交给 uploadHeader.Authorization 即可
    const tokenStr = sessionStorage.getItem('token')
    this.uploadHeader.Authorization = tokenStr
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.catelist = res.data
    },
    // 每当选中的分类变化，都会触发 这个事件的处理函数
    handleCateChanged() {
      // console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = []
      }
    },
    // 在离开当前 tab 页签之前，会触发这个方法
    beforeTabLeave() {
      // 在进入下一个页签之前，要确保，用户已经选择了商品分类
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    // 每当要预览图片的时候，会触发这个函数
    handlePreview(result) {
      // console.log(result)
      this.previewURL = result.response.data.url
      this.previewDialogVisible = true
    },
    // 每当要删除对应的图片，都会触发这个函数
    handleRemove(result) {
      // 根据要删除的图片的地址，找到 图片在 this.addForm.pics 数组中，
      // 所对应的 索引
      const index = this.addForm.pics.findIndex(x => x.pic === result.response.data.tmp_path)
      // 根据索引。把 表单中记录的图片信息对象，删除
      this.addForm.pics.splice(index, 1)
      // console.log(this.addForm)
    },
    // 每当图片上传成功，都会触发这个函数
    uploadSuccess(result) {
      // console.log(result)
      // 只要图片上传成功，都要 怼出这么一个对象：
      //  { pic: '图片的地址' }
      // 把怼出的对象，push 到this.addForm.pics 中
      const obj = { pic: result.data.tmp_path }
      this.addForm.pics.push(obj)
      // console.log(this.addForm)
    },
    // 点击按钮，添加商品
    addGoods() {
      // 1. 要把 addForm.goods_cat 从数组变成 字符串
      // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      // let form = this.addForm
      // form.goods_cat = form.goods_cat.join(',')
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      // console.log(form)

      // 2. 要把 动态参数 和 静态参数，处理一下，保存到 addForm.attrs 中
      this.manyParams.forEach(item => {
        // console.log(item)
        const o = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
        form.attrs.push(o)
      })

      this.onlyParams.forEach(item => {
        // console.log(item)
        const o = { attr_id: item.attr_id, attr_value: item.attr_vals }
        form.attrs.push(o)
      })
      // 3. 提交表单，完成添加
      // console.log(form)

      // 验证表单
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 注意：要添加的商品的名称，不能重复
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功！')
        // 添加完成，跳转到列表页面
        this.$router.push('/goods/list')
      })
    }
  },
  // 监视 数据的变化的
  watch: {
    // 监视 被激活的 tab 栏名称的变化
    async activeName(newVal, oldVal) {
      // 判断用户是否进入到了 动态参数面板
      if (newVal === '1') {
        // 只要进入到了这个 if 分支，
        // 则应该立即根据用户选择的 商品分类Id，
        // 获取分类下所有的 动态参数；
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败！')
        // 在把动态参数，赋值给 manyParams 之前，先对动态参数的数据，做一下 split 分割
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        // 把获取到的所有动态参数，保存到 data 上供页面使用
        this.manyParams = res.data
        // console.log(res.data)
      } else if (newVal === '2') {
        // 用户进入了 静态属性面板
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error('获取静态参数失败！')
        this.onlyParams = res.data
      }
    }
  }
}
