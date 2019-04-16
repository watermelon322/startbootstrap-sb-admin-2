var wm = wm || {};
wm.iconfonts = wm.iconfonts || {};
wm.iconfonts.fontawesome = wm.iconfonts.fontawesome || {};
wm.iconfonts.watermelon = wm.iconfonts.watermelon || {};

(function ($) {
    "use strict"; // Start of use strict

    function makeIconViewer(rootElem, iconObj) {
        rootElem.empty();
        var iconCount = 0;
        var rhElem = $('<div>');
        rootElem.append(rhElem);
        for (const key in iconObj) {
            if (iconObj.hasOwnProperty(key)) {
                const faobj = iconObj[key];
                const icons = faobj.icons;
    
                var cElem = $('<div class="card mt-1">');
                var chElem = $('<div class="card-header">');
                var cbElem = $(`<div class="card-body" id="fademo-${faobj.name}">`);
                cElem.append(chElem);
                cElem.append(cbElem);
                var rowElem = $('<div class="row">');
                var count = 0;
                icons.forEach(icon => {
    
                    var iElem = $('<i></i>').addClass(faobj.cls).addClass(faobj.excls).addClass(faobj.prefix + icon);
                    var lElem = $('<span>').html(icon);
                    var dElem = $('<div class="iconcontrainer col-sm-1 py-1">');
                    dElem.append($('<div class="iconviewer">').append(iElem));
                    dElem.append($('<div class="icontitle align-middle">').append(lElem));
                    rowElem.append(dElem);
                    count++;
                });
    
                var ctlElem = $('<i class="fas fa-minus"></i>');
                chElem.append($(`<a class="btn btn-outline-primary btn-sm" data-toggle="collapse" href="#fademo-${faobj.name}"></a>`).append(ctlElem));
                chElem.append($('<kbd class="ml-1 badge badge-primary">').html(faobj.name));
                chElem.append($('<span class="ml-1 badge badge-secondary">').html(`${count}个图标`));
                chElem.append($('<kbd class="ml-1 badge badge-success">').html(`${faobj.cls} ${faobj.prefix}`));
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
        }
        rhElem.append($('<span class="ml-1 badge badge-primary">').html(`${iconCount}个图标`));
    }

    makeIconViewer($('#nav-fontawesome'), wm.iconfonts.fontawesome);
    makeIconViewer($('#nav-watermelon'), wm.iconfonts.watermelon);

})(jQuery); // End of use strict
