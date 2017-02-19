var pictures = require ('../assets/js/pictures.js');
var domainName="http://danaia-art.com/";
var mainHtml ="index.html";
var destinationPath = "./pictures/";
var siteMapFile = "sitemap.txt";

var sitemap = domainName+"index.html\n";

var cloudinary = "http://res.cloudinary.com/danaia-art/image/upload/";

var cheerio = require('cheerio');
var fs = require('fs');


var i=0;
function CloudinaryFitHeight(image, limit)
{
        return cloudinary+"c_fit,h_"+limit+image;
}

pictures.list.forEach(
        function (p)
        {
            //use decodeEntities=false to keep non escaped non ASCII characters
            var pageUrl = domainName+"pictures/"+ p.Page+".html";
            $ = cheerio.load(fs.readFileSync(mainHtml), {decodeEntities: false});
            $("title").append(" - "+ p.Title);
            $("#stitle").text(p.Title);
            $("#sdescr").text(p.Description);
            $("#simg").attr("src",CloudinaryFitHeight(p.CloudinaryImages[0],150));            
            
            $("meta[name='description']").attr('content',p.Title+"  "+p.Description);
            $("meta[name='keywords']").attr('content', p.Title+','+p.Description 
                + ',' + $("meta[name='keywords']").attr('content'));                        
            $("meta[property='og:title']").attr('content', 
                $("meta[property='og:title']").attr('content') +' - '+p.Title); 
            $("meta[property='og:url']").attr('content', pageUrl);
            $("meta[property='og:type']").attr('content', 'article');
            $("meta[property='og:description']").attr('content', p.Title+"  "+p.Description);
            $("meta[property='og:image']").attr("content",CloudinaryFitHeight(p.CloudinaryImages[0],150));            
            
            $("meta[itemprop='name']").attr('content', 
                $("meta[itemprop='name']").attr('content') +' - '+p.Title); 
            $("meta[itemprop='url']").attr('content', pageUrl);
            $("meta[itemprop='description']").attr('content', p.Title+"  "+p.Description);
            $("meta[itemprop='thumbnailUrl']").attr("content",CloudinaryFitHeight(p.CloudinaryImages[0],150));            
            $("link[rel='image_src']").attr("href",CloudinaryFitHeight(p.CloudinaryImages[0],800));            
            $("meta[itemprop='image']").attr("content",CloudinaryFitHeight(p.CloudinaryImages[0],800));            
            
            $("meta[name='twitter:title']").attr('content', 
                $("meta[name='twitter:title']").attr('content') +' - '+p.Title); 
            $("meta[name='twitter:url']").attr('content', pageUrl);            
            $("meta[name='twitter:description']").attr('content', p.Title+"  "+p.Description);
            $("meta[name='twitter:image']").attr("content",CloudinaryFitHeight(p.CloudinaryImages[0],150));            

            //$("#picture-viewer").css('display','block');
            //$('#large').css ("backgroundImage",'url('+p.PicasaImages[0]+"s"+730+"/"+')');            
            //$("#viewer-description").text(p.Description);
            //$("#viewer-fragment-description").text('');
            fs.writeFileSync(destinationPath+p.Page+'.html',$.html());
            sitemap+=pageUrl+"\n";
            i++;
        }
    );

fs.writeFileSync(siteMapFile,sitemap);
console.log(i+" picture pages generated");
process.exit(0);