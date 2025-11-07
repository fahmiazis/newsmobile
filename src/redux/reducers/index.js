/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';

import auth from './auth';
import news from './news';
import category from './category';
import bookmark from './bookmark';
import profile from './profile';
import article from './article';
import search from './search';
import pengadaan from './pengadaan'
import depo from './depo'
import user from './user'
import asset from './asset'
import approve from './approve'
import email from './email'
import tempmail from './tempmail'
import setuju from './setuju'
import dokumen from './dokumen'
import disposal from './disposal'
import stock from './stock'
import mutasi from './mutasi'
import notif from './notif'
import tracking from './tracking'
import report from './report'
import menu from './menu'
import newnotif from './newnotif'
import dashboard from './dashboard'

export default combineReducers({
  auth,
  news,
  category,
  bookmark,
  profile,
  article,
  search,
  pengadaan,
  depo,
  user,
  asset,
  email,
  tempmail,
  dokumen,
  disposal,
  approve,
  setuju,
  stock,
  mutasi,
  notif,
  tracking,
  report,
  menu,
  newnotif,
  dashboard
});
