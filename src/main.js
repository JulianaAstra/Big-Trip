import FiltersPresenter from './presenter/filters-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import TripsModel from './modell/trips-model.js';
import FilterModel from './modell/filter-model.js';
import TripsApiService from './trips-api-service.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const AUTHORIZATION = 'Basic d7hgj398fll45dfg';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const infoHeaderElement = document.querySelector('.trip-main');
const filtersContainerElement = document.querySelector('.trip-controls__filters');
const mainSectionElement = document.querySelector('.trip-events');


const tripsModel = new TripsModel({tripsApiService: new TripsApiService(END_POINT, AUTHORIZATION)});
const filterModel = new FilterModel();

const filtersPresenter = new FiltersPresenter({
  filtersContainer: filtersContainerElement,
  tripsModel,
  filterModel
});
const boardPresenter = new BoardPresenter({
  tripListContainer: mainSectionElement,
  tripsModel,
  filterModel,
  infoHeaderElement: infoHeaderElement
});
const tripInfoPresenter = new TripInfoPresenter({infoContainer: infoHeaderElement, tripsModel: tripsModel});

tripsModel.init()
  .finally(() => {
    tripInfoPresenter.init();
  });

filtersPresenter.init();
boardPresenter.init();
