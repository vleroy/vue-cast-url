export default {

  install (Vue, opts) {
    const States = {
      CREATED: 'created',
      LOADING: 'loading',
      READY: 'ready'
    }
    Object.freeze(States)

    const Types = {
      IFRAME: 'iframe',
      LOCATION: 'loc'
    }
    Object.freeze(Types)

    /**
     * Default options used when they are not provided on plugin installation
     * @constant DEFAULT_OPTIONS {Object}
     * @property {String} receiverApplicationId=5CB45E5A Receiver Application ID
     * @property {Boolean} lazyLoading=true When true, the Chromecast SDK will not be automatically downloaded
     * @property {String} className=google-cast-btn The class name of the Google Cast Button
     * @property {String} chromecastSdkUrl=//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1 Chromecast SDK script URL
     */
    const DEFAULT_OPTIONS = {
      receiverApplicationId: '5CB45E5A',
      lazyLoading: false,
      className: 'google-cast-btn',
      chromecastSdkUrl: '//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
    }
    opts = opts || {}
    Object.assign(opts, DEFAULT_OPTIONS)

    /**
     * CastPlugin available in Vue instance
     * @alias $cast
     */
    const CastPlugin = {
      /**
       * Enum for connection states
       * @readonly
       * @enum {String}
       * @property {String} CREATED not installed
       * @property {String} LOADING fetching Chromecast SDK and initializing plugin
       * @property {String} READY everything is ready to cast
       */
      States,
      /**
       * Ways to send URL to Chromecast receiver application
       * @readonly
       * @enum {String}
       * @property {String} IFRAME website is displayed in an iframe. It keeps the connection to chromecast
       * @property {String} LOCATION Chromecast location is replaced and connection is lost
       */
      Types,
      /**
       * Current plugin's state
       * @type State
       */
      state: States.CREATED,
      /**
       * Chromecast namespace used when sending message
       * @type String
       * @private
       */
      _namespace: null,
      /**
       * Session used to send message
       * @type CastSession
       * @private
       */
      _session: null,
      /**
       * Loads Chromecast SDK and initialize plugin
       * @private
       * @returns {Promise}
       */
      _loadScript () {
        return new Promise((resolve, reject) => {
          if (this.state !== this.States.CREATED) {
            return resolve()
          }
          this.state = States.LOADING
          const el = document.createElement('script')
          el.setAttribute('src', opts.chromecastSdkUrl)
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
      /**
       * Initialize plugin and button using loaded Chromecast SDK
       * @returns Promise
       * @private
       */
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
      /**
       * Add Google Cast Launcher component in container
       * @private
       */
      _addButton () {
        let btnContainer = document.getElementsByClassName(opts.className)
        if (btnContainer.length === 0) {
          return console.warn(`Cannot find element with '${opts.className}' class`)
        }
        btnContainer = btnContainer[0]
        const castBtn = document.createElement('google-cast-launcher')
        btnContainer.appendChild(castBtn)
      },
      /**
       * Get current session or initialize it if needed
       * @returns {Promise<CastSession>}
       * @private
       */
      async _getSession () {
        if (!this._session) {
          await this._loadScript()
          this._session = cast.framework.CastContext.getInstance().getCurrentSession()
        }
        return this._session
      },
      /**
       * Send an URL to connected Chromecast
       * @param {String} url URL of the website to load
       * @param {String} type=Types.IFRAME way to load the URL
       */
      send (url, type) {
        return new Promise((resolve, reject) => {
          type = type || Types.IFRAME
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
