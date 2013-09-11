pageUrlObj = 
  'baidu-music': '//fm.baidu.com/?embed'
  'desktop': '//yhui02.sinaapp.com/html-app/yoo-desktop/index.html'
  'calculator': '//yhui02.sinaapp.com/html-app/calculator/index.html'
  'evernote': '//www.evernote.com/Home.action'
  'baidu': '//www.baidu.com'

iframeHtml = (src) ->
  """<iframe border="0" style="width:100%;height:100%;border:0" src="#{src}"></iframe>"""

pageLoad = (url, type) ->
  containerObj = $('#page-content')
  containerObj.html 'loading...'
  if (type=='iframe')
    containerObj.html iframeHtml(url)
  else
    containerObj.load url


$ ->
  AppRouter = Backbone.Router.extend({
    routes:
      'home': 'home'
      'app/:name': 'app'
      'app/iframe/:name': 'appIframe'
  
    home: ->
      $('.page-header').hide().parent().removeClass('secondary')
      pageLoad('home.html')
  
    app: (name) ->
      $('.page-header').show().parent().addClass('secondary').find('h1 span').html(name)
      pageLoad(name+'.html')
    
    appIframe: (name) ->
      $('.page-header').show().parent().addClass('secondary').find('h1 span').html(name)
      pageLoad(pageUrlObj[name], 'iframe')
  })
  
  app_router = new AppRouter;
  Backbone.history.start({pushState: false, silent: false})
  
  window.goPage = (hash) ->
    app_router.navigate(hash, true)
  
  if (location.hash == '' || location.hash == '#')
    setTimeout(->
      goPage('home')
    , 400)
