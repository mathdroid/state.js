function initStateJS(q){function p(t){if(t.length===1){return t[0]}throw"initial pseudo states must have one and only one outbound transition"}function a(t){var u=t.filter(function(v){return !v.isElse&&v.guard()});if(u.length>1){return u[(u.length-1)*Math.random()]}if(u.length===0){u=t.filter(function(v){return v.isElse})}if(u.length===1){return u[0]}throw"choice pseudo state has no valid outbound transition"}function c(u){var t=null;u.forEach(function(v){if(!v.isElse){if(v.guard()){if(t!==null){throw"junction PseudoState has multiple valid completion transitions"}t=v}}});if(t!==null){return t}u.forEach(function(v){if(v.isElse){if(t!==null){throw"junctiom PseudoState has multiple else completion transitions"}t=v}});if(t!==null){return t}throw"junction PseudoState has no valid competion transitions"}function r(u,t,v){if(!u.active){u.active=[]}u.active[t]=v}function d(u,t){if(u.active){return u.active[t]}}function g(u,t,v){if(!u.current){u.current=[]}u.current[t]=v}function i(u,t){if(u.current){return u.current[t]}}var f={Choice:{isInitial:false,isHistory:false,completions:a},DeepHistory:{isInitial:true,isHistory:true,completions:p},Initial:{isInitial:true,isHistory:false,completions:p},Junction:{isInitial:false,isHistory:false,completions:c},ShallowHistory:{isInitial:true,isHistory:true,completions:p},Terminate:{isInitial:false,isHistory:false,completions:null}};function m(u,t){this.name=u;this.owner=t}m.prototype.qualifiedName=function(){return this.owner?this.owner+"."+this.name:this.name};m.prototype.ancestors=function(){var t=this.owner?this.owner.ancestors():[];t.push(this);return t};m.prototype.beginExit=function(t){};m.prototype.endExit=function(t){console.log("Leave: "+this.toString());r(t,this,false)};m.prototype.beginEnter=function(t){if(d(t,this)){this.beginExit(t);this.endExit(t)}console.log("Enter: "+this.toString());r(t,this,true)};m.prototype.endEnter=function(u,t){};m.prototype.toString=function(){return this.qualifiedName()};function h(u,v,t){m.call(this,u,t);this.kind=v;this.completions=[];if(this.kind.isInitial){this.owner.initial=this}}h.prototype=new m();h.prototype.constructor=h;h.prototype.beginEnter=function(t){m.prototype.beginEnter.call(this,t);if(this.kind===f.Terminate){t.IsTerminated=true}};h.prototype.endEnter=function(u,t){this.kind.completions(this.completions).traverse(u,t)};function o(u,t){m.call(this,u,t);this.completions=[];this.transitions=[]}o.prototype=new m();o.prototype.constructor=o;o.prototype.isComplete=function(t){return true};o.prototype.endExit=function(t){if(this.exit){this.exit.forEach(function(u){u()})}m.prototype.endExit.call(this,t)};o.prototype.beginEnter=function(t){m.prototype.beginEnter.call(this,t);if(this.owner){g(t,this.owner,this)}if(this.entry){this.entry.forEach(function(u){u()})}};o.prototype.endEnter=function(v,u){if(this.isComplete(v)){var t=null;this.completions.forEach(function(w){if(w.guard()){if(t!==null){throw"more than one completion transition found"}t=w}});if(t!==null){t.traverse(v,u)}}};o.prototype.process=function(u,v){if(u.isTerminated){return false}var t=null;this.transitions.forEach(function(w){if(w.guard(v)){if(t!==null){throw"more than one transition found for message: "+v.toString()}t=w}});if(t!==null){t.traverse(u,v)}return t!==null};function k(u,t){o.call(this,u,t)}k.prototype=new o();k.prototype.constructor=k;k.prototype.isComplete=function(t){return t.isTerminated||i(t,this).isFinalState};k.prototype.beginExit=function(t){var u=i(t,this);if(u){u.beginExit(t);u.endExit(t)}};k.prototype.endEnter=function(u,t){var v=(t||this.initial.kind.isHistory?i(u,this):this.initial)||this.initial;v.beginEnter(u);v.endEnter(u,t||this.initial.kind===f.DeepHistory);o.prototype.endEnter.call(this,u,t)};k.prototype.process=function(t,u){if(t.isTerminated){return false}return o.prototype.process.call(this,t,u)||i(t,this).process(t,u)};function s(u,t){o.call(this,u,t);this.regions=[]}s.prototype=new o();s.prototype.constructor=s;s.prototype.isComplete=function(t){return t.isTerminated||this.regions.every(function(u){return u.isComplete(t)})};s.prototype.beginExit=function(t){this.regions.forEach(function(u){if(d(t,u)){u.beginExit(t);u.endExit(t)}})};s.prototype.endEnter=function(u,t){this.regions.forEach(function(v){v.beginEnter(u);v.endEnter(u,t)});o.prototype.endEnter.call(u,t)};s.prototype.process=function(t,u){if(t.isTerminated){return false}return o.prototype.process.call(this,t,u)||this.regions.reduce(function(v,w){return w.process(t,u)||v},false)};function l(u,t){o.call(this,u,t);this.isFinalState=true}l.prototype=new o();l.prototype.constructor=l;delete l.prototype.comlpetions;delete l.prototype.transitions;l.prototype.process=function(t,u){return false};function b(u,t){m.call(this,u,t);this.initial=null;if(this.owner){this.owner.regions.push(this)}}b.prototype=new m();b.prototype.constructor=b;b.prototype.isComplete=function(t){return t.isTerminated||i(t,this).isFinalState};b.prototype.initialise=function(t){this.beginEnter(t);this.endEnter(t,false)};b.prototype.beginExit=function(t){var u=i(t,this);if(u){u.beginExit(t);u.endExit(t)}};b.prototype.endEnter=function(u,t){var v=(t||this.initial.kind.isHistory?i(u,this):this.initial)||this.initial;v.beginEnter(u);v.endEnter(u,t||this.initial.kind===f.DeepHistory)};b.prototype.process=function(t,u){if(t.isTerminated){return false}return d(t,this)&&i(t,this).process(t,u)};function n(t){m.call(this,t);this.regions=[]}n.prototype=new m();n.prototype.constructor=n;n.prototype.isComplete=function(t){return t.isTerminated||this.regions.every(function(u){return u.isComplete(t)})};n.prototype.initialise=function(t){this.beginEnter(t);this.endEnter(t,false)};n.prototype.beginExit=function(t){this.regions.forEach(function(u){if(d(t,this)){u.beginExit(t);u.endExit(t)}})};n.prototype.endEnter=function(u,t){this.regions.forEach(function(v){v.beginEnter(u);v.endEnter(u,t)});m.prototype.endEnter.call(u,t)};n.prototype.process=function(t,u){if(t.isTerminated){return false}return this.regions.reduce(function(v,w){return w.process(t,u)||v},false)};function j(v,u){var t=0;while(v.length>t&&u.length>t&&v[t]===u[t]){t=t+1}return t-1}function e(u,v,t){this.guard=t||function(z){return true};if(v&&(v!==null)){var y=u.owner.ancestors(),x=v.owner.ancestors(),w=j(y,x);this.exit=y.slice(w+1);this.enter=x.slice(w+1);this.exit.reverse();this.source=u;this.target=v}u[t&&t.length>0?"transitions":"completions"].push(this)}e.prototype.traverse=function(t,u){if(this.exit){this.source.beginExit(t);this.source.endExit(t);this.exit.forEach(function(v){v.endExit(t)})}if(this.effect){this.effect.forEach(function(v){v(u)})}if(this.enter){this.enter.forEach(function(v){v.beginEnter(t)});this.target.beginEnter(t);this.target.endEnter(t,false)}};e.Else=function(t,u){e.call(this,t,u,function(){return false});this.isElse=true};e.Else.prototype=e.prototype;e.Else.prototype.constructor=e.Else;q.PseudoStateKind=f;q.PseudoState=h;q.SimpleState=o;q.CompositeState=k;q.OrthogonalState=s;q.FinalState=l;q.Region=b;q.StateMachine=n;q.Transition=e}if(this.exports){initStateJS(this.exports)}else{if(this.define){this.define(function(b,a,c){initStateJS(a)})}else{initStateJS(this)}};