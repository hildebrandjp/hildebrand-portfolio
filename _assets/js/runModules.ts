import ListBulletStyleHtml from "@/modules/ListBulletStyleHtml";
import CardAnimationEffect from "@/modules/CardAnimationEffect";
import ModalNavigation from "./modules/ModalNavigation";

$(function() {
    const listBulletStyleHtml = new ListBulletStyleHtml();
    const cardAnimationEffect = new CardAnimationEffect();
    const modalNavigation = new ModalNavigation();

    listBulletStyleHtml.init();
    modalNavigation.init();
    
    window.modules = window.modules || {};
    window.modules.ListBulletStyleHtml = listBulletStyleHtml;
    window.modules.CardAnimationEffect = cardAnimationEffect;
    window.modules.ModalNavigation = modalNavigation;
});