import { StarIcon, CardMenuProfile } from "@/pages/home";

$(function() {
    const starIcon = new StarIcon();
    const cardMenuProfile = new CardMenuProfile();

    starIcon.autoRunPlaceOnEdgesOfSquaresWithResize();
    cardMenuProfile.attachClickEvent();
    
    window.pages = window.pages || {};

    window.pages.StarIcon = starIcon;
    window.pages.CardMenuProfile = cardMenuProfile;
});