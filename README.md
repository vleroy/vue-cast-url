# vue-cast-url
Vue plugin to show your website on a chromecast with a single function.
This project is using the [URL Cast Receiver from DeMille](https://github.com/DeMille/url-cast-receiver)

## Setup
```
npm install --save vue-cast-url
```
```
import Vue from 'vue'
import CastPlugin from 'vue-cast-url'

Vue.use(CastPlugin)
```

## Usage
```
<div class="google-class-btn"></div>
```
The Google cast button will be append to this node.
```
await this.$cast.send('https://demille.github.io/url-cast-receiver/')
```
