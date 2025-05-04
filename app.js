require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');

const app = express();
const port = 3000;

// セッション設定
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// BASE APIの設定
const BASE_AUTH_URL = 'https://api.thebase.in/1/oauth/authorize';
const BASE_TOKEN_URL = 'https://api.thebase.in/1/oauth/token';
const BASE_API_URL = 'https://api.thebase.in/1';

// ホームページ
app.get('/', (req, res) => {
  if (!req.session.access_token) {
    res.send('<a href="/auth">BASEでログイン</a>');
  } else {
    res.send('<a href="/products">商品一覧を表示</a>');
  }
});

// 認証開始
app.get('/auth', (req, res) => {
  const authUrl = `${BASE_AUTH_URL}?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`;
  res.redirect(authUrl);
});

// コールバック処理
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  
  try {
    const response = await axios.post(BASE_TOKEN_URL, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.REDIRECT_URI
      }
    });

    req.session.access_token = response.data.access_token;
    res.redirect('/');
  } catch (error) {
    console.error('トークン取得エラー:', error.response?.data || error.message);
    res.send('認証エラーが発生しました');
  }
});

// 商品一覧取得
app.get('/products', async (req, res) => {
  if (!req.session.access_token) {
    return res.redirect('/');
  }

  try {
    const response = await axios.get(`${BASE_API_URL}/items/list`, {
      headers: {
        Authorization: `Bearer ${req.session.access_token}`
      }
    });

    const products = response.data.items;
    let html = '<h1>商品一覧</h1>';
    products.forEach(product => {
      html += `
        <div>
          <h2>${product.title}</h2>
          <p>価格: ${product.price}円</p>
          <p>在庫: ${product.stock}個</p>
          ${product.img1_origin ? `<img src="${product.img1_origin}" width="200">` : ''}
        </div>
      `;
    });

    res.send(html);
  } catch (error) {
    console.error('商品一覧取得エラー:', error.response?.data || error.message);
    res.send('商品一覧の取得に失敗しました');
  }
});

app.listen(port, () => {
  console.log(`アプリケーションが http://localhost:${port} で起動しました`);
}); 