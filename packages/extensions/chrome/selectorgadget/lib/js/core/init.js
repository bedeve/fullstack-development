let jQuerySG;
import jQuery from 'jquery';

export default jQuerySG = (function() {
  jQuerySG = undefined;
  jQuerySG = class jQuerySG {
    static initClass() {
      jQuerySG = jQuery.noConflict();
  
      jQuerySG.expr[":"].content = function(el, i, m) {
        const search = m[3];
        if (!search) { return false; }
        return jQuerySG.trim(jQuerySG(el).text().replace(/\s+/g, ' ')) === search;
      };
    }
  };
  jQuerySG.initClass();
  return jQuerySG;
})();