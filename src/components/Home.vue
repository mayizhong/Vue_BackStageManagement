<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <router-link to="/welcome" style="text-decoration: none;">
        <div class="logo_tile">
        <img src="../assets/image/logo.jpg" alt="" height="70px">
        <h2>电商后台管理系统</h2>
      </div>
      </router-link>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 下面的主体区域 -->
    <el-container>
      <!-- 左侧的 menu 菜单 -->
      <el-aside :width="iscollapse ? '65px' : '200px'">
        <!-- 折叠展开menu的bar -->
        <div class="toggleBar" @click="iscollapse=!iscollapse">|||</div>
        <!-- menu 菜单 -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          router
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
          active-text-color="#409EFF">
          <!-- 循环创建一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, i) in menus"
            :key="item.id"
            :class="iscollapse ? 'el_submenu_small': 'el_submenu_large'">
            <template slot="title">
              <!-- 左侧的小图标 -->
              <i :class="['iconfont', iconlist[i]]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 循环创建 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <i class="el-icon-menu"></i>
              {{subitem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧的 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <span style="color: gray; position: fixed; bottom: 0; right: 0;">若有其他需求，请联系qq:532526447</span>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单列表数组，默认为空
      menus: [],
      // 左侧菜单项对应的图标数组
      iconlist: ['icon-users', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'],
      // 是否被折叠， 默认为 false
      iscollapse: false
    }
  },
  created() {
    this.getmenus()
  },
  methods: {
    // 点击按钮，退出登录
    logout() {
      // 清空保存的 token 信息
      window.sessionStorage.removeItem('token')
      // 强制跳转到登录页面
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    async getmenus() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取左侧菜单列表失败！')
      // 把获取到的菜单数据，保存到 data 的 menus 数组中，供页面使用
      this.menus = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  user-select: none;
  .logo_tile {
    display: flex;
    align-items: center;
    color: white;
    h2 {
      font-weight: 200;
      margin-left: 15px;
    }
  }
  .el-button {
    margin-right: 10px;
  }
}

.el-aside {
  background-color: #333744;
  user-select: none;
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 8px;
}

.toggleBar {
  color: #fff;
  font-size: 12px;
  line-height: 24px;
  background-color: #4a5064;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  user-select: none;
}

.el_submenu_large {
  width: 200px;
}
.el_submenu_small {
  width: 65px;
}
</style>
