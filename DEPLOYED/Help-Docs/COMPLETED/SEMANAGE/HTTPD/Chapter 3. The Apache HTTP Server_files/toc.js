var work = 1;
var name_c = window.location.hostname + '-publican';
var num_days = 7;
var name_cp = window.location.hostname + '-publican-current_page';
var name_menu = window.location.hostname + '-publican-menu';
var style = 1;
var toc_path = '';
site_title = 'Documentation';

function setCookie(name, value, expires, path, domain, secure) { 
	var curCookie = name + "=" + value + 
		((expires) ? ";expires=" + expires.toGMTString() : "") + 
		((path) ? ";path=" + path : "");
// + 
//		((domain) ? ";domain=" + domain : "") + 
//		((secure) ? ";secure" : ""); 

	document.cookie = curCookie; 
}

function expand_menu(id) {
	if(work) {
		work = 0;
		var entity = document.getElementById(id);
		if(entity) {
			var my_class = entity.className;
			var my_parent = entity.parentNode;
			if(my_class.indexOf("hidden") != -1) {
				entity.className = my_class.replace(/hidden/,"visible");
				my_parent.className = my_parent.className.replace(/collapsed/,"expanded");
			}
		}
	}
}

function retract_menu(id) {
	if(work) {
		work = 0;
		var entity = document.getElementById(id);
		if(entity) {
			var my_class = entity.className;
			var my_parent = entity.parentNode;
			if(my_class.indexOf("visible") != -1) {
				entity.className = my_class.replace(/visible/,"hidden");
				my_parent.className = my_parent.className.replace(/expanded/,"collapsed");
			}
		}
	}
}

function loadToc() {
	var my_select = document.getElementById('langselect');
	if (my_select.selectedIndex > 0) {
		var expDate = new Date();
		expDate.setDate(expDate.getDate() + num_days);
		setCookie(name_c + '-lang', my_select.options[my_select.selectedIndex].value, expDate, '/', false, false);	    
		location.href="../" + my_select.options[my_select.selectedIndex].value + "/toc.html";
//		parent.frames.main.location.replace("../" + my_select.options[my_select.selectedIndex].value + "/index.html");
	}
}

function loadDocNav(ajq) {
        var topDocNav = getTopDocNav(ajq);
        var bottomDocNav = getBottomDocNav(ajq);

        updateDocNavItems(getCurrentPageName(), topDocNav, bottomDocNav);

        var onChange = function() {
            var currentPage = getCurrentPageName();
            var newSelection = ajq(this).val();
            window.location = newSelection; 
            if (newSelection.indexOf(currentPage) === 0) {
                updateDocNavItems(newSelection, getTopDocNav(ajq), getBottomDocNav(ajq));            
            }
        };
        topDocNav.change(onChange);
        bottomDocNav.change(onChange);
}

function getCurrentPageName() {
        return window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
}

function updateDocNavItems(filename, topDocNav, bottomDocNav) {
        topDocNav.val(filename);
        bottomDocNav.val(filename);
}

function getTopDocNav(ajq) {
    return ajq(".docnav.top").find(".pageSelect");
}

function getBottomDocNav(ajq) {
    return ajq(".docnav.bottom").find("select");
}

function scrollToTarget(ajq) {
    if(ajq(window.location.hash).length > 0){
        ajq('html, body').animate({ scrollTop: ajq(window.location.hash).offset().top}, 1000);
    }
}

function checkMenu() {
	if(document.cookie) {
		var cookies = document.cookie.split(/ *; */);
		for(var i=0; i < cookies.length; i++) {
			var current_c = cookies[i].split("=");
			if(current_c[0] == name_menu) {
				var menu_status = current_c[1];
				if(menu_status == "closed") {
					hideMenu();				}
				break;
			}
		}

	}
}

function hideMenu() {
	parent.document.body.className = parent.document.body.className = "toc_embeded notoc";
	var entity = parent.document.getElementById('tocframe');
	if(entity) {
		entity.className = "notoc";
	}

	document.body.className = "toc_embeded notocnav";

	entity = document.getElementById('closemenu');
	if(entity) {
		entity.className = entity.className.replace(/visible/,"hidden");
	}
	entity = document.getElementById('outer');
	if(entity) {
		entity.className = entity.className.replace(/visible/,"hidden");
	}
	entity = document.getElementById('openmenu');
	if(entity) {
		entity.className = entity.className.replace(/hidden/,"visible");
	}

	var expDate = new Date();
	expDate.setDate(expDate.getDate() + num_days);
	setCookie(name_menu, 'closed', expDate, '/', false, false);
}

function showMenu() {
	parent.document.body.className = parent.document.body.className = "toc_embeded";
	var entity = parent.document.getElementById('tocframe');
	if(entity) {
		entity.className = "toc";
	}

	document.body.className = "tocnav";

	entity = document.getElementById('closemenu');
	if(entity) {
		entity.className = entity.className.replace(/hidden/,"visible");
	}
	entity = document.getElementById('outer');
	if(entity) {
		entity.className = entity.className.replace(/hidden/,"visible");
	}
	entity = document.getElementById('openmenu');
	if(entity) {
		entity.className = entity.className.replace(/visible/,"hidden");
	}
	var expDate = new Date();
	expDate.setDate(expDate.getDate() + num_days);
	setCookie(name_menu, 'open', expDate, '/', false, false);
}

function placeBcrumbs(ajq) {
    ajq('#doc_menu').remove().prependTo('#main-top').wrap('<div class="wrapi"></div>');
}

function runAnalytics(ajq) {
    /*
    var pkBaseUrl = (('https:' == document.location.protocol) ? 'https://engstats.redhat.com/piwik/' : 'http://engstats.redhat.com/piwik/');
    var pkUrl = pkBaseUrl + 'piwik.js';
    ajq('body').append('<noscript><p><img src="https://engstats.redhat.com/piwik/piwik.php?idsite=3" style="border:0" alt="" /></p></noscript>');
    require([pkUrl], function() {
        try {
            var piwikTracker = Piwik.getTracker(pkBaseUrl + 'piwik.php', 3);
            if (document.location.hostname == 'access.redhat.com') {
                piwikTracker.trackPageView();
                piwikTracker.enableLinkTracking();
            }
        } catch(err) {}    
    }); 
    */
}

function initializeBreadcrumbs(toc_path, current_product, current_version, current_book) {

    jQuery("#navigation").load('index.html div > div.toc:eq(0)', function(responseData){
        jQuery('#navigation').append('<button onclick="toggleToc();" class="menu-toggle"><span></span></button>');
    });

    // Set the siteMapState variable so that the support tab is active when the breadcrumbs are created.
    window.siteMapState = "support";

    var support_label = labels["trans_strings"]["Support"];
    var knowledge_label = labels["trans_strings"]["Knowledge"];
    var doc_label = labels["trans_strings"]["Product_Documentation"];

    // Create the very basic breadcrumb array
    var doc_array = [doc_label];
    var breadcrumbs = [
        [support_label, "/support/"],
        doc_array
    ];

    // Create the base breadcrumb, which will later be replaced with the extended version
    if(typeof current_product != "undefined" && current_product != '') {
        var prod_label;
        if(current_product != 'Products') {
            prod_label = labels[current_product]["label"];
        } else {
            prod_label = labels["trans_strings"]["Products"];
        }

        var prod_array = [prod_label];
        breadcrumbs.push(prod_array);

        doc_array[1] = "../";

        if (typeof current_version != "undefined" && current_version != '') {
            var version_array = [current_version];
            breadcrumbs.push(version_array);

            doc_array[1] = "../../";
            prod_array[1] = "../";

            if(typeof current_book != "undefined" && current_book != '') {
                doc_array[1] = "../../../../";
                prod_array[1] = "../../../";
                version_array[1] = "../../";
                if(current_book != "Books") {
                    breadcrumbs.push(labels[current_product][current_version][current_book]["label"]);
        	} else {
            		breadcrumbs.push(labels["trans_strings"]["Books"]);
        	}
            }
        }
    }

    window.breadcrumbs = breadcrumbs;

        chrometwo_require(['chrome_lib'], function (lib) {
            lib.whenBreadcrumbsReady(function(ajq) {
                loadMenu2(ajq, toc_path, current_product, current_version, current_book);
                styleToc();
            });
        });

        jQuery(window).scroll(function(e){
            styleToc();
        });

        jQuery(window).resize(function(e){
            styleToc();
        });
}

function styleToc() {
    
    var el = document.getElementById('main-top');
    var my_top = 104;

    if(el) {
         my_top = el.getBoundingClientRect().bottom;
    }

    if(my_top <= 0) { my_top = 0;}

    var main = document.getElementById('main');
    var main_height =  main.getBoundingClientRect().height;
    var main_bottom =  main.getBoundingClientRect().bottom;
    var main_top = main.getBoundingClientRect().top;

    var height = main_height;
    if(height > ((window.innerHeight || document.documentElement.clientHeight) - my_top)) {
        height = (window.innerHeight || document.documentElement.clientHeight) - my_top;
    }

    if(height > main_bottom) {
        height = main_bottom;
    }

    if(jQuery("#navigation").hasClass('fixed')) { height = 20; }

    if(jQuery('#navigation').is(':visible')) {
        jQuery('#navigation').css({'top': my_top + 'px', 'height': height });
        jQuery('#navigation > .toc').css({'top': my_top + 'px', 'height':'calc(' + height +'px - 1.8em)' });
    }
}

function loadMenu2(ajq, toc_path, current_product, current_version, current_book) {
    var breadcrumbs = ajq("#breadcrumbs");

    // We only care about fixing up the default breadcrumbs if we have a current product
    if(typeof current_product != "undefined" && current_product != '') {

        // Remove the dummy Product Documentation text node
        var breadcrumbsDiv = breadcrumbs.get(0);
        while (breadcrumbsDiv.childNodes.length > 1) {
            breadcrumbsDiv.removeChild(breadcrumbsDiv.lastChild);
        }

        // Calculate the product label
        var prod_label;
        if(current_product != 'Products') {
            prod_label = labels[current_product]["label"];
        } else {
            prod_label = labels["trans_strings"]["Products"];
        }

        var book_label = labels["trans_strings"]["Books"];
        
        if(current_book != 'Books') {
           book_label  = labels[current_product]["label"];
         }

        // Convert the default menu into something we can use
        var html = '<a href="' + toc_path + '/index.html">' + labels["trans_strings"]["Product_Documentation"] + '</a>';
        if(typeof current_version != "undefined" && current_version != '') {
            html += '<div id="product_menu" onmouseover="work=1; expand_menu(\'product_menu_list\');" onmouseout="work=1; retract_menu(\'product_menu_list\');">' + prod_label + '</div>';
            if(typeof current_book != "undefined" && current_book != '') {
                html += '<div id="version_menu" onmouseover="work=1; expand_menu(\'version_menu_list\');" onmouseout="work=1; retract_menu(\'version_menu_list\');">' + current_version + '</div>';

                html += '<div id="book_menu" onmouseover="work=1; expand_menu(\'book_menu_list\');" onmouseout="work=1; retract_menu(\'book_menu_list\');">' + book_label + '</div>';

                if(current_book != 'Books') {              
                    html += '<div id="left-menu"><div id="book_format_menu" onmouseover="work=1; expand_menu(\'book_format_menu_list\');" onmouseout="work=1; retract_menu(\'book_format_menu_list\');"></div>';
                    html += '<div id="book_lang_menu" onmouseover="work=1; expand_menu(\'book_lang_menu_list\');" onmouseout="work=1; retract_menu(\'book_lang_menu_list\');"></div>';
                    html += '<div id="lang_menu_label">' + '</div></div>';
                }
            } else {
                html += '<div id="version_menu" onmouseover="work=1; expand_menu(\'version_menu_list\');" onmouseout="work=1; retract_menu(\'version_menu_list\');">' + current_version + '</div>';
            }
        } else {
            html += '<div id="product_menu" onmouseover="work=1; expand_menu(\'product_menu_list\');" onmouseout="work=1; retract_menu(\'product_menu_list\');">' + prod_label + '</div>';
        }
        breadcrumbs.append(html);

        // Load and add the hover menus
        ajq("#product_menu").load(toc_path + "/products_menu.html");
        ajq("#version_menu").load(toc_path +  '/' + current_product + "/versions_menu.html");
        if(typeof current_version != "undefined" && current_version != '') {
            ajq("#book_menu").load(toc_path + '/' + current_product + '/' +  current_version + '/' +  "/books_menu.html");
            if(typeof current_book != "undefined" && current_book != '') {
                ajq("#book_lang_menu").load(toc_path + '/' +  current_product + '/' +  current_version +  '/' + current_book + "/lang_menu.html");
                ajq("#book_format_menu").load(toc_path + '/' +  current_product + '/' +  current_version +  '/' + current_book + "/format_menu.html");
            }
        }
    }

    // For splash pages the language menu is loaded in a global javascript variable
    if (typeof lang_menu_2_div != "undefined" && lang_menu_2_div != '') {
        breadcrumbs.append(lang_menu_2_div);
    }

    ajq(document).ready(function(ajq) {
        checkToc();      
        ajq(".doctoc").load('index.html .toc:eq(0)', function() {
            loadDocNav(ajq);
        });
        scrollToTarget(ajq);
    });
}

function checkToc() {
	if(document.cookie) {
		var cookies = document.cookie.split(/ *; */);
		for(var i=0; i < cookies.length; i++) {
			var current_c = cookies[i].split("=");
			if(current_c[0] == name_menu) {
				var menu_status = current_c[1];
				if(menu_status == "closed") {
					hideToc();				}
				break;
			}
		}

	}
}

function toggleToc() {
	if(jQuery("#navigation").hasClass('fixed')) {
		showToc();
        } else {
		hideToc();
        }
}

function hideToc() {
	jQuery("#navigation button").addClass('fixed');
	jQuery("#navigation").addClass('fixed');
	jQuery("#content").addClass('noLtoc');
        styleToc();

	var expDate = new Date();
	expDate.setDate(expDate.getDate() + num_days);
	setCookie(name_menu, 'closed', expDate, '/', false, false);
}

function showToc() {
	jQuery("#navigation button").removeClass('fixed');
	jQuery("#navigation").removeClass('fixed');
	jQuery("#content").removeClass('noLtoc');
        styleToc();

	var expDate = new Date();
	expDate.setDate(expDate.getDate() + num_days);
	setCookie(name_menu, 'open', expDate, '/', false, false);
}

