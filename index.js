export default {

  install (Vue, opts) {
    const CAST_API_URL = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
    const States = {
      CREATED: 'created',
      LOADING: 'loading',
      READY: 'ready'
    }
    Object.freeze(States)
    const DEFAULT_OPTIONS = {
      receiverApplicationId: '5CB45E5A',
      lazyLoading: false,
      className: 'google-cast-btn'
    }
    opts = opts || {}
    Object.assign(opts, DEFAULT_OPTIONS)
    console.log(opts)

    const CastPlugin = {
      States,
      state: States.CREATED,
      _namespace: null,
      _session: null,
      _loadScript () {
        return new Promise((resolve, reject) => {
          if (this.state !== this.States.CREATED) {
            return resolve()
          }
          this.state = States.LOADING
          const el = document.createElement('script')
          el.setAttribute('src', CAST_API_URL)
          window['__onGCastApiAvailable'] = (isAvailable) => {
            if (isAvailable) {
              this._initialize()
              resolve()
            } else {
              reject()
            }
          }
          el.addEventListener('error', reject)
          document.body.appendChild(el)
        })
      },
      _initialize () {
        return new Promise((resolve, reject) => {
          this._addButton()

          opts = opts || {}
          this._namespace = opts.namespace || 'urn:x-cast:com.url.cast'

          const castContext = cast.framework.CastContext.getInstance()
          castContext.setOptions({
            receiverApplicationId: opts.receiverApplicationId || DEFAULT_OPTIONS.receiverApplicationId,
            autoJoinPolicy: opts.autoJoinPolicy || chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
          })

          const stateChanged = cast.framework.CastContextEventType.CAST_STATE_CHANGED
          castContext.addEventListener(stateChanged, event => {
            this.state = States.READY
            resolve()
          })
        })
			},
      _addButton () {
        let btnContainer = document.getElementsByClassName(opts.className)
        if (btnContainer.length === 0) {
          return console.warn(`Cannot find element with '${opts.className}' class`)
        }
        btnContainer = btnContainer[0]
        const castBtn = document.createElement('google-cast-launcher')
        btnContainer.appendChild(castBtn)
      },
      async _getSession () {
        if (!this._session) {
          await this._loadScript()
          this._session = cast.framework.CastContext.getInstance().getCurrentSession()
        }
        return this._session
      },
      send (url, type) {
        return new Promise((resolve, reject) => {
          type = type || 'iframe'
          if (!url) {
            throw new Error('You must provide an URL to cast as first argument')
          }
          const msg = {
            type,
            url
          }
          this._getSession().then(session => {
            session.sendMessage(this._namespace, msg, resolve, reject)
          })
        })
      }
    }

    if (!opts.lazyLoading) {
      CastPlugin._loadScript()
    }
    Vue.prototype.$cast = CastPlugin
  }
}
