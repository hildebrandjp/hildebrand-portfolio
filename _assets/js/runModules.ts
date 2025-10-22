import ListBulletStyleHtml from "@/modules/ListBulletStyleHtml";

$(function() {
    const listBulletStyleHtml = new ListBulletStyleHtml();

    listBulletStyleHtml.init();
    
    window.modules = {};
    window.modules.ListBulletStyleHtml = listBulletStyleHtml;
});