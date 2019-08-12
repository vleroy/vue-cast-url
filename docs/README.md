## Constants

<dl>
<dt><a href="#DEFAULT_OPTIONS">DEFAULT_OPTIONS</a> : <code>Object</code></dt>
<dd><p>Default options used when they are not provided on plugin installation</p>
</dd>
<dt><a href="#$cast">$cast</a></dt>
<dd><p>CastPlugin available in Vue instance</p>
</dd>
</dl>

<a name="DEFAULT_OPTIONS"></a>

## DEFAULT\_OPTIONS : <code>Object</code>
Default options used when they are not provided on plugin installation

**Kind**: global constant  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| receiverApplicationId | <code>String</code> | <code>5CB45E5A</code> | Receiver Application ID |
| lazyLoading | <code>Boolean</code> | <code>true</code> | When true, the Chromecast SDK will not be automatically downloaded |
| className | <code>String</code> | <code>google-cast-btn</code> | The class name of the Google Cast Button |
| chromecastSdkUrl | <code>String</code> | <code>//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework&#x3D;1</code> | Chromecast SDK script URL |

* * *

<a name="$cast"></a>

## $cast
CastPlugin available in Vue instance

**Kind**: global constant  

* [$cast](#$cast)
    * [.state](#$cast.state) : <code>State</code>
    * [.States](#$cast.States) : <code>enum</code>
    * [.Types](#$cast.Types) : <code>enum</code>
    * [.send(url, type)](#$cast.send)

* * *

<a name="$cast.state"></a>

### $cast.state : <code>State</code>
Current plugin's state

**Kind**: static property of [<code>$cast</code>](#$cast)  

* * *

<a name="$cast.States"></a>

### $cast.States : <code>enum</code>
Enum for connection states

**Kind**: static enum of [<code>$cast</code>](#$cast)  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| CREATED | <code>String</code> | not installed |
| LOADING | <code>String</code> | fetching Chromecast SDK and initializing plugin |
| READY | <code>String</code> | everything is ready to cast |

* * *

<a name="$cast.Types"></a>

### $cast.Types : <code>enum</code>
Ways to send URL to Chromecast receiver application

**Kind**: static enum of [<code>$cast</code>](#$cast)  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| IFRAME | <code>String</code> | website is displayed in an iframe. It keeps the connection to chromecast |
| LOCATION | <code>String</code> | Chromecast location is replaced and connection is lost |

* * *

<a name="$cast.send"></a>

### $cast.send(url, type)
Send an URL to connected Chromecast

**Kind**: static method of [<code>$cast</code>](#$cast)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | URL of the website to load |
| type | <code>String</code> | <code>Types.IFRAME</code> | way to load the URL |

* * *

