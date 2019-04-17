var WM = WM || {};
WM.IconFonts = WM.IconFonts || {};
WM.IconFonts.FontAwesome = WM.IconFonts.FontAwesome || {};
WM.IconFonts.Watermelon = WM.IconFonts.Watermelon || {};

(function ($) {
    "use strict"; // Start of use strict

    function makeIconViewer(rootElem, data) {
        rootElem.empty();
        var iconCount = 0;
        var rhElem = $('<div>');
        rootElem.append(rhElem);
        for (const key in data) {
            const iconObj = data[key];
            const icons = iconObj.icons;

            if (iconObj.mode == 'symbol') {
            } else if(iconObj.mode == 'fontclass' && $.trim(iconObj.css) != '') {
                var cssElem = undefined;
                $('link[rel=stylesheet]').each(function(n, o) {
                    var that = $(o);
                    if(that.attr('href') == iconObj.css) {
                        cssElem = that;
                        return false;
                    }
                });

                if(!cssElem) {
                    cssElem = $('<link rel="stylesheet">').attr('href', iconObj.css);
                    $('head').append(cssElem);
                }
            }

            var cElem = $('<div class="card mt-1">');
            var chElem = $('<div class="card-header">');
            var cbElem = $(`<div class="card-body" id="fademo-${iconObj.name}">`);
            cElem.append(chElem);
            cElem.append(cbElem);
            var rowElem = $('<div class="row">');
            var count = 0;
            icons.forEach(icon => {

                var iElem = null;
                if (iconObj.mode == 'symbol') {
                    iElem = $('<svg aria-hidden="true">').addClass(iconObj.cls).addClass(iconObj.excls);
                    iElem.append($(`<use xlink:href="#${iconObj.prefix + icon}"></use>`));
                } else {
                    iElem = $('<i></i>').addClass(iconObj.cls).addClass(iconObj.excls).addClass(iconObj.prefix + icon);
                }
                var lElem = $('<span>').html(icon);
                var dElem = $('<div class="iconcontrainer col-sm-1 py-1">');
                dElem.append($('<div class="iconviewer py-2">').append(iElem));
                dElem.append($('<div class="icontitle align-middle">').append(lElem));
                rowElem.append(dElem);
                count++;
            });

            var ctlElem = $('<i class="fas fa-minus"></i>');
            chElem.append($(`<a class="btn btn-outline-primary btn-sm" data-toggle="collapse" href="#fademo-${iconObj.name}"></a>`).append(ctlElem));
            chElem.append($('<kbd class="ml-1 badge badge-primary">').html(iconObj.name));
            chElem.append($('<span class="ml-1 badge badge-warning">').html(`${count}个图标`));
            chElem.append($('<kbd class="ml-1 badge badge-success">').html(`${iconObj.cls} ${iconObj.prefix}`));
            cbElem.append(rowElem);
            rootElem.append(cElem);

            iconCount += count;

            cbElem.data('ctlElem', ctlElem);
            cbElem.collapse('show');
            cbElem.on('shown.bs.collapse', function () {
                var that = $(this);
                var ctlElem = that.data('ctlElem');
                ctlElem.removeClass('fa-plus');
                ctlElem.addClass('fa-minus');
            });
            cbElem.on('hidden.bs.collapse', function () {
                var that = $(this);
                var ctlElem = that.data('ctlElem');
                ctlElem.removeClass('fa-minus');
                ctlElem.addClass('fa-plus');
            });
        }
        rhElem.append($('<span class="ml-1 badge badge-primary">').html(`${iconCount}个图标`));
    }

    makeIconViewer($('#nav-fontawesome'), WM.IconFonts.FontAwesome);
    makeIconViewer($('#nav-watermelon'), WM.IconFonts.Watermelon);

})(jQuery); // End of use strict
