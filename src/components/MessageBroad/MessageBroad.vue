<template>
  <div>
    <el-row>
    <h1 style="font-size: 40px">个人动态&&交流区：</h1><hr/>
    </el-row>

    <el-row>
      <el-col :span="4" :offset="1" v-if="loginFlag == false">
        <img src="../../images/who.jpg" width="100%" height="100%"/>
        <br/><br/>
        <el-form ref="login" :model="login" label-width="80px" label-position="top">
          <el-form-item label=" ">
            <el-input v-model="login.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model="login.pass" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" width="100%" size="medium" @click="login1" round>登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" :offset="1" v-else>
        <img :src="getAvator(this.user_data[0].avatar)" width="100%" height="100%"/>
        <br/><br/>
        <h3>{{this.user_data[0].username}}</h3>
        <h4>{{this.user_data[0].email}}</h4>
        <h5 style="color: grey; line-height: 1;">{{this.user_data[0].signature}}</h5>
        <el-button type="primary" width="100%" size="medium" @click="open_msg_show" round>写留言</el-button>
        <el-button type="info"
                   width="100%"
                   size="medium"
                   @click="()=>{
                   this.open_msginfo_show()
                   this.info.name = this.user_data[0].username
                   this.info.summary = this.user_data[0].signature
                   }
                           "
                   round>更改个人信息</el-button>
        <el-button type="danger" width="100%" size="medium" @click="logout1" round>注销</el-button>
      </el-col>
      <el-col :span="17" :offset="1">
        <div  v-for="item in message_data" :key="item.ID">
        <el-row>
          <el-col :span="2">
            <div style="float:left"><img :src="getAvator(item.user_avatar)" width="100%" height="100%"/></div>
          </el-col>
          <el-col :span="22">
            <div style="float:left; padding-left:15px;word-wrap:break-word; word-break:break-all; overflow: hidden;">
              <h3>{{item.user_name}}：</h3>
              <h4 style="line-height: 1;">{{item.message}}</h4>
              <p style="color:grey;font-size: 10px">发表于：{{item.push_time}}</p>
            </div>
          </el-col>
        </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="写留言" :visible.sync="msgShow" :before-close="close_msg_show">
      <el-form :model="message">
        <el-form-item label="正文" label-width="120px">
          <el-input type="textarea" v-model="message.text" auto-complete="off" height="150"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="publishmm(message.text)">发送</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更改信息" :visible.sync="infoShow" :before-close="close_msginfo_show">
      <el-form :model="info">
        <el-form-item label="更改用户名" label-width="120px">
            <el-input v-model="info.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="更改个性签名" label-width="120px">
          <el-input v-model="info.summary" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateUserInfo()">确定更改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import {OPEN_MSGINFO_SHOW, CLOSE_MSGINFO_SHOW, OPEN_MSG_SHOW, CLOSE_MSG_SHOW} from '../../store/mutation-types'
import forge from 'node-forge'
export default {
  name: 'MessageBroad',
  data () {
    return {
      login: {
        name: '',
        pass: ''
      },
      message: {
        text: ''
      },
      info: {
        name: '',
        summary: ''
      }
    }
  },
  methods: {
    ...mapMutations([OPEN_MSGINFO_SHOW], [CLOSE_MSGINFO_SHOW], [OPEN_MSG_SHOW], [CLOSE_MSG_SHOW]),
    ...mapActions(['getMessageList', 'getUserLoginState', 'logout1', 'publishMessage', 'logins', 'updateUserInfos']),
    open_msginfo_show () {
      this.$store.commit(OPEN_MSGINFO_SHOW)
    },
    close_msginfo_show () {
      this.$store.commit(CLOSE_MSGINFO_SHOW)
    },
    open_msg_show () {
      this.$store.commit(OPEN_MSG_SHOW)
    },
    close_msg_show () {
      this.$store.commit(CLOSE_MSG_SHOW)
    },
    publishmm (msgg) {
      let a = {
        id: this.user_data[0].ID,
        username: this.user_data[0].username,
        avatar: this.user_data[0].avatar,
        msg: msgg
      }
      this.publishMessage(a)
    },
    login1 () {
      let md = forge.md.md5.create()
      md.update('苟利国家生死以' + this.login.pass + '岂因祸福避趋之')
      this.login.pass = md.digest().toHex()
      let a = {
        username: this.login.name,
        password: this.login.pass
      }
      this.logins(a)
    },
    updateUserInfo () {
      let id = this.user_data[0].ID
      let avatar = this.user_data[0].avatar
      let a = {
        id: id,
        avatar: avatar,
        username: this.info.name,
        signature: this.info.summary
      }
      this.updateUserInfos(a)
    },
    getAvator (avatorString) {
      let avator
      switch (avatorString) {
        case 'alpaca1':avator = 'static/avatar/alpaca1.png'; break
        case 'alpaca2':avator = 'static/avatar/alpaca2.png'; break
        case 'alpaca3':avator = 'static/avatar/alpaca3.png'; break
        case 'alpaca4':avator = 'static/avatar/alpaca4.png'; break
        case 'alpaca5':avator = 'static/avatar/alpaca5.png'; break
        case 'alpaca6':avator = 'static/avatar/alpaca6.png'; break
        case 'pic_touxiang':avator = 'static/touxiang.png'; break
      }
      return avator
    }
  },
  computed: {
    ...mapState({
      msgShow: state => state.message.msgShow,
      infoShow: state => state.message.infoShow,
      message_data: state => state.message.message_data,
      loginFlag: state => state.message.loginFlag,
      user_data: state => state.message.user_data
    })
  },
  created () {
    this.getUserLoginState(this.info.name, this.info.summary)
  }
}
</script>

<style scoped>

</style>
