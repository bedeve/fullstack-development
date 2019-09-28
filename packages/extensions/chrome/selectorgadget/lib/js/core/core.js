/**
 * @file
 * SelectorGadget Core Class.
 */

import DomPredictionHelper from './prediction';

import jQuerySG from './init';
import util from 'util';
import events from 'events';
const EventEmitter = events.EventEmitter;

// For non-node environments.
// @todo: move to init file
if (typeof window != 'undefined') window.jQuerySG = jQuerySG;

/**
 * SelectorGadget constructor.
 */
class SelectorGadget extends EventEmitter {
  constructor() {

    super();

    // Define properties defaults.
    this.border_width = 5;
    this.border_padding = 2;
    this.b_top = null;
    this.b_left = null;
    this.b_right = null;
    this.b_bottom = null;
    this.selected = [];
    this.rejected = [];
    this.special_mode = null;
    this.path_output_field = null;
    this.sg_div = null;
    this.ignore_class = 'selectorgadget_ignore';
    this.unbound = false;
    this.prediction_helper = new DomPredictionHelper();
    this.individualMatch = false;
    this.individualSelectors = [];

    this.restricted_elements = ['html', 'body', 'head', 'base'].map(tag => document.getElementsByTagName(tag)[0]).filter(elem => elem ? true : false);
  }

  makeBorders(orig_elem, makeRed) {
    let elem;
    let height;
    let left;
    let p;
    let path_to_show;
    let top;
    let width;
    this.removeBorders();
    this.setupBorders();
    if (orig_elem.parentNode) {
      path_to_show = `${orig_elem.parentNode.tagName.toLowerCase()} ${orig_elem.tagName.toLowerCase()}`;
    } else {
      path_to_show = orig_elem.tagName.toLowerCase();
    }
    elem = jQuerySG(orig_elem);
    p = elem.offset();
    top = p.top;
    left = p.left;
    width = elem.outerWidth();
    height = elem.outerHeight();
    this.b_top.css('width', this.px(width + this.border_padding * 2 + this.border_width * 2)).css('top', this.px(top - this.border_width - this.border_padding)).css('left', this.px(left - this.border_padding - this.border_width));
    this.b_bottom.css('width', this.px(width + this.border_padding * 2 + this.border_width * 2 - 5)).css('top', this.px(top + height + this.border_padding)).css('left', this.px(left - this.border_padding - this.border_width)).text(path_to_show);
    this.b_left.css('height', this.px(height + this.border_padding * 2)).css('top', this.px(top - this.border_padding)).css('left', this.px(left - this.border_padding - this.border_width));
    this.b_right.css('height', this.px(height + this.border_padding * 2)).css('top', this.px(top - this.border_padding)).css('left', this.px(left + width + this.border_padding));
    this.b_right.get(0).target_elem = this.b_left.get(0).target_elem = this.b_top.get(0).target_elem = this.b_bottom.get(0).target_elem = orig_elem;
    if (makeRed || elem.hasClass("selectorgadget_suggested") || elem.hasClass("selectorgadget_selected")) {
      this.b_top.addClass('selectorgadget_border_red');
      this.b_bottom.addClass('selectorgadget_border_red');
      this.b_left.addClass('selectorgadget_border_red');
      this.b_right.addClass('selectorgadget_border_red');
    } else {
      if (this.b_top.hasClass('selectorgadget_border_red')) {
        this.b_top.removeClass('selectorgadget_border_red');
        this.b_bottom.removeClass('selectorgadget_border_red');
        this.b_left.removeClass('selectorgadget_border_red');
        this.b_right.removeClass('selectorgadget_border_red');
      }
    }
    return this.showBorders();
  }

  px(p) {
    return `${p}px`;
  }

  showBorders() {
    this.b_top.show();
    this.b_bottom.show();
    this.b_left.show();
    return this.b_right.show();
  }

  removeBorders() {
    if (this.b_top) {
      this.b_top.hide();
      this.b_bottom.hide();
      this.b_left.hide();
      return this.b_right.hide();
    }
  }

  setupBorders() {
    let width;
    if (!this.b_top) {
      width = `${this.border_width}px`;
      this.b_top = jQuerySG('<div>').addClass('selectorgadget_border').css('height', width).hide().bind("mousedown.sg", {
        'self': this
      }, this.sgMousedown);
      this.b_bottom = jQuerySG('<div>').addClass('selectorgadget_border').addClass('selectorgadget_bottom_border').css('height', this.px(this.border_width + 6)).hide().bind("mousedown.sg", {
        'self': this
      }, this.sgMousedown);
      this.b_left = jQuerySG('<div>').addClass('selectorgadget_border').css('width', width).hide().bind("mousedown.sg", {
        'self': this
      }, this.sgMousedown);
      this.b_right = jQuerySG('<div>').addClass('selectorgadget_border').css('width', width).hide().bind("mousedown.sg", {
        'self': this
      }, this.sgMousedown);
      return this.addBorderToDom();
    }
  }

  addBorderToDom() {
    document.body.appendChild(this.b_top.get(0));
    document.body.appendChild(this.b_bottom.get(0));
    document.body.appendChild(this.b_left.get(0));
    return document.body.appendChild(this.b_right.get(0));
  }

  removeBorderFromDom() {
    if (this.b_top) {
      this.b_top.remove();
      this.b_bottom.remove();
      this.b_left.remove();
      this.b_right.remove();
      return this.b_top = this.b_bottom = this.b_left = this.b_right = null;
    }
  }

  selectable(elem) {
    return !this.css_restriction || (this.css_restriction && jQuerySG(elem).is(this.css_restriction));
  }

  sgMouseover(e) {
    let gadget;
    let parent;
    let self;
    gadget = e.data.self;
    if (gadget.unbound) {
      return true;
    }
    if (this === document.body || this === document.body.parentNode) {
      return false;
    }
    self = jQuerySG(this);
    gadget.unhighlightIframes();
    if (self.is("iframe")) {
      gadget.highlightIframe(self, e);
    }
    if (gadget.special_mode !== 'd') {
      parent = gadget.firstSelectedOrSuggestedParent(this);
      if (parent !== null && parent !== this && gadget.selectable(parent)) {
        gadget.makeBorders(parent, true);
      } else {
        if (gadget.selectable(self)) {
          gadget.makeBorders(this);
        }
      }
    } else {
      if (!jQuerySG('.selectorgadget_selected', this).get(0)) {
        if (gadget.selectable(self)) {
          gadget.makeBorders(this);
        }
      }
    }
    return false;
  }

  firstSelectedOrSuggestedParent(elem) {
    let orig;
    orig = elem;
    if (jQuerySG(elem).hasClass('selectorgadget_suggested') || jQuerySG(elem).hasClass('selectorgadget_selected')) {
      return elem;
    }
    while (elem.parentNode && (elem = elem.parentNode)) {
      if (jQuerySG.inArray(elem, this.restricted_elements) === -1) {
        if (jQuerySG(elem).hasClass('selectorgadget_suggested') || jQuerySG(elem).hasClass('selectorgadget_selected')) {
          return elem;
        }
      }
    }
    return null;
  }

  sgMouseout({data}) {
    let elem;
    let gadget;
    gadget = data.self;
    if (gadget.unbound) {
      return true;
    }
    if (this === document.body || this === document.body.parentNode) {
      return false;
    }
    elem = jQuerySG(this);
    gadget.removeBorders();
    return false;
  }

  highlightIframe(elem, click) {
    let block;
    let e;
    let instructions;
    let p;
    let self;
    let src;
    let target;
    p = elem.offset();
    self = this;
    target = jQuerySG(click.target);
    block = jQuerySG('<div>').css('position', 'absolute').css('z-index', '99998').css('width', this.px(elem.outerWidth())).css('height', this.px(elem.outerHeight())).css('top', this.px(p.top)).css('left', this.px(p.left)).css('background-color', '#AAA').css('opacity', '0.6').addClass("selectorgadget_iframe").addClass('selectorgadget_clean');
    instructions = jQuerySG("<div><span>This is an iframe.  To select in it, </span></div>").addClass("selectorgadget_iframe_info").addClass("selectorgadget_iframe").addClass('selectorgadget_clean');
    instructions.css({
      width: "200px",
      border: "1px solid #888"
    }, {
      padding: "5px",
      "background-color": "white",
      position: "absolute",
      "z-index": "99999",
      top: this.px(p.top + (elem.outerHeight() / 4.0)),
      left: this.px(p.left + (elem.outerWidth() - 200) / 2.0),
      height: "150px"
    });
    src = null;
    try {
      src = elem.contents().get(0).location.href;
    } catch (_error) {
      e = _error;
      src = elem.attr("src");
    }
    instructions.append(jQuerySG("<a target='_top'>click here to open it</a>").attr("href", src));
    instructions.append(jQuerySG("<span>, then relaunch SelectorGadget.</span>"));
    document.body.appendChild(instructions.get(0));
    block.click(() => {
      if (self.selectable(target)) {
        return target.mousedown();
      }
    });
    return document.body.appendChild(block.get(0));
  }

  unhighlightIframes(elem, click) {
    return jQuerySG(".selectorgadget_iframe").remove();
  }

  sgMousedown({data}) {
    let elem;
    let gadget;
    let potential_elem;
    let prediction;
    let w_elem;
    gadget = data.self;
    if (gadget.unbound) {
      return true;
    }
    elem = this;
    w_elem = jQuerySG(elem);
    if (w_elem.hasClass('selectorgadget_border')) {
      elem = elem.target_elem || elem;
      w_elem = jQuerySG(elem);
    }
    if (elem === document.body || elem === document.body.parentNode) {
      return;
    }
    if (gadget.special_mode !== 'd') {
      potential_elem = gadget.firstSelectedOrSuggestedParent(elem);
      if (potential_elem !== null && potential_elem !== elem) {
        elem = potential_elem;
        w_elem = jQuerySG(elem);
      }
    } else {
      if (jQuerySG('.selectorgadget_selected', this).get(0)) {
        gadget.blockClicksOn(elem);
      }
    }
    if (!gadget.selectable(w_elem)) {
      gadget.removeBorders();
      gadget.blockClicksOn(elem);
      return false;
    }
    if (w_elem.hasClass('selectorgadget_selected')) {
      w_elem.removeClass('selectorgadget_selected');
      if (gadget.individualMatch) {
        gadget.individualSelectors.splice(jQuerySG.inArray(elem, gadget.selected), 1);
      }
      gadget.selected.splice(jQuerySG.inArray(elem, gadget.selected), 1);
    } else if (w_elem.hasClass("selectorgadget_rejected")) {
      w_elem.removeClass('selectorgadget_rejected');
      gadget.rejected.splice(jQuerySG.inArray(elem, gadget.rejected), 1);
    } else if (w_elem.hasClass("selectorgadget_suggested")) {
      w_elem.addClass('selectorgadget_rejected');
      gadget.rejected.push(elem);
    } else {
      w_elem.addClass('selectorgadget_selected');
      gadget.selected.push(elem);
      if (gadget.individualMatch) {
        const inPrediction = gadget.individualMatchPredict(elem);
        gadget.individualSelectors.push(inPrediction);
      }
    }

    if (gadget.individualMatch) {
      prediction = gadget.individualSelectors.join(', ');
    } else {
      gadget.clearSuggested();
      prediction = gadget.prediction_helper.predictCss(jQuerySG(gadget.selected), jQuerySG(gadget.rejected.concat(gadget.restricted_elements)));
      gadget.suggestPredicted(prediction);
    }

    gadget.setPath(prediction);
    gadget.removeBorders();
    gadget.blockClicksOn(elem);
    w_elem.trigger("mouseover.sg", {
      'self': gadget
    });
    return false;
  }

  individualMatchPredict(element) {
    const self = this;
    const inRejected = [];
    const elements = [];
    let inPrediction;
    let suggests;

    elements.push(element)

    do {
      if (suggests) {
        suggestIndexElement = Math.floor(Math.random() * (suggests.length));
        inRejected.push(suggests[suggestIndexElement]);
      }

      self.clearSuggested();
      inPrediction = self.prediction_helper.predictCss(jQuerySG(elements), jQuerySG(inRejected.concat(self.restricted_elements)));
      self.suggestPredicted(inPrediction);
      suggests = jQuerySG('.selectorgadget_suggested');

    } while (suggests.length);

    return inPrediction;
  }

  setupEventHandlers() {
    jQuerySG("*:not(.selectorgadget_ignore)").bind("mouseover.sg", {
      'self': this
    }, this.sgMouseover);
    jQuerySG("*:not(.selectorgadget_ignore)").bind("mouseout.sg", {
      'self': this
    }, this.sgMouseout);
    jQuerySG("*:not(.selectorgadget_ignore)").bind("mousedown.sg", {
      'self': this
    }, this.sgMousedown);
    jQuerySG("html").bind("keydown.sg", {
      'self': this
    }, this.listenForActionKeys);
    return jQuerySG("html").bind("keyup.sg", {
      'self': this
    }, this.clearActionKeys);
  }

  refreshEventHandlers() {
    jQuerySG("*:not(.selectorgadget_ignore)").unbind(".sg");
    jQuerySG("html").unbind(".sg");

    this.setupEventHandlers();
  }

  removeEventHandlers() {
    jQuerySG("*:not(.selectorgadget_ignore)").unbind(".sg");
    jQuerySG("html").unbind(".sg");
  }

  listenForActionKeys({data, keyCode}) {
    let gadget;
    gadget = data.self;
    if (gadget.unbound) {
      return true;
    }
    if (keyCode === 16 || keyCode === 68) {
      gadget.special_mode = 'd';
      return gadget.removeBorders();
    }
  }

  clearActionKeys({data}) {
    let gadget;
    gadget = data.self;
    if (gadget.unbound) {
      return true;
    }
    gadget.removeBorders();
    return gadget.special_mode = null;
  }

  blockClicksOn(elem) {
    let block;
    let p;
    elem = jQuerySG(elem);
    p = elem.offset();
    block = jQuerySG('<div>').css('position', 'absolute').css('z-index', '9999999').css('width', this.px(elem.outerWidth())).css('height', this.px(elem.outerHeight())).css('top', this.px(p.top)).css('left', this.px(p.left)).css('background-color', '');
    document.body.appendChild(block.get(0));
    setTimeout((() => block.remove()), 400);
    return false;
  }

  setMode(mode) {
    if (mode === 'browse') {
      this.removeEventHandlers();
    } else if (mode === 'interactive') {
      this.setupEventHandlers();
    }
    return this.clearSelected();
  }

  suggestPredicted(prediction) {
    let count;
    if (prediction && prediction !== '') {
      count = 0;
      jQuerySG(prediction).each(function() {
        count += 1;
        if (!jQuerySG(this).hasClass('selectorgadget_selected') && !jQuerySG(this).hasClass('selectorgadget_ignore') && !jQuerySG(this).hasClass('selectorgadget_rejected')) {
          return jQuerySG(this).addClass('selectorgadget_suggested');
        }
      });
      if (this.clear_button) {
        if (count > 0) {
          return this.clear_button.attr('value', `Clear (${count})`);
        } else {
          return this.clear_button.attr('value', 'Clear');
        }
      }
    }
  }

  setPath(prediction) {
    if (prediction && prediction.length > 0) {
      this.path_output_field.value = prediction;
    } else {
      this.path_output_field.value = 'No valid path found.';
    }

    this.emit('selector', this.path_output_field.value);
  }

  refreshFromPath(e) {
    let path;
    let self;
    self = (e && e.data && e.data.self) || this;
    path = self.path_output_field.value;
    self.clearSelected();
    self.suggestPredicted(path);
    return self.setPath(path);
  }

  showXPath(e) {
    let path;
    let self;
    self = (e && e.data && e.data.self) || this;
    path = self.path_output_field.value;
    if (path === 'No valid path found.') {
      return;
    }
    return prompt(`The CSS selector '${path}' as an XPath is shown below.  Please report any bugs that you find with this converter.`, self.prediction_helper.cssToXPath(path));
  }

  clearSelected(e) {
    let self;
    self = (e && e.data && e.data.self) || this;
    self.selected = [];
    self.individualSelectors = [];
    self.rejected = [];
    jQuerySG('.selectorgadget_selected').removeClass('selectorgadget_selected');
    jQuerySG('.selectorgadget_rejected').removeClass('selectorgadget_rejected');
    self.removeBorders();
    return self.clearSuggested();
  }

  clearEverything(e) {
    let self;
    self = (e && e.data && e.data.self) || this;
    self.clearSelected();
    return self.resetOutputs();
  }

  resetOutputs() {
    return this.setPath();
  }

  clearSuggested() {
    jQuerySG('.selectorgadget_suggested').removeClass('selectorgadget_suggested');
    if (this.clear_button) {
      return this.clear_button.attr('value', 'Clear');
    }
  }

  showHelp() {
    return alert("Click on a page element that you would like your selector to match (it will turn green). SelectorGadget will then generate a minimal CSS selector for that element, and will highlight (yellow) everything that is matched by the selector. Now click on a highlighted element to reject it (red), or click on an unhighlighted element to add it (green). Through this process of selection and rejection, SelectorGadget helps you to come up with the perfect CSS selector for your needs.\n\nHolding 'shift' while moving the mouse will let you select elements inside of other selected elements.");
  }

  useRemoteInterface() {
    return window.sg_options && window.sg_options.remote_interface;
  }

  updateRemoteInterface(data_obj) {
    return this.addScript(this.composeRemoteUrl(window.sg_options.remote_interface, data_obj));
  }

  composeRemoteUrl(url, data_obj) {
    let key;
    let params;
    params = (url.split("?")[1] && url.split("?")[1].split("&")) || [];
    params.push(`t=${(new Date()).getTime()}`);
    params.push(`url=${encodeURIComponent(window.location.href)}`);
    if (data_obj) {
      for (key in data_obj) {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(data_obj[key])}`);
      }
    }
    if (this.remote_data) {
      for (key in this.remote_data) {
        params.push(`${encodeURIComponent(`data[${key}]`)}=${encodeURIComponent(this.remote_data[key])}`);
      }
    }
    return `${url.split("?")[0]}?${params.join("&")}`;
  }

  addScript(src) {
    let head;
    let s;
    s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', src);
    head = document.getElementsByTagName('head')[0];
    if (head) {
      return head.appendChild(s);
    } else {
      return document.body.appendChild(s);
    }
  }

  makeInterface() {
    this.sg_div = jQuerySG('<div>').attr('id', 'selectorgadget_main').addClass('selectorgadget_bottom').addClass('selectorgadget_ignore');
    if (this.useRemoteInterface()) {
      this.path_output_field = {
        value: null
      };
      this.remote_data = {};
      this.updateRemoteInterface();
    } else {
      this.makeStandardInterface();
    }
    return jQuerySG('body').append(this.sg_div);
  }

  makeStandardInterface() {
    let path;
    let self;
    self = this;
    path = jQuerySG('<input>').attr('id', 'selectorgadget_path_field').addClass('selectorgadget_ignore').addClass('selectorgadget_input_field').keydown(e => {
      if (e.keyCode === 13) {
        return self.refreshFromPath(e);
      }
    }).focus(function() {
      return jQuerySG(this).select();
    });
    this.sg_div.append(path);
    this.clear_button = jQuerySG('<input type="button" value="Clear"/>').bind("click", {
      'self': this
    }, this.clearEverything).addClass('selectorgadget_ignore').addClass('selectorgadget_input_field');
    this.sg_div.append(this.clear_button);
    this.sg_div.append(jQuerySG('<input type="button" value="Toggle Position"/>').click(() => {
      if (self.sg_div.hasClass('selectorgadget_top')) {
        return self.sg_div.removeClass('selectorgadget_top').addClass('selectorgadget_bottom');
      } else {
        return self.sg_div.removeClass('selectorgadget_bottom').addClass('selectorgadget_top');
      }
    }).addClass('selectorgadget_ignore').addClass('selectorgadget_input_field'));
    this.sg_div.append(jQuerySG('<input type="button" value="XPath"/>').bind("click", {
      'self': this
    }, this.showXPath).addClass('selectorgadget_ignore').addClass('selectorgadget_input_field'));
    this.sg_div.append(jQuerySG('<input type="button" value="?"/>').bind("click", {
      'self': this
    }, this.showHelp).addClass('selectorgadget_ignore').addClass('selectorgadget_input_field'));
    this.sg_div.append(jQuerySG('<input type="button" value="X"/>').bind("click", {
      'self': this
    }, this.unbindAndRemoveInterface).addClass('selectorgadget_ignore').addClass('selectorgadget_input_field'));
    return this.path_output_field = path.get(0);
  }

  removeInterface(e) {
    this.sg_div.remove();
    return this.sg_div = null;
  }

  unbind(e) {
    let self;
    self = (e && e.data && e.data.self) || this;
    self.unbound = true;
    self.removeBorderFromDom();
    return self.clearSelected();
  }

  unbindAndRemoveInterface(e) {
    let self;
    self = (e && e.data && e.data.self) || this;
    self.unbind();
    return self.removeInterface();
  }

  setOutputMode(e, output_mode) {
    let self;
    self = (e && e.data && e.data.self) || this;
    return self.output_mode = (e && e.data && e.data.mode) || output_mode;
  }

  rebind() {
    this.unbound = false;

    this.refreshEventHandlers();
    this.clearEverything();
    return this.setupBorders();
  }

  rebindAndMakeInterface() {
    this.makeInterface();
    return this.rebind();
  }

  randBetween(a, b) {
    return Math.floor(Math.random() * b) + a;
  }

  toggle(force) {
    if (!this.ready) {
      this.makeInterface();
      this.clearEverything();
      this.setMode('interactive');
      this.ready = true;
    } else {
      if ((typeof force == 'undefined' ? this.unbound : force)) {
        this.rebindAndMakeInterface();
      } else {
        this.unbindAndRemoveInterface();
      }
    }

    return jQuerySG('.selector_gadget_loading').remove();
  }

  toggleIndividualMatch(individualMatch) {
    this.individualMatch = individualMatch || !this.individualMatch;
  }
}

// Return one single instance.
export default new SelectorGadget();
