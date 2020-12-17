import {combineReducers} from 'redux'

import auth from './auth'
import news from './news'
import category from './category'
import bookmark from './bookmark'
import profile from './profile'
import article from './article'
import search from './search'

export default combineReducers({
  auth,
  news,
  category,
  bookmark,
  profile,
  article,
  search
})