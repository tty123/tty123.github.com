'use strict';

var galleryApp = (function(){

    var byId = [], byCategory = [];

    var cloudinaryPfx ="http://res.cloudinary.com/danaia-art/image/upload/";

    function CloudinaryFit(image, limit)
    {
        return cloudinaryPfx+"c_fit,h_"+limit+",w_"+limit+image;
    }

    function CloudinaryFitHeight(image, limit)
    {
        return cloudinaryPfx+"c_fit,h_"+limit+image;
    }

    function getCategoryTitle (category){
        var el = document.getElementById(category);
        if (el == null) return "";
        el = el.getElementsByTagName("h2");
        if (el == null) return "";
        var t = el[0].innerText;
        if (t == null || t == "") return "Галерея";
        else return t;
    
    }

    function getUrlParameters(locationObj)
    {
        var url=null;
        var result = {};

        if (locationObj.pathname == "" || location.pathname == "/")
        {
        }
        else if (locationObj.pathname.startsWith('/pictures/'))
        {
            url=location.pathname.slice(10);
            if (url.endsWith(".html")) url=url.slice(0,-5);
            result["picture"]=url;
        }

        url=locationObj.search+locationObj.hash;

        if (url.substr(0,2) == "#!" ) url = url.slice(2);
        else if (url.substr(0,1) =="#") url = url.slice(1);
        else if (url.substr(0,1) =="?") url = url.slice(1);

        var sURLVariables = url.split('&');

        for (var i = 0; i < sURLVariables.length; i++)
        {
            var sParameterName = sURLVariables[i].split('=');
            result[sParameterName[0]]=sParameterName[1];
        }
        return result;
    }

    function showGallery(category, picture , onPopState){        
        var title = getCategoryTitle(category);
        var index = 0;
        var collection = byCategory[category];
        if (picture != null)
            for (var i = 0; i<collection.length; i++)
                if (collection[i] == picture) {
                    index = i;
                    break;
                }
        var el = document.getElementById(category);
        
        if (onPopState) //when user press back button
            window.lgData[el.getAttribute('lg-uid')].slide(index);
        else
            lightGallery(el, { dynamic: true,
                dynamicEl: collection,
                hideBarsDelay: 2000,
                closable: false,
                download: false,
                enableDrag: false,
                escKey: false ,
                index: index, 
                title: title,
                category: category     
                });
    }
    
    function route (category, onPopState)
    {
        var urlParams = getUrlParameters(window.location);
        var picture = byId[urlParams.picture];

        if (category == null ) //try get category from url
            category = urlParams.category;

        if (byCategory[category] == null) //actually no category exists
                category = null;
        
        if (category == null && picture !=null) //try get category from picture
            category = picture.Categories[0];

        if (category == null || category == "") 
        {
            //TODO: find current gallery and hide
            return;
        }
                   
        showGallery(category , picture , onPopState );
    }

    return {
        init: function (){
        console.log("init");
        pictures.list.forEach(
        function (p) {
            byId[p.Page] = p;
            if (!p.Categories) return;
            p.Categories.forEach( function (c)
                {
                    var cl =byCategory[c];
                    if (!cl)
                    {
                        cl = [ p ];
                        byCategory [c] = cl;
                    }
                    else
                        cl.push (p);
                }
            );

            //add light gallery specific attributes to picture object
            p.src = CloudinaryFitHeight(p.CloudinaryImages[0],800);
            //p.thumb = CloudinaryFitHeight(p.CloudinaryImages[0],700);
            p.subHtml = '<h2>'+p.Title+'</h2><p>'+p.Description+'</p>';
        });

         window.addEventListener("popstate", function(e){ route(null, true); });
         route();
    },

    route: route    
    }; 
})();