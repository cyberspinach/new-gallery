YUI.add('module-tests-pagview', function(Y) {

    var suite = new Y.Test.Suite('gallery-paginator-view'),
        Assert = Y.Test.Assert;

//
// Paginator Model tests
//
    suite.add(new Y.Test.Case({
        name: 'Gallery Paginator-View : PaginatorModel basics',

        setUp : function () {
            this.m = new Y.PaginatorModel();
        },

        tearDown : function () {
            delete this.m;
        },

        'should be a class': function() {
            Assert.isFunction(Y.PaginatorModel);
        },

        'should instantiate as a Model': function() {
            Assert.isInstanceOf( Y.Model, this.m, 'Not an instanceof Y.Model');
        },

        'listeners are set' : function(){
            Assert.areSame( 3, this.m._subscr.length, "Didn't find 3 listeners" )
        },

        'check ATTR defaults values' : function(){
            Assert.isNull( this.m.get('totalItems'), "totalItems not null" );
            Assert.isNull( this.m.get('itemsPerPage'), "itemsPerPage not null" );
            Assert.areSame( 1, this.m.get('page'), "page not 1" );
            Assert.isNull( this.m.get('lastPage'), "lastPage not null" );
            Assert.isNull( this.m.get('totalPages'), "totalPages not null" );
            Assert.isNull( this.m.get('itemIndexStart'), "itemIndexStart not 0" );
            Assert.isNull( this.m.get('itemIndexEnd'), "itemIndexEnd not 0" );
        }

    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery Paginator-View : PaginatorModel functional',

        setUp : function () {
            this.m = new Y.PaginatorModel();
        },

        tearDown : function () {
            delete this.m;
        },

        'check setting ATTRS' : function() {
            var nitem = 100, itemsPerPage=10;

        // check totalItems attr ...
            Assert.isNull( this.m.get('totalItems'), "totalItems not null" );
            this.m.set('totalItems',null);
            Assert.isNull( this.m.get('totalItems'), "totalItems not null" );
            this.m.set('totalItems',nitem);
            Assert.areSame( nitem, this.m.get('totalItems'), "Coundn't set totalItems to " + nitem );
            this.m.set('totalItems',null);
            Assert.areSame( nitem, this.m.get('totalItems'), "Improper set of totalItems=null, didn't stay at " + nitem );

        // check itemsPerPage attr ...
            Assert.isNull( this.m.get('itemsPerPage'), "itemsPerPage not null" );
            this.m.set('itemsPerPage', itemsPerPage);
            Assert.areSame( itemsPerPage, this.m.get('itemsPerPage'), "Coundn't set itemsPerPage to " + itemsPerPage );

        // check if recalcparams worked ...
            Assert.areSame( nitem/itemsPerPage, this.m.get('totalPages'), "Number of pages is incorrect");
            Assert.isNull( this.m.get('lastPage'), "lastPage not null" );

        },

        'Check page changes, last page, indices' : function() {
            var nitem = 100, itemsPerPage=10;

            this.m.set('itemsPerPage', itemsPerPage);
            this.m.set('totalItems',nitem);
            Assert.areSame( nitem/itemsPerPage, this.m.get('totalPages'), "Number of pages is incorrect");
            Assert.isNull( this.m.get('lastPage'), "lastPage not null" );

            this.m.set('page',5);
            Assert.areSame( 1, this.m.get('lastPage'),'Lastpage should be 1');
            Assert.areSame( 5, this.m.get('page'),'page should be 5');
            Assert.areSame( 40, this.m.get('itemIndexStart'),"itemIndexStart for page 5 should be 40");
            Assert.areSame( 49, this.m.get('itemIndexEnd'),"itemIndexEnd for page 5 should be 50");



        },

        'Check improper page changes, -1 and outside max' : function() {
            var nitem = 100, itemsPerPage=10;

            this.m.set('itemsPerPage', itemsPerPage);
            this.m.set('totalItems',nitem);

            this.m.set('page',5);
            this.m.set('page',0);
            Assert.areSame( 5, this.m.get('page'),'page should be 5');
            Assert.areSame( 1, this.m.get('lastPage'),'Lastpage should be 1');
            this.m.set('page',20);
            Assert.areSame( 5, this.m.get('page'),'page should be 5');
            Assert.areSame( 1, this.m.get('lastPage'),'Lastpage should be 1');
        },

        'Change totalItems, check totalPages and page change' : function() {
            var nitem = 100, itemsPerPage=10;

            this.m.set('itemsPerPage', itemsPerPage);
            this.m.set('totalItems',nitem);

            this.m.set('page',5);
            Assert.areSame( 5, this.m.get('page'),'page should be 5');
            Assert.areSame( 1, this.m.get('lastPage'),'Lastpage should be 1');

            this.m.set('totalItems',25);
            Assert.areSame( 3, this.m.get('totalPages'),'totalPages should be 3');
            Assert.areSame( 1, this.m.get('page'),'page should be 1');
            Assert.areSame( 5, this.m.get('lastPage'),'Lastpage should be 1');
        },

        'Change totalItems to zero, page and totalpages should be 1' : function() {
            var nitem = 100, itemsPerPage=10;

            this.m.set('itemsPerPage', itemsPerPage);
            this.m.set('totalItems',nitem);

            this.m.set('page',5);
            Assert.areSame( 5, this.m.get('page'),'page should be 5');
            Assert.areSame( 1, this.m.get('lastPage'),'Lastpage should be 1');

            this.m.set('totalItems',0);
            Assert.areSame( 1, this.m.get('totalPages'),'totalPages should be 1');
            Assert.areSame( 1, this.m.get('page'),'page should be 1');
            Assert.areSame( 5, this.m.get('lastPage'),'Lastpage should be 1');
        },

        'Check destroy and destruction' : function(){

            this.m.destroy(true);
            Assert.isNull( this.m._subscr, "destroy should kill all listeners" );

        }

    }));


//
// Paginator View tests
//

    suite.add(new Y.Test.Case({
        name: 'Gallery Paginator-View : PaginatorView basics',

        setUp : function () {
            //this.m = new Y.PaginatorModel();
            this.v = new Y.PaginatorView();
        },

        tearDown : function () {
            delete this.v;
            //delete this.m;
        },

        'should be a class': function() {
            Assert.isFunction(Y.PaginatorView);
        },

        'should instantiate as a View': function() {
            Assert.isInstanceOf( Y.View, this.v, 'Not an instanceof Y.View');
        },

        'listeners are set' : function(){
            Assert.areSame( 6, this.v._subscr.length, "Didn't find 9 listeners" )
        },

        'check ATTR defaults values' : function(){
            Assert.isNull( this.v.get('model'), "Default for Model is not null" );
            //Assert.isNull( this.v.get('container'), "Default for container is not null" );

            Assert.areSame( 3, this.v.get('pageOptions').length, "pageOptions default incorrect" );
            Assert.areSame( 9999, this.v.get('maxPageLinks'));
            Assert.areSame( 1, this.v.get('linkListOffset'));
            Assert.areSame( '...', this.v.get('pageLinkFiller') );
            Assert.areSame( 'Page {page}', this.v.get('selectPageFormat') );
            Assert.areSame( false, this.v.get('alwaysShowFirst') );
            Assert.areSame( false, this.v.get('alwaysShowLast') );
            Assert.areSame( false, this.v.get('circular') );

            //  paginatorTemplate, pageLinkTemplate, linkHighLight
            // alwaysShowFirst, alwaysShowLast, selectPageFormat

        }


    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery Paginator-View : PaginatorView functional',

        setUp : function () {
            this.m = new Y.PaginatorModel({totalItems:510, itemsPerPage:25, page:1});
            this.v = new Y.PaginatorView({
                model:      this.m,
                container:  '#pagCont'
            });
        },

        tearDown : function () {
            delete this.v;
            delete this.m;
        },


        'check initial setup / display' : function(){

            var css_pcont = 'yui3-pagview-container',
                css_active = 'yui3-pagview-link-page-active',
                css_pagelist = 'yui3-pagview-link-page-list',
             //data-pglink="n"
                css_disabled = 'yui3-pagview-disabled';


            this.v.render();

            var pcont = Y.one('.'+css_pcont),
                pnodes = pcont.all('a');

            Assert.areSame(21,this.m.get('totalPages'));
            Assert.areSame(1,this.m.get('page'));

            //
            //  We should be on Page 1,
            //     make sure page 1 link is highlighted and FIRST / PREV are disabled
            //
            Assert.areSame((21+4),pnodes.size());
            Assert.isTrue( pnodes.item(2).hasClass(css_active) );
            Assert.isTrue( pnodes.item(0).hasClass(css_disabled) );
            Assert.isTrue( pnodes.item(1).hasClass(css_disabled) );


        },

        'check moving pages, F/P and N/LAST functionality' : function(){

            var css_pcont = 'yui3-pagview-container',
                css_active = 'yui3-pagview-link-page-active',
                css_pagelist = 'yui3-pagview-link-page-list',
                css_disabled = 'yui3-pagview-disabled';


            this.v.render();

            var pcont = Y.one('.'+css_pcont),
                pnodes = pcont.all('a');

            Assert.areSame(21,this.m.get('totalPages'));
            Assert.areSame(1,this.m.get('page'));

            //
            //  We should initially be on Page 1,
            //     make sure page 1 link is highlighted and FIRST / PREV are disabled
            //
            Assert.areSame((21+4),pnodes.size());
            Assert.isTrue( pnodes.item(2).hasClass(css_active) );
            Assert.isTrue( pnodes.item(0).hasClass(css_disabled) );
            Assert.isTrue( pnodes.item(1).hasClass(css_disabled) );

            // try to click "prev" or "first" from page 1
            pcont.one('a[data-pglink="first"]').simulate('click');
            Assert.areSame(1,this.m.get('page'));
            pcont.one('a[data-pglink="prev"]').simulate('click');
            Assert.areSame(1,this.m.get('page'));


            //
            // Move to page 5, F/P and N/L should enable, page 5 should be active
            //
            this.m.set('page',5);
            Assert.areSame( pnodes.item(6), pcont.one('a[data-pglink="5"]') );
            Assert.isTrue( pnodes.item(6).hasClass(css_active) );
            Assert.isFalse( pcont.one('a[data-pglink="first"]').hasClass(css_disabled) );
            Assert.isFalse( pcont.one('a[data-pglink="prev"]').hasClass(css_disabled) );
            Assert.isFalse( pcont.one('a[data-pglink="next"]').hasClass(css_disabled) );
            Assert.isFalse( pcont.one('a[data-pglink="last"]').hasClass(css_disabled) );

            //
            // Move to last page, N/L should disable
            //
            this.m.set('page',21);
            Assert.isTrue( pcont.one('a[data-pglink="21"]').hasClass(css_active) );
            Assert.isFalse( pcont.one('a[data-pglink="first"]').hasClass(css_disabled) );
            Assert.isFalse( pcont.one('a[data-pglink="prev"]').hasClass(css_disabled) );
            Assert.isTrue( pcont.one('a[data-pglink="next"]').hasClass(css_disabled) );
            Assert.isTrue( pcont.one('a[data-pglink="last"]').hasClass(css_disabled) );

        },


        'check moving pages via a "click" to page 7' : function(){

            var css_pcont = 'yui3-pagview-container',
                css_active = 'yui3-pagview-link-page-active',
                css_pagelist = 'yui3-pagview-link-page-list',
                css_disabled = 'yui3-pagview-disabled';

            this.v.render();

            var pcont = Y.one('.'+css_pcont),
                pnodes = pcont.all('a');

            pcont.one('a[data-pglink="7"]').simulate('click');

            Assert.areSame( 7, this.m.get('page'), 'Model page should be 7');
            Assert.isTrue( pcont.one('a[data-pglink="7"]').hasClass(css_active), "current page link should be 7" );
            Assert.isTrue( pcont.one('a.'+css_active).hasClass(css_active), "check 'active page link' css on page 7" );
        },


        'Check destroy and destruction' : function(){
            this.v.destroy(true);
            Assert.isNull( this.v._subscr, "destroy should kill all listeners" );
            //Assert.isNull( this.v.get('container'), "should empty the container" );

        }

    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery Paginator-View : PaginatorView functional circular',

        setUp : function () {
            this.m = new Y.PaginatorModel({totalItems:510, itemsPerPage:25, page:1});
            this.v = new Y.PaginatorView({
                model:      this.m,
                container:  '#pagCont',
                circular:   true
            });
        },

        tearDown : function () {
            delete this.v;
            delete this.m;
        },


        'check circular : backward from page 2, click prev twice should be page 21' : function(){

            var css_pcont = 'yui3-pagview-container',
                css_active = 'yui3-pagview-link-page-active',
                css_pagelist = 'yui3-pagview-link-page-list',
                css_disabled = 'yui3-pagview-disabled';

            this.v.render();

            var pcont = Y.one('.'+css_pcont),
                pnodes = pcont.all('a');

            Assert.isTrue(this.v.get('circular'));

        //
        //  Start at page 2, click 'prev' twice
        //
            pcont.one('a[data-pglink="2"]').simulate('click');

            Assert.areSame( 2, this.m.get('page'), 'Model page should be 2');
            Assert.isTrue( pcont.one('a[data-pglink="2"]').hasClass(css_active), "current page link should be 2" );
            Assert.areSame( "2", pcont.one('a.'+css_active).getHTML(), "check 'active page link' css on page 2" );


            pcont.one('a[data-pglink="1"]').simulate('click');
       // why doesn't this work ?
       //     pcont.one('a[data-pglink="first"]').simulate('click');

            Assert.areSame( 1, this.m.get('page'), 'Model page should be 1');
            Assert.isFalse( pcont.one('a[data-pglink="first"]').hasClass(css_disabled) );
            Assert.isFalse( pcont.one('a[data-pglink="prev"]').hasClass(css_disabled) );
            Assert.areSame( "1", pcont.one('a.'+css_active).getHTML(), "check 'active page link' css on page 1" );

            pcont.one('a[data-pglink="prev"]').simulate('click');

            Assert.areSame( 21, this.m.get('page'), 'Model page should be 21');
            Assert.isFalse( pcont.one('a[data-pglink="first"]').hasClass(css_disabled) );
            Assert.isFalse( pcont.one('a[data-pglink="prev"]').hasClass(css_disabled) );
            Assert.areSame( "21", pcont.one('a.'+css_active).getHTML(), "check 'active page link' css on page 21" );


        //  Forward check ...
        //  Start at page 20, click 'next' twice
        //
            pcont.one('a[data-pglink="20"]').simulate('click');

            Assert.areSame( 20, this.m.get('page'), 'Model page should be 20');
            Assert.isTrue( pcont.one('a[data-pglink="20"]').hasClass(css_active), "current page link should be 20" );
            Assert.areSame( "20", pcont.one('a.'+css_active).getHTML(), "check 'active page link' css on page 20" );

            pcont.one('a[data-pglink="21"]').simulate('click');
            Assert.areSame( 21, this.m.get('page'), 'Model page should be 21');
            Assert.isTrue( pcont.one('a[data-pglink="21"]').hasClass(css_active), "current page link should be 21" );
            Assert.areSame( "21", pcont.one('a.'+css_active).getHTML(), "check 'active page link' css on page 21" );
            Assert.isFalse( pcont.one('a[data-pglink="last"]').hasClass(css_disabled) );
            Assert.isFalse( pcont.one('a[data-pglink="next"]').hasClass(css_disabled) );

            pcont.one('a[data-pglink="next"]').simulate('click');
            Assert.areSame( 1, this.m.get('page'), 'Model page should be 1');
            Assert.isTrue( pcont.one('a[data-pglink="1"]').hasClass(css_active), "current page link should be 1" );
            Assert.areSame( "1", pcont.one('a.'+css_active).getHTML(), "check 'active page link' css on page 1" );

        },


    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
