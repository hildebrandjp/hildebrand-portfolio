import ListBulletStyleHtml from "@/modules/ListBulletStyleHtml";
import CardAnimationEffect from "@/modules/CardAnimationEffect";
import Modal from "./modules/Modal";
import State from "./modules/State";
import HamburgerMenu from "./modules/HamburgerMenu";

$(function() {
    const listBulletStyleHtml = new ListBulletStyleHtml();
    const cardAnimationEffect = new CardAnimationEffect();
    const modal = new Modal();
    const state = new State();
    const hamburgerMenu = new HamburgerMenu();

    listBulletStyleHtml.init();
    modal.init();
    hamburgerMenu.init();
    
    window.modules = window.modules || {};
    window.modules.ListBulletStyleHtml = listBulletStyleHtml;
    window.modules.CardAnimationEffect = cardAnimationEffect;
    window.modules.Modal = modal;
    window.modules.State = state;
    window.modules.HamburgerMenu = hamburgerMenu;
});
