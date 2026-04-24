import ListBulletStyleHtml from "@/modules/ListBulletStyleHtml";
import CardAnimationEffect from "@/modules/CardAnimationEffect";
import Modal from "./modules/Modal";
import State from "./modules/State";
import HamburgerMenu from "./modules/HamburgerMenu";
import { PortfolioShow } from "@/pages/portfolio";
import EdgeIconPositioner from "@/modules/EdgeIconPositioner";

$(function() {
    window.modules = window.modules || {};

    const listBulletStyleHtml = new ListBulletStyleHtml();
    const cardAnimationEffect = new CardAnimationEffect();
    const modal = new Modal();
    const state = new State();
    const hamburgerMenu = new HamburgerMenu();
    const portfolioShow = new PortfolioShow(state);
    const edgeIconPositioner = new EdgeIconPositioner();

    listBulletStyleHtml.init();
    modal.init();
    hamburgerMenu.init();
    edgeIconPositioner.init();

    window.modules.ListBulletStyleHtml = listBulletStyleHtml;
    window.modules.CardAnimationEffect = cardAnimationEffect;
    window.modules.Modal = modal;
    window.modules.State = state;
    window.modules.HamburgerMenu = hamburgerMenu;
    window.modules.PortfolioShow = portfolioShow;
    window.modules.EdgeIconPositioner = edgeIconPositioner;
});
