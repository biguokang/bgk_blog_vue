import {GET_NEWS_LIST, OPEN_INFO_SHOW, CLOSE_INFO_SHOW, OPEN_MONEY_SHOW, CLOSE_MONEY_SHOW} from './mutation-types'
import Vue from 'vue'
const Http = new Vue()
const home = {
  state: {
    newslist: [],
    infoShow: false,
    moneyShow: false
  },
  mutations: {
    [GET_NEWS_LIST] (state, data) {
      state.newslist = data
    },
    [OPEN_INFO_SHOW] (state) {
      state.infoShow = true
    },
    [CLOSE_INFO_SHOW] (state) {
      state.infoShow = false
    },
    [OPEN_MONEY_SHOW] (state) {
      state.moneyShow = true
    },
    [CLOSE_MONEY_SHOW] (state) {
      state.moneyShow = false
    }
  },
  actions: {
    async getNewsList (context) {
      let res = await Http.$http.get('/apis/homeArticleList')
      await console.log('---' + res + '---')
      await context.commit(GET_NEWS_LIST, res.body)
    }
  }
}
export default home