import ListBulletStyleHtml from "@/modules/ListBulletStyleHtml";
import CardAnimationEffect from "@/modules/CardAnimationEffect";

$(function() {
    const listBulletStyleHtml = new ListBulletStyleHtml();
    const cardAnimationEffect = new CardAnimationEffect();

    listBulletStyleHtml.init();
    
    window.modules = window.modules || {};
    window.modules.ListBulletStyleHtml = listBulletStyleHtml;
    window.modules.CardAnimationEffect = cardAnimationEffect;
});