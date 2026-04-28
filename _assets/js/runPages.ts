import { StarIcon, CardMenuProfile } from "@/pages/home";
import LandingPage from "@/pages/landing";

$(function() {
    const starIcon = new StarIcon();
    const cardMenuProfile = new CardMenuProfile();
    const landingPage = new LandingPage();

    starIcon.autoRunPlaceOnEdgesOfSquaresWithResize();
    cardMenuProfile.attachClickEvent();
    landingPage.init();
    
    window.pages = window.pages || {};

    window.pages.StarIcon = starIcon;
    window.pages.CardMenuProfile = cardMenuProfile;
    window.pages.LandingPage = landingPage;
});
