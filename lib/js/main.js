document.addEventListener("DOMContentLoaded", function(event) {
	var styles = ['background: #3f51b5','color: white','display: block','text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)','box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);','line-height: 40px','text-align: center','font-weight: bold','padding: 10px','font-family: "Source Code Pro", sans-serif','font-size: 17px'].join(';');
	console.info("%c Copyright 2016 DeepSpace Development", styles);
	registerListeners();
});
window.onhashchange = function (){
	hashChange(window.location.hash);
}

function registerListeners(){
	qs('#js .topinfo').addEventListener("click", function(){
		toggleHiddenStatus(qs('#js'), true);
	});
	qs('#android .topinfo').addEventListener("click", function(){
		snackbar('Comming soon&trade;');
	});
	qs('#css .topinfo').addEventListener("click", function(){
		toggleHiddenStatus(qs('#css'), true);
	});
	qs('#html .topinfo').addEventListener("click", function(){
		toggleHiddenStatus(qs('#html'), true);
	});
	qs('#java .topinfo').addEventListener("click", function(){
		snackbar('Comming soon&trade;');
	});
	qs('#webapi .topinfo').addEventListener("click", function(){
		toggleHiddenStatus(qs('#webapi'), true);
	});
	qs('#svg .topinfo').addEventListener("click", function(){
		toggleHiddenStatus(qs('#svg'), true);
	});
	qs('#accessibility .topinfo').addEventListener("click", function(){
		toggleHiddenStatus(qs('#accessibility'), true);
	});
	qs('#webevents .topinfo').addEventListener("click", function(){
		toggleHiddenStatus(qs('#webevents'), true);
	});
}

/* Called by data.js */
function registerData(){
	qs('#innernav').style.display = 'flex';
	qs('#loadercontainer').style.display = 'none';
	for(var i = 0; i< javascript.length; i++){
		registerDataObject(javascript[i], qs('#js .childobject'), "JS");
	}
	for(var i = 0; i< webapi.length; i++){
		registerDataObject(webapi[i], qs('#webapi .childobject'), "WebAPI");
	}
	for(var i = 0; i< css.length; i++){
		registerDataObject(css[i], qs('#css .childobject'), "CSS");
	}
	for(var i = 0; i< html.length; i++){
		registerDataObject(html[i], qs('#html .childobject'), "HTML");
	}
	for(var i = 0; i< svg.length; i++){
		registerDataObject(svg[i], qs('#svg .childobject'), "SVG");
	}
	for(var i = 0; i< accessibility.length; i++){
		registerDataObject(accessibility[i], qs('#accessibility .childobject'), "Accessibility");
	}
	for(var i = 0; i< webevents.length; i++){
		registerDataObject(webevents[i], qs('#webevents .childobject'), "WebEvents");
	}
	hashChange(window.location.hash);
}

function hashChange(anchor){
	var hash = decodeURIComponent(anchor).split('~');
	var object = 
		hash[0] == '#JS' ? javascript : 
		hash[0] == '#WebAPI' ? webapi : 
		hash[0] == '#HTML' ? html :
		hash[0] == '#SVG' ? svg :
		hash[0] == '#WebEvents' ? webevents :
		hash[0] == '#Accessibility' ? accessibility :
		hash[0] == '#CSS' ? css : null;

	hash.shift(); //remove first
	
	var data = getData(object, hash);
	if(data != 'default'){
		//default --> data
		if(qs('#default').style.display != 'none'){
			$(qs('#default')).fadeOut(100, function(){
				qs('#data').innerHTML = data;
				$(qs('#data')).fadeIn(100);
			});
		}
		//data --> data
		else{
			$(qs('#data')).fadeOut(100, function(){
				qs('#data').innerHTML = data;
				$(qs('#data')).fadeIn(100);
			});
		}
	}
	else{
		//data --> default
		$(qs('#data')).fadeOut(100, function(){
			$(qs('#default')).fadeIn(100);
		});
	}
}

function registerDataObject(obj, parent, prefix){
	if(obj['data'] === undefined){
		var childHolder = document.createElement('div');
		var titleHolder = document.createElement('div');
		var title = document.createElement('div');
		var childs = document.createElement('div');
		var arrow = document.createElement('img');

		title.innerHTML = escapeHtml(obj.title);
		arrow.src = 'lib/icons/arrow_right.svg';

		title.classList.add('childtitle');
		arrow.classList.add('arrow');
		childHolder.classList.add('childholder');
		titleHolder.classList.add('childtitleholder');
		childs.classList.add('childchilds');

		titleHolder.addEventListener("click", function(){
			toggleHiddenStatus(childHolder);
		});

		titleHolder.appendChild(arrow);
		titleHolder.appendChild(title);

		childHolder.appendChild(titleHolder);
		childHolder.appendChild(childs);

		parent.appendChild(childHolder);

		for(var i = 0; i < obj.sub.length; i++){
			registerDataObject(obj.sub[i], childs, (prefix !== undefined ? prefix + '~' : '') + obj.title);
		}
	}
	else{
		var dataHolder = document.createElement('div');
		dataHolder.innerHTML = escapeHtml(obj.title);
		dataHolder.classList.add('data');
		dataHolder.addEventListener("click", function(){ 
			window.location.href = anchor((prefix !== undefined ? prefix + '~' : '') + obj.title);
		});
		parent.appendChild(dataHolder);
	}
}

function getData(object, hash){
	if(object == null) return 'default';
	for (var i = 0; i < object.length; i++) {
		if(object[i].title.replaceAll(' ', '') == hash[0]){
			hash.shift();
			if(hash.length != 0)
				return getData(object[i].sub, hash);
			return object[i].data;
		}
	}
}
function toggleHiddenStatus(obj, nav){
	if(nav){		
		if(obj.querySelector('.childobject').style.display == '' || obj.querySelector('.childobject').style.display == 'none'){
			$(obj.querySelector('.childobject')).slideDown();
			obj.querySelector('.arrow').src = 'lib/icons/arrow_down.svg';
		}
		else{
			$(obj.querySelector('.childobject')).slideUp();
			obj.querySelector('.arrow').src = 'lib/icons/arrow_right.svg';
		}
	}
	else{
		if(obj.querySelector('.childchilds').style.display == '' || obj.querySelector('.childchilds').style.display == 'none'){
			$(obj.querySelector('.childchilds')).slideDown(100);
			obj.querySelector('.arrow').src = 'lib/icons/arrow_down.svg';
		}
		else{
			$(obj.querySelector('.childchilds')).slideUp(100);
			obj.querySelector('.arrow').src = 'lib/icons/arrow_right.svg';
		}
	}
}
function qs(param){
	return document.querySelector(param);
}
function anchor(string){
	return '#' + string.replaceAll(" ", "");
}
function snackbar(message){
	qs('#snackbarmessage').innerHTML = message;
	$('#snackbar').animate({'bottom': 0}, 500).delay(1500).animate({'bottom': -100}, 500);
}
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};