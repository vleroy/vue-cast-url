# vue-cast-url
Vue plugin to show your website on a chromecast with a single function.
This project is using the [URL Cast Receiver from DeMille](https://github.com/DeMille/url-cast-receiver)

## Setup
```bash
npm install --save vue-cast-url
```
```javascript
import Vue from 'vue'
import CastPlugin from 'vue-cast-url'

Vue.use(CastPlugin)
```

## Usage
```html
<div class="google-class-btn"></div>
```
The Google cast button will be append to this node.
```javascript
await this.$cast.send('https://demille.github.io/url-cast-receiver/')
```
