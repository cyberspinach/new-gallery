if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-datatable-footerview/gallery-datatable-footerview.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-datatable-footerview/gallery-datatable-footerview.js",
    code: []
};
_yuitest_coverage["build/gallery-datatable-footerview/gallery-datatable-footerview.js"].code=["YUI.add('gallery-datatable-footerview', function (Y, NAME) {",""," /**","  FooterView is a YUI View class extension that provides a simple, one row summary row","  to a Datatable. This view provides","  for a summary row appended to the bottom of the DataTable TBODY, typically consisting","  of **one** TH element (with a colspan) and several TD elements for each desired column","  where a \"calculated field\" is desired.","","  View configuration provides for calculated fields based upon the all of the available","  dataset fields within the DataTable's \"ModelList\".","","  The view works with either non-scrolling or scrolling DataTables, and allows for either a","  \"fixed\" view, wherein the footer remains fixed at the bottom of the DataTable contentBox","  while the table is scrolled.","","  #### Calculated Fields","","  The current implementation supports the following calculated fields, where they are","  identified by their placeholder tag for replacement via Y.sub (case insensitive);","","  * `{sum}` Calculate the arithmetic sum of the specified column in dataset","  * `{min}` Calculate the minimum value of the specified column in dataset","  * `{max}` Calculate the maximum value of the specified column in dataset","  * `{avg}` Calculate the arithmetic average of the of the specified column (synonyms `{mean}`, `{average}`)","","  Also, non-looping calcs are;","","  *  `{row_count}` Returns the number of rows in the dataset","  *  `{col_count}` Returns the number of columns in the dataset (no visibility check)","  *  `{date}` Returns the current date","  *  `{time}` Returns the current time","","  #### Configuration","","  YUI 3.6.0 DataTable supports attributes including `footerView` and `footerConfig`.","","  This FooterView recognizes the following attributes, which must be configured via the","  DataTable {configs} (see usage example below);","","  * [`fixed`](#attr_fixed) : Flag indicating if footer should be fixed or floating","  * [`heading`](#attr_heading) : Object, defining the single TH as;","     * [`colspan`](#attr_heading.colspan) : Number of columns to merge from left for the TH","     * [`content`](#attr_heading.content) : A string indicating the content of the TH for the footer","     * [`className`](#attr_heading.className) : Additional classname for TH","  * [`columns`](#attr_columns) : Array of objects, one per desired TD column in footer as;","     * [`key`](#attr_columns.key) : `key` name from the DataTable columns","     * [`content`](#attr_columns.content) : String indicating the contents of this TD","     * [`className`](#attr_columns.className) : Additional classname for TD","     * [`formatter`](#attr_columns.formatter) : Formatter to apply to this column result","  * [`dateFormat`](#attr_dateFormat) : Format string to use for any {date} fields","  * [`timeFormat`](#attr_timeFormat) : Format string to use for any {time} fields","","  Additionally the user can provide a valid function as a column `content` to calculate a","  custom entry for a column (see [`columns.content`](#attr_columns.content) or [`calcDatasetValue`](#method_calcDatasetValue))","","  #### Usage","","      var dtable = new Y.DataTable({","          columns:    ['EmpId','FirstName','LastName','NumClients','SalesTTM'],","          data:       AccountMgr.Sales,","          scrollable: 'y',","          height:     '250px',","          width:      '400px',","","          footerView:   Y.FooterView,","          footerConfig: {","              fixed:   true,","              heading: {","                  colspan:	3,","                  content:	\"Sales Totals for {row_count} Account Mgrs : &nbsp;\",","                  className:	\"align-right\"","              },","              columns: [","                  { key:'NumClients', content:\"{Avg} avg\", className:\"clientAvg\" },","                  { key:'SalesTTM',   content:\"{sum}\", className:\"salesTotal\", formatter:fmtCurrency }","              ]","          }","      });","","      dtable.render('#salesDT');","","","  @module gallery-datatable-footerview","  @class Y.FooterView","  @extends Y.View","  @author Todd Smith","  @since 3.6.0","  **/"," Y.FooterView = Y.Base.create( 'tableFooter', Y.View, [], {","","      /**","       Defines the default TD HTML template for a calculated field within the footer","       @property TMPL_td","       @type String","       @default '<td class=\"yui3-datatable-even {tdClass}\">{content}</td>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_td: '<td class=\"yui3-datatable-even {tdClass}\">{content}</td>',","","      /**","       Defines the default TH HTML template for the header content within the footer","       @property TMPL_th","       @type String","       @default '<th colspan=\"{colspan}\" class=\"{thClass}\">{content}</th>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_th: '<th colspan=\"{colspan}\" class=\"{thClass}\">{content}</th>',","","      /**","       Defines the default TR HTML template for the footer","       @property TMPL_tr","       @type String","       @default '<tr>{th_content}{td_content}</tr>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_tr:    '<tr>{th_content}{td_content}</tr>',","","      /**","       Defines the default TFOOT HTML template for the footer","       @property TMPL_tfoot","       @type String","       @default '<tfoot class=\"{footClass}\"><tr>{th_content}{td_content}</tr></tfoot>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_tfoot: '<tfoot class=\"{footClass}\"><tr>{th_content}{td_content}</tr></tfoot>',","","","      /**","       Defines the default TABLE HTML template for the \"fixed\" footer type ... i.e. with scrolling","       @property TMPL_table_fixed","       @type String","       @default '<table cellspacing=\"0\" aria-hidden=\"true\" class=\"{className}\"></table>'","       @static","       @since 3.6.0","       @protected","       **/","      TMPL_table_fixed: '<table cellspacing=\"0\" aria-hidden=\"true\" class=\"{className}\"></table>',","","","      dateFormat:  '%D',","      timeFormat:  '%T',","","      // replacer function","      fnReplace  : Y.Lang.sub,","","      /**","       Storage array of objects, each object represents a rendered \"cell or column\" within the","       footer view.  The first element is typically a TH element (with a colspan), and the","       remaining elements are the TD's for each requested footer field.","","       Created and populated by the render() method","","       @property node_cols","       @type Array of Object hashes","       @default null","       @static","       @since 3.6.0","       @protected","       **/","      node_cols : null,   // array of col_key map (e.g. '_head', null, 'f_name' )","","      /**","       Placeholder for subscriber event handles, used to destroy cleanly","       @property _subscr","       @type {EventHandles} Array of eventhandles","       @default null","       @static","       @since 3.6.0","       @private","       **/","      _subscr : null,","","      /**","       DataTable instance that utilizes this footerview, derived from initializer \"config.host\"","       Used to reference changes to DT modellist, and to retrieve the underlying \"data\"","","       @property _dt","       @type Y.DataTable","       @default null","       @static","       @since 3.6.0","       @private","       **/","      _dt: null,","","      /**","       * Called when view is initialized.  Stores reference to calling DataTable and","       *  creates listeners to link building or refreshing the footer back to the","       *  parent DataTable.","       *","       * @method initializer","       * @param {Object} config","       * @protected","       */","      initializer: function(config) {","          config = (config) ? config : {};","","          // Set a reference to the calling DataTable","          this._dt = ( config.source ) ? config.source :  config.host;    // reference to DT instance","","          // Setup listeners ...","          this._subscr = [];","","          //  ... For scrollable with fixed footer, we have to build a new TABLE and append outside of scrolling ...","          if ( config.footerConfig && config.footerConfig.fixed && this._dt.get('scrollable') ) {","              this._subscr.push( Y.Do.after( this._buildFixedFooter, this._dt, '_syncScrollUI', this._dt) );","          }","","          // Listen for changes on the DataTable \"data\" ...","          this._subscr.push( this._dt.data.after(['*:change','*:add','*:create', '*:remove', '*:reset'], Y.bind('refreshFooter', this) ) );","","      },","","      /**","       * Default destructor method, cleans up the listeners that were created and","       *  removes and/or empties the created DOM elements for the footerView.","       *","       * @method destructor","       * @protected","       */","      destructor: function () {","          Y.Array.each(this._subscr,function(item){","              item.detach();","          });","          this._dt._tfootNode.empty();","          if ( this._dt._yScrollFooter ) {","              this._dt._yScrollFooter.empty();","          }","      },","","","      /**","       * Creates the DOM elements and attaches them to the footerView container.","       *  Reads the configuration parameters (i.e. from DataTable's config as \"footerConfig\")","       *  and structures a single TR element, with a leading TH in first column, and the","       *  requested TD elements following.","       *","       * @method render","       * @public","       * @chainable","       * @return this","       */","      render: function(){","          var foot_cont = this.get('container'),      // reference to the TFOOT, created by DataTable","              table_obj = this._dt,                   // reference to the parent DataTable instance","              columns   = table_obj.get('columns'),   // reference to the ModelList / or DataTable.data","              rs_data   = table_obj.get(\"data\"),      // reference to the ModelList / or DataTable.data","              foot_cfg  = table_obj.get('footerConfig'),    // placeholder for the 'footer' config","              foot_cols = foot_cfg.columns,           // placeholder for the 'footer'.config.columns entry","              tfoot_th  = '',                         // the string for the TH node","              tfoot_td  = '',                         // the string for the TD node","              cspan     = 1,                          // colSpan entry for TH, default to 1","              replacer_obj, th_item, td_html, titem, trClass, tr, tr_tmpl, i;","","          this.node_cols = [];","","          //","          //  Initialize date and time formats","          //","          this.dateFormat = ( foot_cfg && foot_cfg.dateFormat ) ? foot_cfg.dateFormat","              : ( table_obj.get('dateFormat') ) ? table_obj.get('dateFormat')","              : this.dateFormat;","","          this.timeFormat = ( foot_cfg && foot_cfg.timeFormat ) ? foot_cfg.timeFormat","              : ( table_obj.get('timeFormat') ) ? table_obj.get('timeFormat')","              : this.timeFormat;","","          // define a default replacer object ...","          replacer_obj = {","              ROW_COUNT : rs_data.size(),","              COL_COUNT : columns.length,","              DATE:       Y.DataType.Date.format( new Date(), { format: this.dateFormat }),","              TIME:       Y.DataType.Date.format( new Date(), { format: this.timeFormat })","          };","          // duplicate above, for lowercase","          Y.Object.each(replacer_obj,function(val,key,obj){","              obj[ key.toLowerCase() ] = val;","          });","","          //","          //  Process the TH part","          //","          if ( foot_cfg.heading ) {","              cspan = foot_cfg.heading.colspan || cspan;","              tfoot_th = this.fnReplace( this.TMPL_th, {","                  colspan: cspan,","                  thClass: ' ' + (foot_cfg.heading.className || ''),","                  content: this.fnReplace( foot_cfg.heading.content, replacer_obj )","              });","","            th_item = {","                index:      0,","                key:        0,","                td:         null,","                th:         foot_cfg.heading,","                className:  foot_cfg.heading.className || '',","                formatter:  '',","                content:    null","            };","","              // save this for later ... used by refreshFooter","            this.node_cols.push(th_item);","        }","","          //","          //  Make an array for the remainder TD's in the Footer","          //","          td_html = [];	// an array of objects to hold footer TD (non-TH!) data","","          for(i=cspan; i<columns.length; i++) {","              titem = columns[i];","              td_html.push({","                  index:    i,","                  key:      titem.key,","                  td:       null,","                  th:       null,","                  className: titem.className || '',   // copy over this DT's column class","                  formatter: titem.formatter || '',   //                   and formatter","                  content:  null","              });","          }","","          //","          //  Augment the Footer TD's, by inserting computed values from 'footer' config","          //","          //   Note: Users may enter footer 'columns' in non-ascending order, thus","          //         necessitating the search for column key ...","          //","          Y.Array.each( foot_cols, function(fitem){","              var imatch = -1;","              Y.Array.some( td_html, function(item,index) {","                  if ( item.key === fitem.key ) {","                      imatch = index;","                      return true;	// true ends the loop ... so this is 'find a first'","                  }","              });","","              if ( imatch !== -1) {","                  // go ahead and calculate the value for this cell, while we are building it ...","                  td_html[imatch].td = this.formatFootCell( td_html[imatch], fitem );","","                  td_html[imatch].content = fitem.content || null;","                  td_html[imatch].foot_cfg = fitem;","","                  if ( fitem.formatter ) {","                      td_html[imatch].formatter = fitem.formatter;","                  }","","                  if ( fitem.className ) {","                      td_html[imatch].className = fitem.className;","                  }","              }","","          }, this);","","          //","          //  and Build out the TD string ... looping over the non-TH columns","          //","          Y.Array.each( td_html, function(item){","              item.td = item.td || '';	// if nothing defined, fill with ''","              item.content = item.content || null;","","              tfoot_td += this.fnReplace( this.TMPL_td, {","                  tdClass: item.className || '',","                  content: item.td","              });","","              this.node_cols.push( item );","          }, this);","","          //","          //  Now construct the TR and the outer TFOOT and add it","          //","          trClass = this._dt.getClassName('footer');","          tr_tmpl = this.TMPL_tfoot;","","          tr = this.fnReplace( tr_tmpl, {","              footClass:  trClass,","              th_content: tfoot_th,","              td_content: tfoot_td","          });","","          foot_cont.append( Y.Node.create(tr) );","","          this.fire('renderFooter');","","          return this;","","      },","","     /**","      * Fires after the footer has been created and rendered.","      * @event renderFooter","      * @param none","      */","","// --------------------------------------------------------------------------------","//               Public Methods","// --------------------------------------------------------------------------------","","      /**","       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by","       *   looping through the current \"data\" (i.e. Recordset).","       *","       *   Currently, the 'calc' is set to lowercase ...","       *","       * Example calc settings are as follows (for given 'colKey');","       *","       * {sum}   Calculate the arithmetic sum of dataset","       * {min}   Calculate the minimum value within the dataset","       * {max}   Calculate the maximum value within the dataset","       * {avg}   Calculate the arithmetic average of the dataset","       *          (synonyms are {mean}, {average})","       *","       * Also, non-dataset iterating calcs are;","       *  {row_count}  Returns the number of rows in the dataset","       *  {col_count}  Returns the number of columns in the dataset (no visibility check)","       *  {date}       Returns the current date (via dateFormat setting)","       *  {time}       Returns the current time (via timeFormat setting)","       *","       * If 'calc' argument is a function(), then call it (in the \"this\" context of this","       *  FooterView) with one argument, the DataTable.data property.","       *","       * Doesn't handle non-numeric calculations (i.e. `Date` or `String`)","       *","       * TODO:  Consider one call to this (with mult keys) for one loop thru only ...","       *","       *  not a really possible use case, but ...","       *  whatif user tries to enter calc='this is a {sum} and {min} value' ??","       *","       * @method calcDatasetValue","       * @param {String} colKey  The column key name to be calculated","       * @param {String} calc    A recognizable calc setting from above","       * @return {Number} the return value","       * @public","       */","      calcDatasetValue: function(colKey, calc) {","","          var rs_data = this._dt.get(\"data\"),    // this is a modelList currently","              rcalc   = 0,","              lcalc, avg,colItem,rflt;","","          // If a string, then process it ....","","          if ( Y.Lang.isString(calc) ) {","              lcalc = calc.toLowerCase();","              avg   = lcalc.search(/\\{average\\}|\\{avg\\}|\\{mean\\}/i);  // a flag for knowing if averaging is to be done","","              //","              //  initial case, if non-summary item, just return it!","              //   Note: these probably shouldn't be used in a TD column,","              //        but sometimes people may do this ...","              //","              if ( lcalc.search(/\\{row_count\\}/) !== -1 ) {","                  return rs_data.size();","              }","              if ( lcalc.search(/\\{col_count\\}/) !== -1  ) {","                  return this._dt.get(\"columns\").length;","              }","              if ( lcalc.search(/\\{date\\}/) !== -1  )	{","                  return Y.DataType.Date.format( new Date(), { format: this.dateFormat });","              }","              if ( lcalc.search(/\\{time\\}/) !== -1  )	{","                  return Y.DataType.Date.format( new Date(), { format: this.timeFormat });","              }","","              //","              //  If a min or max, set initial value to first","              //","              if ( lcalc.search(/\\{min\\}|\\{max\\}/) !== -1 ) {","                  rcalc = parseFloat(rs_data.item(0).get(colKey) );","              }","","              //","              //  March thru the dataset, operating on the 'calc' item","              //","              rs_data.each( function(item) {","                  colItem = item.get(colKey);","                  rflt    = +colItem;","           /*","              TODO:  For handling date / string set calclations ...","","                    rflt    = (Y.Lang.isNumber(colItem) && colItem ) ? parseFloat(colItem) : null,","                    rstr    = (Y.Lang.isString(colItem) && colItem ) ? colItem : null,","                    rdate   = ( colItem.now ) ? rdate : null;","            */","                  if ( lcalc.search(/\\{sum\\}/) !== -1 || avg !==-1 ){","                      rcalc += rflt;","                  } else if ( lcalc.search(/\\{min\\}/) !== -1 ){","                      rcalc = Math.min( rcalc, rflt );","                  } else if ( lcalc.search(/\\{max\\}/) !== -1 ) {","                      rcalc = Math.max( rcalc, rflt );","                  } else {","                      rcalc = calc;","                  }","              });","","              //","              //  Post-process the data (mostly for averages) prior to returning","              //","              if ( avg !== -1 ) {","                  rcalc = ( !rs_data.isEmpty() ) ? ( parseFloat(rcalc)/parseFloat(rs_data.size()) ) : 0;","              }","","              return parseFloat(rcalc);   // processed later in formatFootCell to proper output format","","          }","","          // If numeric, just return it the data .. unformatted","          if ( Y.Lang.isNumber(calc) ) {","              return calc;","          }","","          // If a function was entered, execute it in DataTable context, passing the \"data\" set as argument","          if ( Y.Lang.isFunction(calc) ) {","              return calc.call(this,rs_data);","          }","      },","","","      /**","       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by","       *","       * @method formatFootCell","       * @param {String} col  The column key name to be calculated","       * @param {String} foot_col    A recognizable calc setting from above","       * @return {Float} the return value","       * @public","       */","      formatFootCell: function( col, foot_col ) {","","          if ( !foot_col.content ) {","              return '';","          }","","          var rval = this.calcDatasetValue( foot_col.key, foot_col.content),	// get the calculated item ...","              fmtr, ctag, srtn;","","          //","          // See if a custom formatter is defined ...","          //   first check the footer.column for a formatter,","          //   then use the column.formatter,","          //   or none","          // TODO: allow standard named formatters and/or function names {String}","          //","          fmtr = ( foot_col.formatter && Y.Lang.isFunction(foot_col.formatter) ) ? foot_col.formatter :","              ( col.formatter && Y.Lang.isFunction(col.formatter) ) ? col.formatter : null;","","          rval = ( fmtr && fmtr.call ) ? fmtr.call( this, {value:rval, column:col} ) : rval;","","          if ( Y.Lang.isFunction(foot_col.content) ) {","              return rval;","          } else {","              ctag = foot_col.content.match(/\\{.*\\}/)[0] || null;","              srtn = foot_col.content;","              if ( ctag && Y.Lang.isString(ctag) ) {","                  srtn = srtn.replace(ctag,rval);","              }","              return srtn;","          }","      },","","      /**","       * Refreshes the summary items in the footer view and populates the footer","       *  elements based on the current \"data\" contents.","       *","       * @method refreshFooter","       * @return this","       * @chainable","       * @public","       */","      refreshFooter: function(){","          var table_obj = this._dt,","              foot_cont = table_obj._tfootNode,","              td_nodes  = foot_cont.all('th,td'),","              td_html, replacer_obj;","","          //","          // Loop through each footer \"cell\" (i.e. either a TH or TD) and","          //","          Y.Array.each( this.node_cols, function(fitem,findex) {","              if ( fitem.th ) {","                  replacer_obj = {","                      ROW_COUNT : table_obj.data.size(),","                      COL_COUNT : table_obj.get('columns').length,","                      DATE:       Y.DataType.Date.format( new Date(), { format: this.get(\"dateFormat\") }),","                      TIME:       Y.DataType.Date.format( new Date(), { format: this.get(\"timeFormat\") })","                  };","","                  Y.Object.each(replacer_obj,function(val,key,obj){","                      obj[ key.toLowerCase() ] = val;","                  });","","                  td_html = this.fnReplace( fitem.th.content, replacer_obj );","              }","","              // call formatFootCell, which calculates the current cell content and formats it","              if ( !fitem.th && fitem.content ) {","                  td_html = this.formatFootCell( fitem, fitem.foot_cfg);","              }","","              if ( td_html ) {","                  td_nodes.item(findex).setHTML(td_html);","              }","","          }, this);","","          this.fire('refreshFooter');","","          return this;","","      },","","     /**","      * Fires after the footer has been recalculated and updated.","      * @event refreshFooter","      * @param none","      */","","","      /**","       * For scrollable tables only, adjusts the sizes of the TFOOT cells to match the widths","       * of the THEAD cells.","       *","       * @method resizeFooter","       * @return this","       * @public","       * @chainable","       **/","      resizeFooter : function() {","          function _getNumericStyle(node,style){","              var cstyle  = node.getComputedStyle(style),","                  nstyle = (cstyle) ? +(cstyle.replace(/px/,'')) : 0;","              return nstyle;","          }","","          var table_obj   = this._dt,","              thead       = table_obj.get('contentBox').one('.'+table_obj.getClassName('scroll','columns')),","              tfootNode   = this._dt._tfootNode,","              tfoot_nodes = tfootNode.all('th,td'),","              col_width, thead_th, thead_ths,j;","","          if( table_obj._yScroll ) {","              thead_ths = thead.all('th');","","              Y.Array.each( this.node_cols, function(col,i) {","                  col_width = 0;","                  if ( col.th ) {","                      for(j=0; j<col.th.colspan; j++) {","                          thead_th = thead_ths.item(col.index+j);","                          col_width += _getNumericStyle(thead_th,'width');","                      }","                      col_width += col.th.colspan-1;  // subtract the 1px border between columns spanned","                  } else {","                      thead_th  = thead_ths.item(col.index);","                      col_width = _getNumericStyle(thead_th,'width')-20;  // 20 is the padding","                  }","                  tfoot_nodes.item(i).setStyle('width',col_width+'px');","              });","          }","","          this.fire('resizeFooter');","","          return this;","      },","","     /**","      * Fires after the footer has been resized to match the parent DataTable","      * @event resizeFooter","      * @param none","      */","","// --------------------------------------------------------------------------------","//               Protected Methods","// --------------------------------------------------------------------------------","","      /**","       * Method that builds a separate TABLE / TFOOT container outside of the Y-scrolling","       *  container and places the view \"container\" within this.","       *","       * This is specifically required for a \"fixed\" footer ... i.e. with a scrolling DataTable,","       * where the footer is expected to remain stationary as the records are scrolled through.","       *","       *  NOTE: A bug exists where the viewFooter container (TFOOT) is improperly placed within","       *        the y-scroller container (http://yuilibrary.com/projects/yui3/ticket/2531723)","       *        This function is a workaround for that.","       * @method _buildFixedFooter","       * @private","       */","      _buildFixedFooter : function() {","          var fixedFooter   = this._yScrollFooter,    // Node for footer containing TABLE element","              yScroller     = this._yScrollContainer, // Node for the DIV containing header TABLE, data TABLE and footer TABLE","              tmpl, tfootNode;","","         if (!fixedFooter) {","              tmpl = '<table cellspacing=\"0\" aria-hidden=\"true\" class=\"{className}\"></table>';","","              //","              // Create a new TABLE, to hold the TFOOT as a fixed element \"outside\" of yScroller","              //","              fixedFooter =  Y.Node.create(","                  Y.Lang.sub(this._Y_SCROLL_FOOTER_TEMPLATE || this.foot.TMPL_table_fixed  || tmpl, {","                      className: this.getClassName('footer')","                  }));","              this._yScrollFooter = fixedFooter;","","              yScroller.append(fixedFooter);","","              //","              //  Move the already created TFOOT from the old incorrect location","              //   to within the new TABLE in \"fixedFooter\" location","              //","              tfootNode = this.get('contentBox').one('table > tfoot');","              this._tfootNode = tfootNode;","              if ( tfootNode ) {","                  this._yScrollFooter.append( tfootNode );","                  this.foot.resizeFooter();","              }","          }","","      }","","","// --------------- PSEUDO-ATTRIBUTES ... i.e. attributes expected, but in DataTable's footerConfig ------------------","","    /**","    Flag indicating if the footer is desired to be \"fixed\" (i.e. non-scrolling, true) or floating with Datatable scrolling (false)","    @attribute fixed","    @type boolean","    @default false","    **/","","    /**","    Defines the TH properties for the footer row, the leftmost column (including optional colspan)","    @attribute heading","    @type Object","    @default null","    **/","","    /**","    A string template defining the contents of the TH column.  May include any non-set related fields,","    including `{row_count}`, `{col_count}`, `{date}`,`{time}`","","    Example:","","        heading.content : 'Totals for {row_count} Orders as-of {date} :'","","    @attribute heading.content","    @type String","    @default null","    **/","","    /**","    The number of columns from the DataTable columns that should be spanned for the TH in the footer","    @attribute heading.colspan","    @type Integer","    @default 1","    **/","","    /**","    A CSS class name to be added to the TH element of the footer","    @attribute heading.className","    @type String","    @default null","    **/","","    /**","    An array of objects, one row per *desired* column of TD representing a summary from the dataset.","","    Only TD's with a row included in this array will be processed and rendered, otherwise any visible","     columns from the DataTable, that are not within a TH colspan, will be created as empty.","    @attribute columns","    @type Array","    @default null","    **/","","    /**","    The dataset \"key\" corresponding to the columns of the DataTable for this desired TD in the footer.","    @attribute columns.key","    @type String","    @default null","    **/","","    /**","    A string template defining the contents of this TD column in the footer.  May include any set-based","     items (i.e. `{sum}`,`{min}`,`{max}`,`{avg}`) or non-set related fields, including `{row_count}`, `{col_count}`, `{date}`,`{time}`.","","     The {average} and {mean} placeholders are equivalent to {avg} in this implementation.","","    Example:","","        columns[2].content : '{sum}'","","    @attribute columns.content","    @type String","    @default null","    **/","","    /**","    A CSS class name to be added to this TD element of the footer","    @attribute columns.className","    @type String","    @default null","    **/","","","    /**","    Specifies a formatter to apply to the numeric field denoted in this TD column.  A formatter from the original DataTable columns can be specified.","","    If this attribute is set to null (or missing), the formatter from the DataTable column associated with the \"key\" (if any), will be used.","","    If this attribute is set to '', no formatting will be applied.","","    @attribute columns.formatter","    @type {String|Function}","    @default null","    **/","","    /**","    Specifies a strftime format string to be applied for {date} entries, using Y.DataType.Date.format","    @attribute dateFormat","    @type String","    @default \"%D\"","    **/","","    /**","    Specifies a strftime format string to be applied for {time} entries, using Y.DataType.Date.format","    @attribute timeFormat","    @type String","    @default \"%T\"","    **/","","  });","","","}, '@VERSION@', {\"skinnable\": \"true\", \"requires\": [\"base-build\", \"datatable-base\", \"view\"]});"];
_yuitest_coverage["build/gallery-datatable-footerview/gallery-datatable-footerview.js"].lines = {"1":0,"90":0,"205":0,"208":0,"211":0,"214":0,"215":0,"219":0,"231":0,"232":0,"234":0,"235":0,"236":0,"253":0,"264":0,"269":0,"273":0,"278":0,"285":0,"286":0,"292":0,"293":0,"294":0,"300":0,"311":0,"317":0,"319":0,"320":0,"321":0,"338":0,"339":0,"340":0,"341":0,"342":0,"343":0,"347":0,"349":0,"351":0,"352":0,"354":0,"355":0,"358":0,"359":0,"368":0,"369":0,"370":0,"372":0,"377":0,"383":0,"384":0,"386":0,"392":0,"394":0,"396":0,"448":0,"454":0,"455":0,"456":0,"463":0,"464":0,"466":0,"467":0,"469":0,"470":0,"472":0,"473":0,"479":0,"480":0,"486":0,"487":0,"488":0,"496":0,"497":0,"498":0,"499":0,"500":0,"501":0,"503":0,"510":0,"511":0,"514":0,"519":0,"520":0,"524":0,"525":0,"541":0,"542":0,"545":0,"555":0,"558":0,"560":0,"561":0,"563":0,"564":0,"565":0,"566":0,"568":0,"582":0,"590":0,"591":0,"592":0,"599":0,"600":0,"603":0,"607":0,"608":0,"611":0,"612":0,"617":0,"619":0,"640":0,"641":0,"643":0,"646":0,"652":0,"653":0,"655":0,"656":0,"657":0,"658":0,"659":0,"660":0,"662":0,"664":0,"665":0,"667":0,"671":0,"673":0,"700":0,"704":0,"705":0,"710":0,"714":0,"716":0,"722":0,"723":0,"724":0,"725":0,"726":0};
_yuitest_coverage["build/gallery-datatable-footerview/gallery-datatable-footerview.js"].functions = {"initializer:204":0,"(anonymous 2):231":0,"destructor:230":0,"(anonymous 3):285":0,"(anonymous 5):340":0,"(anonymous 4):338":0,"(anonymous 6):368":0,"render:252":0,"(anonymous 7):486":0,"calcDatasetValue:446":0,"formatFootCell:539":0,"(anonymous 9):599":0,"(anonymous 8):590":0,"refreshFooter:581":0,"_getNumericStyle:640":0,"(anonymous 10):655":0,"resizeFooter:639":0,"_buildFixedFooter:699":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-datatable-footerview/gallery-datatable-footerview.js"].coveredLines = 139;
_yuitest_coverage["build/gallery-datatable-footerview/gallery-datatable-footerview.js"].coveredFunctions = 19;
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 1);
YUI.add('gallery-datatable-footerview', function (Y, NAME) {

 /**
  FooterView is a YUI View class extension that provides a simple, one row summary row
  to a Datatable. This view provides
  for a summary row appended to the bottom of the DataTable TBODY, typically consisting
  of **one** TH element (with a colspan) and several TD elements for each desired column
  where a "calculated field" is desired.

  View configuration provides for calculated fields based upon the all of the available
  dataset fields within the DataTable's "ModelList".

  The view works with either non-scrolling or scrolling DataTables, and allows for either a
  "fixed" view, wherein the footer remains fixed at the bottom of the DataTable contentBox
  while the table is scrolled.

  #### Calculated Fields

  The current implementation supports the following calculated fields, where they are
  identified by their placeholder tag for replacement via Y.sub (case insensitive);

  * `{sum}` Calculate the arithmetic sum of the specified column in dataset
  * `{min}` Calculate the minimum value of the specified column in dataset
  * `{max}` Calculate the maximum value of the specified column in dataset
  * `{avg}` Calculate the arithmetic average of the of the specified column (synonyms `{mean}`, `{average}`)

  Also, non-looping calcs are;

  *  `{row_count}` Returns the number of rows in the dataset
  *  `{col_count}` Returns the number of columns in the dataset (no visibility check)
  *  `{date}` Returns the current date
  *  `{time}` Returns the current time

  #### Configuration

  YUI 3.6.0 DataTable supports attributes including `footerView` and `footerConfig`.

  This FooterView recognizes the following attributes, which must be configured via the
  DataTable {configs} (see usage example below);

  * [`fixed`](#attr_fixed) : Flag indicating if footer should be fixed or floating
  * [`heading`](#attr_heading) : Object, defining the single TH as;
     * [`colspan`](#attr_heading.colspan) : Number of columns to merge from left for the TH
     * [`content`](#attr_heading.content) : A string indicating the content of the TH for the footer
     * [`className`](#attr_heading.className) : Additional classname for TH
  * [`columns`](#attr_columns) : Array of objects, one per desired TD column in footer as;
     * [`key`](#attr_columns.key) : `key` name from the DataTable columns
     * [`content`](#attr_columns.content) : String indicating the contents of this TD
     * [`className`](#attr_columns.className) : Additional classname for TD
     * [`formatter`](#attr_columns.formatter) : Formatter to apply to this column result
  * [`dateFormat`](#attr_dateFormat) : Format string to use for any {date} fields
  * [`timeFormat`](#attr_timeFormat) : Format string to use for any {time} fields

  Additionally the user can provide a valid function as a column `content` to calculate a
  custom entry for a column (see [`columns.content`](#attr_columns.content) or [`calcDatasetValue`](#method_calcDatasetValue))

  #### Usage

      var dtable = new Y.DataTable({
          columns:    ['EmpId','FirstName','LastName','NumClients','SalesTTM'],
          data:       AccountMgr.Sales,
          scrollable: 'y',
          height:     '250px',
          width:      '400px',

          footerView:   Y.FooterView,
          footerConfig: {
              fixed:   true,
              heading: {
                  colspan:	3,
                  content:	"Sales Totals for {row_count} Account Mgrs : &nbsp;",
                  className:	"align-right"
              },
              columns: [
                  { key:'NumClients', content:"{Avg} avg", className:"clientAvg" },
                  { key:'SalesTTM',   content:"{sum}", className:"salesTotal", formatter:fmtCurrency }
              ]
          }
      });

      dtable.render('#salesDT');


  @module gallery-datatable-footerview
  @class Y.FooterView
  @extends Y.View
  @author Todd Smith
  @since 3.6.0
  **/
 _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 90);
Y.FooterView = Y.Base.create( 'tableFooter', Y.View, [], {

      /**
       Defines the default TD HTML template for a calculated field within the footer
       @property TMPL_td
       @type String
       @default '<td class="yui3-datatable-even {tdClass}">{content}</td>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_td: '<td class="yui3-datatable-even {tdClass}">{content}</td>',

      /**
       Defines the default TH HTML template for the header content within the footer
       @property TMPL_th
       @type String
       @default '<th colspan="{colspan}" class="{thClass}">{content}</th>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_th: '<th colspan="{colspan}" class="{thClass}">{content}</th>',

      /**
       Defines the default TR HTML template for the footer
       @property TMPL_tr
       @type String
       @default '<tr>{th_content}{td_content}</tr>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_tr:    '<tr>{th_content}{td_content}</tr>',

      /**
       Defines the default TFOOT HTML template for the footer
       @property TMPL_tfoot
       @type String
       @default '<tfoot class="{footClass}"><tr>{th_content}{td_content}</tr></tfoot>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_tfoot: '<tfoot class="{footClass}"><tr>{th_content}{td_content}</tr></tfoot>',


      /**
       Defines the default TABLE HTML template for the "fixed" footer type ... i.e. with scrolling
       @property TMPL_table_fixed
       @type String
       @default '<table cellspacing="0" aria-hidden="true" class="{className}"></table>'
       @static
       @since 3.6.0
       @protected
       **/
      TMPL_table_fixed: '<table cellspacing="0" aria-hidden="true" class="{className}"></table>',


      dateFormat:  '%D',
      timeFormat:  '%T',

      // replacer function
      fnReplace  : Y.Lang.sub,

      /**
       Storage array of objects, each object represents a rendered "cell or column" within the
       footer view.  The first element is typically a TH element (with a colspan), and the
       remaining elements are the TD's for each requested footer field.

       Created and populated by the render() method

       @property node_cols
       @type Array of Object hashes
       @default null
       @static
       @since 3.6.0
       @protected
       **/
      node_cols : null,   // array of col_key map (e.g. '_head', null, 'f_name' )

      /**
       Placeholder for subscriber event handles, used to destroy cleanly
       @property _subscr
       @type {EventHandles} Array of eventhandles
       @default null
       @static
       @since 3.6.0
       @private
       **/
      _subscr : null,

      /**
       DataTable instance that utilizes this footerview, derived from initializer "config.host"
       Used to reference changes to DT modellist, and to retrieve the underlying "data"

       @property _dt
       @type Y.DataTable
       @default null
       @static
       @since 3.6.0
       @private
       **/
      _dt: null,

      /**
       * Called when view is initialized.  Stores reference to calling DataTable and
       *  creates listeners to link building or refreshing the footer back to the
       *  parent DataTable.
       *
       * @method initializer
       * @param {Object} config
       * @protected
       */
      initializer: function(config) {
          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "initializer", 204);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 205);
config = (config) ? config : {};

          // Set a reference to the calling DataTable
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 208);
this._dt = ( config.source ) ? config.source :  config.host;    // reference to DT instance

          // Setup listeners ...
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 211);
this._subscr = [];

          //  ... For scrollable with fixed footer, we have to build a new TABLE and append outside of scrolling ...
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 214);
if ( config.footerConfig && config.footerConfig.fixed && this._dt.get('scrollable') ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 215);
this._subscr.push( Y.Do.after( this._buildFixedFooter, this._dt, '_syncScrollUI', this._dt) );
          }

          // Listen for changes on the DataTable "data" ...
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 219);
this._subscr.push( this._dt.data.after(['*:change','*:add','*:create', '*:remove', '*:reset'], Y.bind('refreshFooter', this) ) );

      },

      /**
       * Default destructor method, cleans up the listeners that were created and
       *  removes and/or empties the created DOM elements for the footerView.
       *
       * @method destructor
       * @protected
       */
      destructor: function () {
          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "destructor", 230);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 231);
Y.Array.each(this._subscr,function(item){
              _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 2)", 231);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 232);
item.detach();
          });
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 234);
this._dt._tfootNode.empty();
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 235);
if ( this._dt._yScrollFooter ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 236);
this._dt._yScrollFooter.empty();
          }
      },


      /**
       * Creates the DOM elements and attaches them to the footerView container.
       *  Reads the configuration parameters (i.e. from DataTable's config as "footerConfig")
       *  and structures a single TR element, with a leading TH in first column, and the
       *  requested TD elements following.
       *
       * @method render
       * @public
       * @chainable
       * @return this
       */
      render: function(){
          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "render", 252);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 253);
var foot_cont = this.get('container'),      // reference to the TFOOT, created by DataTable
              table_obj = this._dt,                   // reference to the parent DataTable instance
              columns   = table_obj.get('columns'),   // reference to the ModelList / or DataTable.data
              rs_data   = table_obj.get("data"),      // reference to the ModelList / or DataTable.data
              foot_cfg  = table_obj.get('footerConfig'),    // placeholder for the 'footer' config
              foot_cols = foot_cfg.columns,           // placeholder for the 'footer'.config.columns entry
              tfoot_th  = '',                         // the string for the TH node
              tfoot_td  = '',                         // the string for the TD node
              cspan     = 1,                          // colSpan entry for TH, default to 1
              replacer_obj, th_item, td_html, titem, trClass, tr, tr_tmpl, i;

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 264);
this.node_cols = [];

          //
          //  Initialize date and time formats
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 269);
this.dateFormat = ( foot_cfg && foot_cfg.dateFormat ) ? foot_cfg.dateFormat
              : ( table_obj.get('dateFormat') ) ? table_obj.get('dateFormat')
              : this.dateFormat;

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 273);
this.timeFormat = ( foot_cfg && foot_cfg.timeFormat ) ? foot_cfg.timeFormat
              : ( table_obj.get('timeFormat') ) ? table_obj.get('timeFormat')
              : this.timeFormat;

          // define a default replacer object ...
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 278);
replacer_obj = {
              ROW_COUNT : rs_data.size(),
              COL_COUNT : columns.length,
              DATE:       Y.DataType.Date.format( new Date(), { format: this.dateFormat }),
              TIME:       Y.DataType.Date.format( new Date(), { format: this.timeFormat })
          };
          // duplicate above, for lowercase
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 285);
Y.Object.each(replacer_obj,function(val,key,obj){
              _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 3)", 285);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 286);
obj[ key.toLowerCase() ] = val;
          });

          //
          //  Process the TH part
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 292);
if ( foot_cfg.heading ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 293);
cspan = foot_cfg.heading.colspan || cspan;
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 294);
tfoot_th = this.fnReplace( this.TMPL_th, {
                  colspan: cspan,
                  thClass: ' ' + (foot_cfg.heading.className || ''),
                  content: this.fnReplace( foot_cfg.heading.content, replacer_obj )
              });

            _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 300);
th_item = {
                index:      0,
                key:        0,
                td:         null,
                th:         foot_cfg.heading,
                className:  foot_cfg.heading.className || '',
                formatter:  '',
                content:    null
            };

              // save this for later ... used by refreshFooter
            _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 311);
this.node_cols.push(th_item);
        }

          //
          //  Make an array for the remainder TD's in the Footer
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 317);
td_html = [];	// an array of objects to hold footer TD (non-TH!) data

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 319);
for(i=cspan; i<columns.length; i++) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 320);
titem = columns[i];
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 321);
td_html.push({
                  index:    i,
                  key:      titem.key,
                  td:       null,
                  th:       null,
                  className: titem.className || '',   // copy over this DT's column class
                  formatter: titem.formatter || '',   //                   and formatter
                  content:  null
              });
          }

          //
          //  Augment the Footer TD's, by inserting computed values from 'footer' config
          //
          //   Note: Users may enter footer 'columns' in non-ascending order, thus
          //         necessitating the search for column key ...
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 338);
Y.Array.each( foot_cols, function(fitem){
              _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 4)", 338);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 339);
var imatch = -1;
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 340);
Y.Array.some( td_html, function(item,index) {
                  _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 5)", 340);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 341);
if ( item.key === fitem.key ) {
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 342);
imatch = index;
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 343);
return true;	// true ends the loop ... so this is 'find a first'
                  }
              });

              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 347);
if ( imatch !== -1) {
                  // go ahead and calculate the value for this cell, while we are building it ...
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 349);
td_html[imatch].td = this.formatFootCell( td_html[imatch], fitem );

                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 351);
td_html[imatch].content = fitem.content || null;
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 352);
td_html[imatch].foot_cfg = fitem;

                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 354);
if ( fitem.formatter ) {
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 355);
td_html[imatch].formatter = fitem.formatter;
                  }

                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 358);
if ( fitem.className ) {
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 359);
td_html[imatch].className = fitem.className;
                  }
              }

          }, this);

          //
          //  and Build out the TD string ... looping over the non-TH columns
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 368);
Y.Array.each( td_html, function(item){
              _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 6)", 368);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 369);
item.td = item.td || '';	// if nothing defined, fill with ''
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 370);
item.content = item.content || null;

              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 372);
tfoot_td += this.fnReplace( this.TMPL_td, {
                  tdClass: item.className || '',
                  content: item.td
              });

              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 377);
this.node_cols.push( item );
          }, this);

          //
          //  Now construct the TR and the outer TFOOT and add it
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 383);
trClass = this._dt.getClassName('footer');
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 384);
tr_tmpl = this.TMPL_tfoot;

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 386);
tr = this.fnReplace( tr_tmpl, {
              footClass:  trClass,
              th_content: tfoot_th,
              td_content: tfoot_td
          });

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 392);
foot_cont.append( Y.Node.create(tr) );

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 394);
this.fire('renderFooter');

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 396);
return this;

      },

     /**
      * Fires after the footer has been created and rendered.
      * @event renderFooter
      * @param none
      */

// --------------------------------------------------------------------------------
//               Public Methods
// --------------------------------------------------------------------------------

      /**
       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by
       *   looping through the current "data" (i.e. Recordset).
       *
       *   Currently, the 'calc' is set to lowercase ...
       *
       * Example calc settings are as follows (for given 'colKey');
       *
       * {sum}   Calculate the arithmetic sum of dataset
       * {min}   Calculate the minimum value within the dataset
       * {max}   Calculate the maximum value within the dataset
       * {avg}   Calculate the arithmetic average of the dataset
       *          (synonyms are {mean}, {average})
       *
       * Also, non-dataset iterating calcs are;
       *  {row_count}  Returns the number of rows in the dataset
       *  {col_count}  Returns the number of columns in the dataset (no visibility check)
       *  {date}       Returns the current date (via dateFormat setting)
       *  {time}       Returns the current time (via timeFormat setting)
       *
       * If 'calc' argument is a function(), then call it (in the "this" context of this
       *  FooterView) with one argument, the DataTable.data property.
       *
       * Doesn't handle non-numeric calculations (i.e. `Date` or `String`)
       *
       * TODO:  Consider one call to this (with mult keys) for one loop thru only ...
       *
       *  not a really possible use case, but ...
       *  whatif user tries to enter calc='this is a {sum} and {min} value' ??
       *
       * @method calcDatasetValue
       * @param {String} colKey  The column key name to be calculated
       * @param {String} calc    A recognizable calc setting from above
       * @return {Number} the return value
       * @public
       */
      calcDatasetValue: function(colKey, calc) {

          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "calcDatasetValue", 446);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 448);
var rs_data = this._dt.get("data"),    // this is a modelList currently
              rcalc   = 0,
              lcalc, avg,colItem,rflt;

          // If a string, then process it ....

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 454);
if ( Y.Lang.isString(calc) ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 455);
lcalc = calc.toLowerCase();
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 456);
avg   = lcalc.search(/\{average\}|\{avg\}|\{mean\}/i);  // a flag for knowing if averaging is to be done

              //
              //  initial case, if non-summary item, just return it!
              //   Note: these probably shouldn't be used in a TD column,
              //        but sometimes people may do this ...
              //
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 463);
if ( lcalc.search(/\{row_count\}/) !== -1 ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 464);
return rs_data.size();
              }
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 466);
if ( lcalc.search(/\{col_count\}/) !== -1  ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 467);
return this._dt.get("columns").length;
              }
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 469);
if ( lcalc.search(/\{date\}/) !== -1  )	{
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 470);
return Y.DataType.Date.format( new Date(), { format: this.dateFormat });
              }
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 472);
if ( lcalc.search(/\{time\}/) !== -1  )	{
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 473);
return Y.DataType.Date.format( new Date(), { format: this.timeFormat });
              }

              //
              //  If a min or max, set initial value to first
              //
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 479);
if ( lcalc.search(/\{min\}|\{max\}/) !== -1 ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 480);
rcalc = parseFloat(rs_data.item(0).get(colKey) );
              }

              //
              //  March thru the dataset, operating on the 'calc' item
              //
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 486);
rs_data.each( function(item) {
                  _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 7)", 486);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 487);
colItem = item.get(colKey);
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 488);
rflt    = +colItem;
           /*
              TODO:  For handling date / string set calclations ...

                    rflt    = (Y.Lang.isNumber(colItem) && colItem ) ? parseFloat(colItem) : null,
                    rstr    = (Y.Lang.isString(colItem) && colItem ) ? colItem : null,
                    rdate   = ( colItem.now ) ? rdate : null;
            */
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 496);
if ( lcalc.search(/\{sum\}/) !== -1 || avg !==-1 ){
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 497);
rcalc += rflt;
                  } else {_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 498);
if ( lcalc.search(/\{min\}/) !== -1 ){
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 499);
rcalc = Math.min( rcalc, rflt );
                  } else {_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 500);
if ( lcalc.search(/\{max\}/) !== -1 ) {
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 501);
rcalc = Math.max( rcalc, rflt );
                  } else {
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 503);
rcalc = calc;
                  }}}
              });

              //
              //  Post-process the data (mostly for averages) prior to returning
              //
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 510);
if ( avg !== -1 ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 511);
rcalc = ( !rs_data.isEmpty() ) ? ( parseFloat(rcalc)/parseFloat(rs_data.size()) ) : 0;
              }

              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 514);
return parseFloat(rcalc);   // processed later in formatFootCell to proper output format

          }

          // If numeric, just return it the data .. unformatted
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 519);
if ( Y.Lang.isNumber(calc) ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 520);
return calc;
          }

          // If a function was entered, execute it in DataTable context, passing the "data" set as argument
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 524);
if ( Y.Lang.isFunction(calc) ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 525);
return calc.call(this,rs_data);
          }
      },


      /**
       * Calculates a DataSet summary item defined in 'calc' for the given colKey, by
       *
       * @method formatFootCell
       * @param {String} col  The column key name to be calculated
       * @param {String} foot_col    A recognizable calc setting from above
       * @return {Float} the return value
       * @public
       */
      formatFootCell: function( col, foot_col ) {

          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "formatFootCell", 539);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 541);
if ( !foot_col.content ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 542);
return '';
          }

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 545);
var rval = this.calcDatasetValue( foot_col.key, foot_col.content),	// get the calculated item ...
              fmtr, ctag, srtn;

          //
          // See if a custom formatter is defined ...
          //   first check the footer.column for a formatter,
          //   then use the column.formatter,
          //   or none
          // TODO: allow standard named formatters and/or function names {String}
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 555);
fmtr = ( foot_col.formatter && Y.Lang.isFunction(foot_col.formatter) ) ? foot_col.formatter :
              ( col.formatter && Y.Lang.isFunction(col.formatter) ) ? col.formatter : null;

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 558);
rval = ( fmtr && fmtr.call ) ? fmtr.call( this, {value:rval, column:col} ) : rval;

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 560);
if ( Y.Lang.isFunction(foot_col.content) ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 561);
return rval;
          } else {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 563);
ctag = foot_col.content.match(/\{.*\}/)[0] || null;
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 564);
srtn = foot_col.content;
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 565);
if ( ctag && Y.Lang.isString(ctag) ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 566);
srtn = srtn.replace(ctag,rval);
              }
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 568);
return srtn;
          }
      },

      /**
       * Refreshes the summary items in the footer view and populates the footer
       *  elements based on the current "data" contents.
       *
       * @method refreshFooter
       * @return this
       * @chainable
       * @public
       */
      refreshFooter: function(){
          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "refreshFooter", 581);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 582);
var table_obj = this._dt,
              foot_cont = table_obj._tfootNode,
              td_nodes  = foot_cont.all('th,td'),
              td_html, replacer_obj;

          //
          // Loop through each footer "cell" (i.e. either a TH or TD) and
          //
          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 590);
Y.Array.each( this.node_cols, function(fitem,findex) {
              _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 8)", 590);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 591);
if ( fitem.th ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 592);
replacer_obj = {
                      ROW_COUNT : table_obj.data.size(),
                      COL_COUNT : table_obj.get('columns').length,
                      DATE:       Y.DataType.Date.format( new Date(), { format: this.get("dateFormat") }),
                      TIME:       Y.DataType.Date.format( new Date(), { format: this.get("timeFormat") })
                  };

                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 599);
Y.Object.each(replacer_obj,function(val,key,obj){
                      _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 9)", 599);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 600);
obj[ key.toLowerCase() ] = val;
                  });

                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 603);
td_html = this.fnReplace( fitem.th.content, replacer_obj );
              }

              // call formatFootCell, which calculates the current cell content and formats it
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 607);
if ( !fitem.th && fitem.content ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 608);
td_html = this.formatFootCell( fitem, fitem.foot_cfg);
              }

              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 611);
if ( td_html ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 612);
td_nodes.item(findex).setHTML(td_html);
              }

          }, this);

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 617);
this.fire('refreshFooter');

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 619);
return this;

      },

     /**
      * Fires after the footer has been recalculated and updated.
      * @event refreshFooter
      * @param none
      */


      /**
       * For scrollable tables only, adjusts the sizes of the TFOOT cells to match the widths
       * of the THEAD cells.
       *
       * @method resizeFooter
       * @return this
       * @public
       * @chainable
       **/
      resizeFooter : function() {
          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "resizeFooter", 639);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 640);
function _getNumericStyle(node,style){
              _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "_getNumericStyle", 640);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 641);
var cstyle  = node.getComputedStyle(style),
                  nstyle = (cstyle) ? +(cstyle.replace(/px/,'')) : 0;
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 643);
return nstyle;
          }

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 646);
var table_obj   = this._dt,
              thead       = table_obj.get('contentBox').one('.'+table_obj.getClassName('scroll','columns')),
              tfootNode   = this._dt._tfootNode,
              tfoot_nodes = tfootNode.all('th,td'),
              col_width, thead_th, thead_ths,j;

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 652);
if( table_obj._yScroll ) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 653);
thead_ths = thead.all('th');

              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 655);
Y.Array.each( this.node_cols, function(col,i) {
                  _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "(anonymous 10)", 655);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 656);
col_width = 0;
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 657);
if ( col.th ) {
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 658);
for(j=0; j<col.th.colspan; j++) {
                          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 659);
thead_th = thead_ths.item(col.index+j);
                          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 660);
col_width += _getNumericStyle(thead_th,'width');
                      }
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 662);
col_width += col.th.colspan-1;  // subtract the 1px border between columns spanned
                  } else {
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 664);
thead_th  = thead_ths.item(col.index);
                      _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 665);
col_width = _getNumericStyle(thead_th,'width')-20;  // 20 is the padding
                  }
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 667);
tfoot_nodes.item(i).setStyle('width',col_width+'px');
              });
          }

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 671);
this.fire('resizeFooter');

          _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 673);
return this;
      },

     /**
      * Fires after the footer has been resized to match the parent DataTable
      * @event resizeFooter
      * @param none
      */

// --------------------------------------------------------------------------------
//               Protected Methods
// --------------------------------------------------------------------------------

      /**
       * Method that builds a separate TABLE / TFOOT container outside of the Y-scrolling
       *  container and places the view "container" within this.
       *
       * This is specifically required for a "fixed" footer ... i.e. with a scrolling DataTable,
       * where the footer is expected to remain stationary as the records are scrolled through.
       *
       *  NOTE: A bug exists where the viewFooter container (TFOOT) is improperly placed within
       *        the y-scroller container (http://yuilibrary.com/projects/yui3/ticket/2531723)
       *        This function is a workaround for that.
       * @method _buildFixedFooter
       * @private
       */
      _buildFixedFooter : function() {
          _yuitest_coverfunc("build/gallery-datatable-footerview/gallery-datatable-footerview.js", "_buildFixedFooter", 699);
_yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 700);
var fixedFooter   = this._yScrollFooter,    // Node for footer containing TABLE element
              yScroller     = this._yScrollContainer, // Node for the DIV containing header TABLE, data TABLE and footer TABLE
              tmpl, tfootNode;

         _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 704);
if (!fixedFooter) {
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 705);
tmpl = '<table cellspacing="0" aria-hidden="true" class="{className}"></table>';

              //
              // Create a new TABLE, to hold the TFOOT as a fixed element "outside" of yScroller
              //
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 710);
fixedFooter =  Y.Node.create(
                  Y.Lang.sub(this._Y_SCROLL_FOOTER_TEMPLATE || this.foot.TMPL_table_fixed  || tmpl, {
                      className: this.getClassName('footer')
                  }));
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 714);
this._yScrollFooter = fixedFooter;

              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 716);
yScroller.append(fixedFooter);

              //
              //  Move the already created TFOOT from the old incorrect location
              //   to within the new TABLE in "fixedFooter" location
              //
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 722);
tfootNode = this.get('contentBox').one('table > tfoot');
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 723);
this._tfootNode = tfootNode;
              _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 724);
if ( tfootNode ) {
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 725);
this._yScrollFooter.append( tfootNode );
                  _yuitest_coverline("build/gallery-datatable-footerview/gallery-datatable-footerview.js", 726);
this.foot.resizeFooter();
              }
          }

      }


// --------------- PSEUDO-ATTRIBUTES ... i.e. attributes expected, but in DataTable's footerConfig ------------------

    /**
    Flag indicating if the footer is desired to be "fixed" (i.e. non-scrolling, true) or floating with Datatable scrolling (false)
    @attribute fixed
    @type boolean
    @default false
    **/

    /**
    Defines the TH properties for the footer row, the leftmost column (including optional colspan)
    @attribute heading
    @type Object
    @default null
    **/

    /**
    A string template defining the contents of the TH column.  May include any non-set related fields,
    including `{row_count}`, `{col_count}`, `{date}`,`{time}`

    Example:

        heading.content : 'Totals for {row_count} Orders as-of {date} :'

    @attribute heading.content
    @type String
    @default null
    **/

    /**
    The number of columns from the DataTable columns that should be spanned for the TH in the footer
    @attribute heading.colspan
    @type Integer
    @default 1
    **/

    /**
    A CSS class name to be added to the TH element of the footer
    @attribute heading.className
    @type String
    @default null
    **/

    /**
    An array of objects, one row per *desired* column of TD representing a summary from the dataset.

    Only TD's with a row included in this array will be processed and rendered, otherwise any visible
     columns from the DataTable, that are not within a TH colspan, will be created as empty.
    @attribute columns
    @type Array
    @default null
    **/

    /**
    The dataset "key" corresponding to the columns of the DataTable for this desired TD in the footer.
    @attribute columns.key
    @type String
    @default null
    **/

    /**
    A string template defining the contents of this TD column in the footer.  May include any set-based
     items (i.e. `{sum}`,`{min}`,`{max}`,`{avg}`) or non-set related fields, including `{row_count}`, `{col_count}`, `{date}`,`{time}`.

     The {average} and {mean} placeholders are equivalent to {avg} in this implementation.

    Example:

        columns[2].content : '{sum}'

    @attribute columns.content
    @type String
    @default null
    **/

    /**
    A CSS class name to be added to this TD element of the footer
    @attribute columns.className
    @type String
    @default null
    **/


    /**
    Specifies a formatter to apply to the numeric field denoted in this TD column.  A formatter from the original DataTable columns can be specified.

    If this attribute is set to null (or missing), the formatter from the DataTable column associated with the "key" (if any), will be used.

    If this attribute is set to '', no formatting will be applied.

    @attribute columns.formatter
    @type {String|Function}
    @default null
    **/

    /**
    Specifies a strftime format string to be applied for {date} entries, using Y.DataType.Date.format
    @attribute dateFormat
    @type String
    @default "%D"
    **/

    /**
    Specifies a strftime format string to be applied for {time} entries, using Y.DataType.Date.format
    @attribute timeFormat
    @type String
    @default "%T"
    **/

  });


}, '@VERSION@', {"skinnable": "true", "requires": ["base-build", "datatable-base", "view"]});
