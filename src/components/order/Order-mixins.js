// 导入了省市区的数据
import cityData from '@/assets/city_data2017_element.js'

export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总记录条数
      total: 0,
      // 订单列表
      orderlist: [],
      // 控制 修改地址 对话框的显示与隐藏
      addressDialogVisible: false,
      addressForm: {
        // 省市区的数据
        address1: '',
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请填写省市区', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      // 省市区的数据
      cityData: cityData,
      // 控制 物流对话框的显示与隐藏
      wuliuDialogVisible: false,
      // 物流信息对象
      wuliuInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryinfo })

      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      // console.log(res)
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getOrderList()
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 点击按钮，显示 物流对话框
    async showWuliuDialog() {
      // 根据 物流运单号，获取到 物流信息
      const { data: res } = await this.$http.get('/kuaidi/619915933338')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败！')
      this.wuliuInfo = res.data

      this.wuliuDialogVisible = true
    }
  }
}
