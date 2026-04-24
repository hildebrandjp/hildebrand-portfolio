import State from '@/modules/State';

interface PortfolioItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    url: string;
    video_url?: string;
}

export default class PortfolioShow {
    private selectedPortfolioId: string | null = null;
    private portfolios: PortfolioItem[] = [];
    private state: State;

    constructor(state: State) {
        this.state = state;
        const el = document.getElementById('portfolio-json');
        this.portfolios = el ? JSON.parse(el.textContent || '[]') : [];
        this.init();
    }

    back() {
        const listOverlay = document.getElementById('modalOverlay1');
        const detailOverlay = document.getElementById('modalOverlay2');
        const detailModal = document.getElementById('modal-block-2');

        if (!detailOverlay || !detailModal) return;

        detailModal.classList.remove('portfolio-swipe-right-enter');
        detailModal.classList.add('portfolio-swipe-right-exit');

        window.setTimeout(() => {
            detailOverlay.classList.add('hidden');
            detailModal.classList.remove('portfolio-swipe-right-exit');
            if (listOverlay) listOverlay.classList.remove('hidden');
        }, 240);
    }

    close() {
        const listOverlay = document.getElementById('modalOverlay1');
        const detailOverlay = document.getElementById('modalOverlay2');
        const detailModal = document.getElementById('modal-block-2');

        if (detailOverlay) detailOverlay.classList.add('hidden');
        if (listOverlay) listOverlay.classList.add('hidden');
        if (detailModal) detailModal.classList.remove('portfolio-swipe-right-enter', 'portfolio-swipe-right-exit');
    }

    private init() {
        this.state.on('stateChanged', (state: any) => {
            this.loadPortfolio(state);
            this.loadUsefulLinks();
        });

        $(document).on('click', '.ul-useful-links a[data-portfolio-id]', (event: JQuery.TriggeredEvent) => {
            event.preventDefault();
            const portfolioId = $(event.currentTarget as Element).data('portfolio-id');
            if (!portfolioId) return;
            this.state.addObject('portfolioId', String(portfolioId));
        });
    }

    private loadPortfolio(state: any) {
        const portfolio = this.portfolios.find(p => p.id == state.portfolioId);
        if (!portfolio) return;

        this.selectedPortfolioId = portfolio.id;
        $('#portfolioInfoImg').attr('src', portfolio.url);
        $('#portfolioInfoTitle').text(portfolio.title);
        $('#portfolioInfoSubtitle').text(portfolio.subtitle);
        $('#portfolioInfoDesc').text(portfolio.description);
        $('#portfolioBreadcrumbCurrent').text(portfolio.title || 'Detail');

        const externalLink = portfolio.video_url || portfolio.url || '';
        const portfolioLink = $('#portfolioInfoLink');
        if (!externalLink) {
            portfolioLink.text('No URL available').attr('href', '#').addClass('is-disabled');
            return;
        }

        portfolioLink.text(externalLink).attr('href', externalLink).removeClass('is-disabled');
    }

    private loadUsefulLinks() {
        const ul = $('.ul-useful-links');
        ul.empty();
        this.portfolios
            .filter(p => p.id != this.selectedPortfolioId)
            .forEach(p => {
                ul.append(`<li><a href="javascript: (0);" data-portfolio-id="${p.id}">${p.title}</a></li>`);
            });
    }
}
