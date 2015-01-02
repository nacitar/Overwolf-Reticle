function d(a,b){this.width=a;this.height=b}function e(a){this.id=a}e.prototype.element=function(){return this.id?document.getElementById(this.id):null};function f(a){if(a=a.element())switch(a.tagName){case "INPUT":switch(a.type){case "checkbox":return 1;case "radio":return 2;case "text":var b=a.classList;return a.color||b.contains("color")?3:0}break;case "SELECT":return 4}return null}e.prototype.get=function(){switch(f(this)){case 1:case 2:return Boolean(this.element().checked);case 0:case 4:case 3:return this.element().value}};
e.prototype.set=function(a){switch(f(this)){case 1:case 2:this.element().checked=Boolean(a);break;case 0:case 4:this.element().value=a;break;case 3:this.element().color.fromString(a)}};function g(a){return[].map.call((a||document).querySelectorAll("input,textarea,select"),function(a){return new e(a.id)}).filter(function(a){return null!=f(a)})}function h(a){var b={};a.forEach(function(a){null!=f(a)&&(this[a.id]=a.get())},b);return b}
function k(a,b){a.forEach(function(a){null!=f(a)&&b.hasOwnProperty(a.id)&&a.set(b[a.id])})}function l(a,b){return function(){return b.apply(a,arguments)}}function n(){this.data={}}n.prototype.getItem=function(a){return window.localStorage?window.localStorage.getItem(a):this.data[a]};n.prototype.setItem=function(a,b){window.localStorage?window.localStorage.setItem(a,b):this.data[a]=b};n.prototype.clear=function(){window.localStorage?window.localStorage.clear():this.data={}};var p=new n;
function q(a,b){this.m=a;this.s=b;this.d=g(this.element());this.d.forEach(function(a){null!=f(a)&&(a.element().onchange=l(this,this.c))},this);this.c()}q.prototype.c=function(){this.data=h(this.d);this.o&&this.o()};q.prototype.element=function(){return document.getElementById(this.s)};function r(a){t.element().style.display=a?"block":"none"}q.prototype.save=function(){var a=this.m;a&&p.setItem(a,JSON.stringify(this.data));console.log("Settings saved.")};
q.prototype.load=function(){var a;a:{if(a=this.m)if(a=p.getItem(a),null!=a){a=JSON.parse(a);break a}a=null}return a?(console.log("Settings loaded."),k(this.d,a),this.c(),!0):!1};function w(){return Boolean(window.overwolf)}var x=null,y=null;function z(a){x=a;y&&y()}function A(a){z({gameInfo:a,resolutionChanged:!0,focusChanged:!0,runningChanged:!0,gameChanged:!0})}function B(){var a=C;w()&&overwolf.windows.obtainDeclaredWindow("MainWindow",function(b){"success"===b.status?(b=b.window.id,(new RegExp("_MainWindow".replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")+"$")).test(b)&&(b=b.slice(0,-11)),a("MainWindow",b)):a("MainWindow",null)})}w()&&overwolf.games.onGameInfoUpdated.addListener(z);function D(a,b){switch(b){case 0:this.outline=a.circle();this.shape=a.circle();break;case 1:this.outline=a.rect();this.shape=a.rect();break;default:throw"Invalid shape specified to nx.svg.Shape constructor.";}this.type=b;this.p=0;this.outlineColor="#FF00FF"}function E(a,b,c){a=a.shape.attr(b);if(null==a)"undefined"==typeof c||(a=c);else if(/px$/.test(a)){if(c=parseFloat(a),a==c+"px")return c}else!isNaN(a)&&(a=parseFloat(a));return a}function F(a,b){b.add(a.outline,a.shape)}
function G(a){var b=0;"none"!=E(a,"stroke","none")&&(b=E(a,"strokeWidth",0));!(1!=a.type||E(a,"width",0)&&E(a,"height",0))||0==a.type&&!E(a,"r",0)?a.outline.attr({stroke:"none"}):(a.outline.attr({stroke:a.outlineColor}),a.outline.attr({strokeWidth:b+2*a.p}))}D.prototype.attr=function(a){if("string"==typeof a)return this.shape.attr(a);this.shape.attr(a);this.outline.attr(a);G(this);return this};function I(a,b,c){a.outlineColor=b;a.p=parseFloat(c);G(a)};var J;function K(a){this.n=a;this.a=Snap(this.element());this.b=this.a.group();this.cross=this.a.group();this.l=new D(this.a,0);F(this.l,this.b);this.f=new D(this.a,0);F(this.f,this.b);F(this.f,this.b);this.e=new D(this.a,1);F(this.e,this.b);F(this.e,this.b);this.b.add(this.cross);this.k=new D(this.a,1);F(this.k,this.cross);this.h=new D(this.a,1);F(this.h,this.cross);this.i=new D(this.a,1);F(this.i,this.cross);this.j=new D(this.a,1);F(this.j,this.cross);this.g=0}
K.prototype.element=function(){var a=document.getElementById(this.n);if(!a)throw"Could not find a SVG DOM Element with id of "+this.n;return a};function L(a){return a?"visible":"hidden"}function M(a,b){b%=360;a.cross.stop().attr({transform:"r"+b+",0,0"})}K.prototype.q=function(){M(this,0);this.cross.animate({transform:"r360,0,0"},this.g,l(this,this.q))};var N=null,t=null;
function O(){console.log("Rendering reticle.");var a=N,b=t.data,c;c=a.a.node.parentNode;c=new d(c.offsetWidth,c.offsetHeight);a.element().setAttribute("shape-rendering",b.shapeRendering);a.b.attr({opacity:b.opacity,transform:"t"+[c.width/2,c.height/2]});a.l.attr({r:b.circleDiameter/2,fill:"none",stroke:b.circleColor,visibility:L(b.circleEnabled),strokeWidth:b.circleThickness});I(a.l,b.circleStrokeColor,b.circleStrokeSize);c=b.centerDiameter/2;a.f.attr({r:c,fill:b.centerColor,visibility:L(b.centerEnabled&&
"circle"==b.centerShape)});I(a.f,b.centerStrokeColor,b.centerStrokeSize);a.e.attr({width:b.centerDiameter,height:b.centerDiameter,fill:b.centerColor,visibility:L(b.centerEnabled&&"square"==b.centerShape),transform:"t"+[-c,-c]});I(a.e,b.centerStrokeColor,b.centerStrokeSize);c=-b.crossLength-b.crossSpread;var u=-(b.crossThickness/2),v={fill:b.crossColor,visibility:L(b.crossEnabled)},H={width:b.crossThickness,height:b.crossLength},m={width:b.crossLength,height:b.crossThickness};a.k.attr(v).attr(H).attr({transform:"t"+
[u,c]});a.h.attr(v).attr(H).attr({transform:"t"+[u,b.crossSpread]});a.i.attr(v).attr(m).attr({transform:"t"+[c,u]});a.j.attr(v).attr(m).attr({transform:"t"+[b.crossSpread,u]});I(a.k,b.crossStrokeColor,b.crossStrokeSize);I(a.h,b.crossStrokeColor,b.crossStrokeSize);I(a.i,b.crossStrokeColor,b.crossStrokeSize);I(a.j,b.crossStrokeColor,b.crossStrokeSize);c=parseInt(b.crossSpinPeriod,10);c!=a.g&&(0<c?(a.g=c,a.q()):(a.g=0,M(a,b.crossRotation)))}function P(){console.log("Data changed.");O()}
function Q(){console.log("Window resized.");O()}function R(){var a,b;x&&x.gameInfo?(a=(x&&x.gameInfo).width,b=(x&&x.gameInfo).height):(a=window.screen.width,b=window.screen.height);var c=J;w()&&(overwolf.windows.changePosition(c,0,0),overwolf.windows.changeSize(c,a,b))}function C(a,b){"MainWindow"!=a||J||(J=b,y=R,w()&&overwolf.games.getRunningGameInfo(A))}
window.main={init:function(a,b,c){w()||(document.body.bgColor="black");N=new K(a);t=new q(b,c);t.d.forEach(function(a){if(3==f(a)){var b=a.element();b.color||(b.color=new jscolor.color(b));var b=b.color,c={hash:!0,pickerClosable:!0,onImmediateChange:l(t,t.c)},m;for(m in c)c.hasOwnProperty(m)&&(b[m]=c[m]);a.set(a.get())}});t.c();window.addEventListener("resize",Q);t.load();t.o=P;w()?(overwolf.settings.registerHotKey("reticle_menu",function(a){"success"==a.status&&(console.log("Reticle menu hotkey triggered."),
r(!0))}),B()):r(!0);O()},onDataChanged:P,save:function(){t.save()},load:function(){t.load()},hide:function(){w()&&r(!1)}};