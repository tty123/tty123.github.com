
var galleryApp = {};


var byId = [];
var byCategory=[];

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

function renderCategory(category)
{
    tbody=$('#gallery-table-body');
    tbody.hide();
    itemTemplate=$('#gallery-item-template');
    tbody.empty();
    var items =  byCategory[category];



    var inRow = 3; rowLimit = 3;
    var tr;
    for (var i=0; i<items.length; i++)
    {
        var item = items [i];
        if (inRow == rowLimit)
        {
            tr =$("<tr>");
            tbody.append(tr);
            inRow =0;
        }
        inRow++;
        var itemCell=itemTemplate.clone();
        itemCell.find("#gallery-item-text").text(item.Title);
        var cpa =""+item.Page+",'"+category+"',"+i;
        itemCell.find("#gallery-item-link").attr("onclick","galleryApp.clickPicture( "+cpa+" );");
        var sizePfx = item.PicasaSize || "";
        itemCell.find("#gallery-item-image").attr('src',item.PicasaImages[0]+"s300"+sizePfx+"/");
        itemCell.appendTo(tr);
    }
    tbody.show();
}

function renderPicture( id, category, index )
{

    $("#picture-viewer").hide();
    var item=byId[id];
    var sizePfx = item.PicasaSize || "";
    $('meta[name=description]').attr('content', item.Title+'    '+item.Description);
    $('#large').css ("backgroundImage",'url('+item.PicasaImages[0]+"s"+730+sizePfx+"/"+')');
    $("#viewer-title").text(item.Title);
    $("#viewer-description").text(item.Description);
    $("#viewer-fragment-description").text('');
    $("#viewer-thumb-1").hide();
    $("#viewer-thumb-2").hide();
    $("#viewer-thumb-3").hide();
    $("#viewer-thumb-4").hide();
    $("#viewer-thumb-5").hide();
    $("#viewer-thumb-6").hide();
    $("#viewer-thumb-7").hide();
    $("#viewer-thumb-8").hide();
    $("#viewer-thumb-9").hide();
    $("#viewer-thumb-10").hide();
    $("#viewer-thumb-11").hide();
    $("#viewer-thumb-12").hide();
    $("#viewer-thumb-13").hide();
    $("#viewer-thumb-14").hide();

    $("#viewer-prev-cell").hide();
    $("#viewer-next-cell").hide();

    if (item.PicasaImages.length > 1)
    {
        for (var i=0; i<item.PicasaImages.length; i++)
        {
            var t=$("#viewer-thumb-"+(i+1));
            t.attr("src",item.PicasaImages[i]+"h50"+sizePfx+"/");
            if (item.Fragments && item.Fragments.length > i)
                t.attr("data-description",item.Fragments[i]);
            else
                t.attr("data-description",'');
            t.show();
        }
    }

    if (byCategory[category])
    {
        if (index>0)
        {
            var cpa =""+ byCategory[category][index-1].Page+",'"+category+"',"+(index-1);
            $("#viewer-prev-cell").find('a').attr("href","javascript: galleryApp.clickPicture( "+cpa+" );");
            $("#viewer-prev-cell").show();
        }
        if (index < byCategory[category].length-1)
        {
            var cpa =""+ byCategory[category][index+1].Page+",'"+category+"',"+(index+1);
            $("#viewer-next-cell").find('a').attr("href","javascript: galleryApp.clickPicture( "+cpa+" );");
            $("#viewer-next-cell").show();
        }
    }

    $("#picture-viewer").show();
}


function routeApp (e)
{
    var route=getUrlParameters(location);
    if (route.picture && byId[route.picture])
    {
        var category;
        var pic = byId[route.picture];

        if (route.category && byCategory[route.category])
                category = route.category;
        else if (pic.Categories && pic.Categories.length>0)
            category = pic.Categories[0];
        else
            category = 'news';

        var cl = byCategory[category];
        for (var i=0; i<cl.length; i++)
            if (cl[i].Page == route.picture)
               break;

        if (i>=0 && i<cl.length)
            galleryApp.clickPicture(route.picture,category,i);
        else
            galleryApp.clickCategory(category);
    }
    else if (route.category && byCategory[route.category])
    {
        galleryApp.clickCategory(route.category);
    }
    else if (route.hasOwnProperty('about'))
    {
        galleryApp.clickAbout();
    }
    else if (route.hasOwnProperty('contacts'))
    {
    }
    else
        galleryApp.clickCategory("news");
}

galleryApp.clickCategory = function (category)
{
    $("#picture-viewer").hide();
    $("#about").show();
    document.title = "Danaia Art";

    renderCategory(category);

    var loc =  '/?category='+category;
    ga('send', 'pageview', loc);
    history.pushState(null, null, loc);
};

galleryApp.clickPicture = function ( id, category, index )
{
    $("#gallery-table-body").hide();
    $("#about").hide();
    renderPicture( id, category, index);

    var loc = '/pictures/'+id+'.html?category='+category;
    var item = byId[id];
    var sizePfx = item.PicasaSize || "";
    document.title = "Danaia Art - "+item.Title;

    ga('send', 'pageview', loc);

    try
    {
        document.getElementById('vk_button').innerHTML =
        VK.Share.button(
            { url:   window.location.origin+'/pictures/'+id+'.html',
            title: item.Title,
            description: item.Description,
            image: item.PicasaImages[0]+"h"+200+sizePfx+"/",
            noparse: true}, {type: 'round_nocount', text: 'Поделиться'});
    }
    catch (e)
    {
        console.log(e);
    }

    history.pushState(null, null, loc);

};


galleryApp.clickAbout = function ()
{
    $("#picture-viewer").hide();
    $("#about").show();
    var loc = '/#about';
    ga('send', 'pageview', loc);
    history.pushState(null, null, loc);

}

galleryApp.init = function ()
{
    console.log("init");
    pictures.list.forEach(
        function (p)
        {
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
        }
    );

    window.addEventListener("popstate", routeApp);
    routeApp(null);
}
